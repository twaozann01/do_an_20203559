
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
            _ratingService = ratingService; 
        }


        [HttpGet]
public async Task<IActionResult> GetListAsync([FromQuery] OrderFilter filter)
{
    var (orders, total) = await _unitOfWork.OrderRepository.GetPageByFilterAsync(filter);

    if (total == 0)
    {
        return Ok(new
        {
            status = 200,
            message = "Không có đơn hàng nào phù hợp với bộ lọc.",
            data = new PageData<OrderDto>
            {
                Items = new List<OrderDto>(),
                Total = 0
            }
        });
    }

    return Ok(new
    {
        status = 200,
        message = "Lấy danh sách đơn hàng thành công.",
        data = new PageData<OrderDto>
        {
            Items = orders.Adapt<List<OrderDto>>(),
            Total = total
        }
    });
}


        [HttpGet("{id}")]
public async Task<IActionResult> GetDetailAsync(Guid id)
{
    var order = await _unitOfWork.OrderRepository.GetDetailAsync(id);

    if (order == null)
    {
        return NotFound(new
        {
            status = 404,
            message = "Không tìm thấy đơn hàng."
        });
    }

    return Ok(new
    {
        status = 200,
        message = "Lấy chi tiết đơn hàng thành công.",
        data = order
    });
}



        [HttpPost]
public async Task<IActionResult> CreateAsync([FromForm] CreateOrderRequest request)
{
    try
    {
        if (request.OrderDetails == null || !request.OrderDetails.Any())
        {
            return BadRequest(new
            {
                status = 400,
                message = "Thiếu thông tin bắt buộc: Đơn hàng phải có ít nhất một chi tiết thiết bị."
            });
        }

        if (request.RepairDate < TimeHelper.GetVietnamTime().Date)
        {
            return BadRequest(new
            {
                status = 400,
                message = "Ngày sửa chữa không hợp lệ. Phải từ hôm nay trở đi."
            });
        }

        var now = TimeHelper.GetVietnamTime();
        var order = request.Adapt<Order>();
        order.Id = Guid.CreateVersion7();
        order.CreatedAt = now;
        order.Status = OrderStatus.Pending.ToString();
        order.OrderCode = "ORD" + now.ToString("yyMMdd") + (await _unitOfWork.OrderRepository.CountByDateAsync(now.Date) + 1).ToString("D6");
        order.OrderDetails = new();

        foreach (var detail in request.OrderDetails)
        {
            if (detail.DeviceDetailId == null)
            {
                return BadRequest(new
                {
                    status = 400,
                    message = "Thiếu thông tin bắt buộc: DeviceDetailId không được để trống."
                });
            }

            var deviceDetail = await _unitOfWork.DeviceDetailRepository.GetByIdAsync(detail.DeviceDetailId.Value);
            if (deviceDetail == null)
            {
                return BadRequest(new
                {
                    status = 400,
                    message = "DeviceDetail không tồn tại."
                });
            }

            var orderDetail = new OrderDetail
            {
                Id = Guid.NewGuid(),
                OrderId = order.Id,
                DeviceDetailId = detail.DeviceDetailId.Value,
                Description = detail.Description,
            };

            if (detail.ImageFile != null && detail.ImageFile.Length > 0)
            {
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(detail.ImageFile.FileName)}";
                var path = Path.Combine("wwwroot", "uploads", "orders", "images", fileName);
                Directory.CreateDirectory(Path.GetDirectoryName(path)!);
                using var stream = new FileStream(path, FileMode.Create);
                await detail.ImageFile.CopyToAsync(stream);
                orderDetail.Image = $"/uploads/orders/images/{fileName}";
            }

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

        return StatusCode(201, new
        {
            status = 201,
            message = "Tạo đơn hàng thành công.",
            data = new { order.Id, order.OrderCode }
        });
    }
    catch (Exception ex)
    {
        Console.WriteLine("🔥 Lỗi khi tạo đơn hàng: " + ex.Message);
        return StatusCode(500, new
        {
            status = 500,
            message = "Lỗi server nội bộ: " + ex.Message
        });
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
