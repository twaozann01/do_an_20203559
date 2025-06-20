using Data.Interfaces;
using Mapster;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Shared;
using Shared.Entities;
using Shared.Models;
using Shared.Utils;


namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RepairmanFormController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public RepairmanFormController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<IActionResult> GetListAsync(
    [FromQuery] int offset = 0,
    [FromQuery] int limit = 10)
        {
            var pageData = await _unitOfWork.RepairmanFormRepository.GetPageAsync(offset, limit);

            return Ok(new
            {
                status = 200,
                message = "Lấy danh sách đơn đăng ký thành công.",
                data = new PageData<RepairmanFormDto>
                {
                    Items = pageData.Item1.Adapt<List<RepairmanFormDto>>(),
                    Total = pageData.Item2
                }
            });
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetailAsync([FromRoute] Guid id)
        {
            var repairman = await _unitOfWork.RepairmanFormRepository.GetDetailAsync(id);
            if (repairman == null)
            {
                return NotFound(new
                {
                    status = 404,
                    message = "Không tìm thấy đơn đăng ký kỹ thuật viên."
                });
            }

            return Ok(new
            {
                status = 200,
                message = "Lấy thông tin đơn đăng ký thành công.",
                data = repairman
            });
        }


        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromForm] CreateRepairmanFormRequest request)
        {
            if (request.UserId == null)
            {
                return BadRequest(new
                {
                    status = 400,
                    message = "Thiếu UserId"
                });
            }

            var repairmanForm = request.Adapt<Shared.Entities.RepairmanForm>();
            repairmanForm.CreatedAt = TimeHelper.GetVietnamTime();

            var repairmanFormDetail = request.Adapt<Shared.Entities.RepairmanFormDetail>();
            repairmanFormDetail.RepairmanFormId = repairmanForm.Id;
            repairmanFormDetail.CreatedAt = TimeHelper.GetVietnamTime();

            // Lưu file nếu có
            repairmanFormDetail.Degree = await SaveFileAsync(request.DegreeFile, "degrees");
            repairmanForm.CccdFront = await SaveFileAsync(request.CccdFront, "cccd");
            repairmanForm.CccdBack = await SaveFileAsync(request.CccdBack, "cccd");

            repairmanForm.City = request.City;
            repairmanForm.District = request.District;

            await _unitOfWork.RepairmanFormRepository.AddAsync(repairmanForm);
            await _unitOfWork.RepairmanFormDetailRepository.AddAsync(repairmanFormDetail);
            await _unitOfWork.SaveChangesAsync();

            return StatusCode(201, new
            {
                status = 201,
                message = "Tạo đơn đăng ký kỹ thuật viên thành công.",
                data = new
                {
                    repairmanForm.Id,
                    repairmanForm.UserId,
                    repairmanForm.City,
                    repairmanForm.District
                }
            });
        }


        private async Task<string?> SaveFileAsync(IFormFile? file, string folderName)
        {
            if (file == null || file.Length == 0) return null;

            string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", folderName);
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            string fileName = $"{Guid.NewGuid():N}{Path.GetExtension(file.FileName)}";
            string filePath = Path.Combine(uploadsFolder, fileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            return $"/uploads/{folderName}/{fileName}";
        }
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUserId(Guid userId)
        {
            var forms = await _unitOfWork.RepairmanFormRepository.GetByUserIdAsync(userId);
            var result = forms.Select(x => x.Adapt<RepairmanFormDto>()).ToList();

            return Ok(new
            {
                status = 200,
                message = "Lấy danh sách đơn theo người dùng thành công.",
                data = result
            });
        }


        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatusAsync([FromRoute] Guid id, [FromBody] UpdateRepairmanFormStatusRequest request)
        {
            try
            {
                var repairmanForm = await _unitOfWork.RepairmanFormRepository.GetDetailAsync(id);
                if (repairmanForm == null)
                {
                    return NotFound(new
                    {
                        status = 404,
                        message = "Không tìm thấy đơn đăng ký."
                    });
                }

                repairmanForm.Status = request.Status;

                if (request.Status == RepairmanFormStatus.Accepted.ToString())
                {
                    var user = await _unitOfWork.UserRepository.GetByIdAsync(repairmanForm.UserId);
                    if (user == null)
                    {
                        return BadRequest(new
                        {
                            status = 400,
                            message = "Không tìm thấy người dùng."
                        });
                    }

                    if (repairmanForm.Detail == null)
                    {
                        return BadRequest(new
                        {
                            status = 400,
                            message = "Chi tiết đơn không tồn tại."
                        });
                    }

                    user.Role = UserRole.Repairman.ToString();
                    user.RepairmanInfos ??= new List<RepairmanProfile>();

                    user.RepairmanInfos.Add(new RepairmanProfile
                    {
                        ServiceDeviceId = repairmanForm.Detail.ServiceDeviceId,
                        DeviceName = repairmanForm.Detail.ServiceDevice?.Name ?? "",
                        YearsOfExperience = repairmanForm.Detail.YearsOfExperience ?? 0,
                        Description = repairmanForm.Detail.Description ?? "",
                        Degree = repairmanForm.Detail.Degree ?? ""
                    });
                }

                await _unitOfWork.SaveChangesAsync();

                return Ok(new
                {
                    status = 200,
                    message = "Cập nhật trạng thái đơn đăng ký thành công."
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] Lỗi xử lý duyệt đơn: {ex.Message}");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi khi duyệt đơn."
                });
            }
        }



    }
}
