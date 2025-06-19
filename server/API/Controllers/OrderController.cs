
using Data.Interfaces;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Shared;
using Shared.Entities;
using Shared.Filters;
using Shared.Models;
using Shared.Utils;
using System.Security.Claims;
using Shared.Constants;
using API.Services;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IVatService _vatService;
        private readonly RepairmanRatingService _ratingService;


        public OrderController(IUnitOfWork unitOfWork, IVatService vatService, RepairmanRatingService ratingService)
        {
            _unitOfWork = unitOfWork;
            _vatService = vatService;
            _ratingService = ratingService; // ✅ gán đúng biến truyền vào
        }


        [HttpGet]
        public async Task<IActionResult> GetListAsync([FromQuery] OrderFilter filter)
        {
            var orders = await _unitOfWork.OrderRepository.GetPageByFilterAsync(filter);
            return Ok(new PageData<OrderDto>
            {
                Items = orders.Item1.Adapt<List<OrderDto>>(),
                Total = orders.Item2
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetailAsync(Guid id)
        {
            var order = await _unitOfWork.OrderRepository.GetDetailAsync(id);
            if (order == null) return NotFound();
            return Ok(order);
        }


        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromForm] CreateOrderRequest request)
        {
            try
            {
                if (request.OrderDetails == null || !request.OrderDetails.Any())
                    return BadRequest("Đơn hàng phải có ít nhất một chi tiết thiết bị.");

                var now = TimeHelper.GetVietnamTime();


                var order = request.Adapt<Order>();
                order.Id = Guid.CreateVersion7();
                order.CreatedAt = now;
                order.RepairDate = request.RepairDate;
                order.Status = OrderStatus.Pending.ToString();
                order.ServiceDeviceId = request.ServiceDeviceId;
                order.OrderDetails = new List<OrderDetail>();

                // ✅ Sinh OrderCode
                var countToday = await _unitOfWork.OrderRepository.CountByDateAsync(now.Date);
                var orderCode = "ORD" + now.ToString("yyMMdd") + (countToday + 1).ToString("D6");
                order.OrderCode = orderCode;

                foreach (var detail in request.OrderDetails)
                {
                    if (detail.DeviceDetailId == null)
                        return BadRequest("Thiếu DeviceDetailId.");

                    var deviceDetail = await _unitOfWork.DeviceDetailRepository.GetByIdAsync(detail.DeviceDetailId.Value);
                    if (deviceDetail == null)
                        return BadRequest("DeviceDetail không tồn tại.");

                    var orderDetail = new OrderDetail
                    {
                        Id = Guid.NewGuid(),
                        OrderId = order.Id,
                        DeviceDetailId = detail.DeviceDetailId.Value,
                        Description = detail.Description,
                        MinPrice = (int?)deviceDetail.MinPrice
                    };

                    // Xử lý ảnh
                    if (detail.ImageFile != null && detail.ImageFile.Length > 0)
                    {
                        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(detail.ImageFile.FileName)}";
                        var path = Path.Combine("wwwroot", "uploads", "orders", "images", fileName);
                        Directory.CreateDirectory(Path.GetDirectoryName(path)!);
                        using var stream = new FileStream(path, FileMode.Create);
                        await detail.ImageFile.CopyToAsync(stream);
                        orderDetail.Image = $"/uploads/orders/images/{fileName}";
                    }

                    // Xử lý video
                    if (detail.VideoFile != null && detail.VideoFile.Length > 0)
                    {
                        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(detail.VideoFile.FileName)}";
                        var path = Path.Combine("wwwroot", "uploads", "orders", "videos", fileName);
                        Directory.CreateDirectory(Path.GetDirectoryName(path)!);
                        using var stream = new FileStream(path, FileMode.Create);
                        await detail.VideoFile.CopyToAsync(stream);
                        orderDetail.Video = $"/uploads/orders/videos/{fileName}";
                    }

                    order.OrderDetails.Add(orderDetail);
                }

                order.Total = order.OrderDetails.Sum(d => d.MinPrice ?? 0);

                await _unitOfWork.OrderRepository.AddAsync(order);
                await _unitOfWork.SaveChangesAsync();

                return Created($"/api/Order/{order.Id}", new { order.Id, order.OrderCode });
            }
            catch (Exception ex)
            {
                Console.WriteLine("🔥 Lỗi khi tạo đơn hàng: " + ex.Message);
                return StatusCode(500, "Lỗi server nội bộ: " + ex.Message);
            }
        }



        [HttpPatch("{id}/rate")]
        public async Task<IActionResult> RateOrderAsync([FromRoute] Guid id, [FromBody] RateOrderRequest request)
        {
            var order = await _unitOfWork.OrderRepository.GetByIdAsync(id);
            if (order == null)
                return NotFound("Không tìm thấy đơn hàng.");

            var now = TimeHelper.GetVietnamTime();
            // Kiểm tra hạn đánh giá: trong 15 ngày kể từ ngày hoàn thành
            if (order.CompletedAt == null || (now - order.CompletedAt.Value).TotalDays > 15)
                return BadRequest("Đã quá hạn đánh giá đơn hàng (15 ngày).");

            // Nếu đã đánh giá rồi
            if (order.RatingNumber.HasValue)
            {
                if (order.HasUpdatedRating)
                    return BadRequest("Bạn chỉ có thể sửa đánh giá 1 lần.");

                if (order.RatingDate == null || (now - order.RatingDate.Value).TotalDays > 30)
                    return BadRequest("Đã quá hạn sửa đánh giá (30 ngày).");

                // Sửa đánh giá
                order.RatingNumber = request.RatingNumber;
                order.RatingDescription = request.RatingDescription;
                order.RatingUpdatedDate = now;
                order.HasUpdatedRating = true;
            }
            else
            {
                // Đánh giá lần đầu
                order.RatingNumber = request.RatingNumber;
                order.RatingDescription = request.RatingDescription;
                order.RatingDate = now;
            }

            await _unitOfWork.OrderRepository.SaveChangesAsync();
            await _ratingService.UpdateRepairmanRatingAsync(order.RepairmanId!.Value);
            return NoContent();
        }


        // [HttpPatch("{id}/repair")]
        // public async Task<IActionResult> RepairOrderAsync([FromRoute] Guid id, [FromBody] RepairOrderRequest request)
        // {
        //     var order = await _unitOfWork.OrderRepository.GetByIdAsync(id);
        //     if (order == null)
        //     {
        //         return NotFound("Order not found.");
        //     }
        //     if (order.Status == OrderStatus.Completed.ToString())
        //     {
        //         return BadRequest("Cannot repair completed order");
        //     }

        //     request.Adapt(order);
        //     await _unitOfWork.OrderRepository.SaveChangesAsync();

        //     return NoContent();
        // }

        // [HttpPatch("{id}/payment")]
        // public async Task<IActionResult> PaymentOrderAsync([FromRoute] Guid id, [FromBody] PaymentOrderRequest request)
        // {
        //     var order = await _unitOfWork.OrderRepository.GetByIdAsync(id);
        //     if (order == null)
        //     {
        //         return NotFound("Order not found.");
        //     }

        //     request.Adapt(order);
        //     await _unitOfWork.OrderRepository.SaveChangesAsync();

        //     return NoContent();
        // }

        [HttpPatch("{id}/cancel-order")]
        public async Task<IActionResult> CancelOrderAsync([FromRoute] Guid id)
        {
            var order = await _unitOfWork.OrderRepository.GetByIdAsync(id);
            if (order == null)
            {
                return NotFound("Order not found.");
            }
            if (order.Status != OrderStatus.Pending.ToString())
            {
                return BadRequest("Only pending orders can be canceled.");
            }
            order.Status = OrderStatus.Canceled.ToString();
            order.CanceledAt = TimeHelper.GetVietnamTime();
            await _unitOfWork.OrderRepository.SaveChangesAsync();
            return NoContent();
        }

        [HttpPatch("{id}/complete-order")]
        public async Task<IActionResult> ConfirmComplete(Guid id)
        {
            var order = await _unitOfWork.OrderRepository.GetByIdAsync(id);
            if (order == null) return NotFound("Đơn hàng không tồn tại.");

            if (order.Status != OrderStatus.InProgress.ToString())
                return BadRequest("Chỉ có thể hoàn thành đơn hàng đang sửa.");

            order.Status = OrderStatus.Completed.ToString();
            var now = TimeHelper.GetVietnamTime();
            order.CompletedAt = now;
            order.PaymentTerm = now.AddDays(5);
            order.PaymentStatus = false;

            await _unitOfWork.OrderRepository.SaveChangesAsync();

            return Ok();
        }
        // [HttpGet("code/{orderCode}")]
        // public async Task<IActionResult> GetByOrderCodeAsync(string orderCode)
        // {
        //     var order = await _unitOfWork.OrderRepository.GetByOrderCodeAsync(orderCode);

        //     if (order == null)
        //         return NotFound($"Không tìm thấy đơn hàng với mã: {orderCode}");

        //     return Ok(order);
        // }
        [HttpPatch("{id}/start-repair")]
        public async Task<IActionResult> StartRepairAsync(Guid id)
        {
            var order = await _unitOfWork.OrderRepository.GetByIdAsync(id);
            if (order == null)
            {
                return NotFound("Không tìm thấy đơn hàng");
            }

            if (order.Status != OrderStatus.InProgress.ToString())
            {
                return BadRequest("Chỉ được cập nhật thời gian bắt đầu sửa khi trạng thái là InProgress");
            }

            order.InProgressAt = TimeHelper.GetVietnamTime();


            await _unitOfWork.CompleteAsync();
            return Ok("Đã cập nhật thời gian bắt đầu sửa chữa");
        }

        // [Authorize(Roles = "Repairman")]
        // [HttpPost("payment/{orderId}/pay")]
        // public async Task<IActionResult> PayOrder(Guid orderId)
        // {
        //     var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        //     var order = await _unitOfWork.OrderRepository.GetByIdAsync(orderId);
        //     if (order == null || order.RepairmanId != Guid.Parse(userId))
        //         return Forbid();

        //     if (order.PaymentStatus == true)
        //         return BadRequest("Đơn hàng đã thanh toán.");

        //     var user = await _unitOfWork.UserRepository.GetByIdAsync(Guid.Parse(userId));
        //     var vat = (await _vatService.GetCurrentVatAsync()) ?? AppConstants.SERVICE_FEE_PERCENT;
        //     var totalPayment = (order.Total ?? 0) * vat;

        //     if (user.WalletBalance < totalPayment)
        //         return BadRequest("Số dư ví không đủ.");

        //     order.PaymentStatus = true;
        //     await _unitOfWork.SaveChangesAsync();

        //     return Ok("Thanh toán thành công");
        // }

        [HttpPatch("{id}/update-payment")]
        public async Task<IActionResult> UpdatePaymentStatus(Guid id)
        {
            var order = await _unitOfWork.OrderRepository.GetByIdAsync(id);
            if (order == null)
            {
                return NotFound("Không tìm thấy đơn hàng.");
            }

            if (order.PaymentStatus == true)
            {
                return BadRequest("Đơn hàng đã được thanh toán.");
            }

            order.PaymentStatus = true;
            order.PaymentDate = TimeHelper.GetVietnamTime(); // nếu bạn có cột này
            await _unitOfWork.OrderRepository.SaveChangesAsync();

            return Ok("✅ Đã cập nhật trạng thái thanh toán.");
        }

        [HttpPut("{id}/accept")]
        public async Task<IActionResult> AcceptOrder(Guid id, [FromBody] AcceptOrderRequest request)
        {
            var order = await _unitOfWork.OrderRepository.GetByIdAsync(id); // ✅ Sửa lại dùng UnitOfWork

            if (order == null)
                return NotFound("Không tìm thấy đơn hàng");

            if (order.Status != "Pending")
                return BadRequest("Đơn hàng đã được xử lý");

            order.RepairmanId = request.RepairmanId;
            order.FoundRepairmanAt = TimeHelper.GetVietnamTime(); // ✅ dùng giờ Việt Nam chuẩn
            order.Status = OrderStatus.InProgress.ToString(); // ✅ dùng enum chuẩn nếu có

            await _unitOfWork.OrderRepository.SaveChangesAsync(); // ✅ lưu thay đổi

            return Ok(new
            {
                message = "Kỹ thuật viên đã nhận đơn",
                order.Id,
                order.Status,
                order.RepairmanId
            });
        }






    }
}
