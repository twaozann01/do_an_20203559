using Data.Interfaces;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Shared.Entities;
using Shared.Filters;
using Shared.Models;
using Shared.Utils;
using System.IO;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IAddressUserRepository _addressUserRepository;
        private readonly IUnitOfWork _unitOfWork;

        public UserController(
            IUserRepository userRepository,
            IAddressUserRepository addressUserRepository,
            IUnitOfWork unitOfWork
            )
        {
            _userRepository = userRepository;
            _addressUserRepository = addressUserRepository;
            _unitOfWork = unitOfWork;
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserByIdAsync([FromRoute] Guid id)
        {
            var user = await _userRepository.GetDetailAsync(id);

            if (user == null)
            {
                return NotFound(new
                {
                    status = 404,
                    message = "Không tìm thấy người dùng."
                });
            }

            return Ok(new
            {
                status = 200,
                message = "Lấy thông tin người dùng thành công.",
                data = user.Adapt<UserDto>()
            });
        }


        [HttpGet]
        public async Task<IActionResult> GetListUserAsync([FromQuery] UserFilter request)
        {
            var users = await _userRepository.GetListWithFilterAsync(request);
            var result = users.Adapt<List<UserDto>>();

            return Ok(new
            {
                status = 200,
                message = result.Count == 0 ? "Không có tài khoản nào phù hợp." : "Lấy danh sách tài khoản thành công.",
                data = result
            });
        }


        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateUserAsync(
     [FromRoute] Guid id,
     [FromForm] UpdateUserRequest request)
        {
            try
            {

                // Không tìm thấy user
                var user = await _userRepository.GetByIdAsync(id);
                if (user == null)
                {
                    return NotFound(new
                    {
                        status = 404,
                        message = "Không tìm thấy người dùng."
                    });
                }

                // Gán thông tin
                user.FullName = request.FullName!;
                user.Gender = request.Gender;
                user.Email = request.Email;
                user.Bio = request.Bio;
                if (request.Average.HasValue) user.Average = request.Average.Value;
                if (request.ReviewCount.HasValue) user.ReviewCount = request.ReviewCount.Value;
                if (request.DateOfBirth.HasValue)
                {
                    user.DateOfBirth = DateTime.SpecifyKind(request.DateOfBirth.Value, DateTimeKind.Utc);
                }

                // Avatar
                if (request.AvatarFile != null)
                {
                    string fileExtension = Path.GetExtension(request.AvatarFile.FileName);
                    string fileName = $"{Guid.NewGuid():N}{fileExtension}";
                    string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "avatars");
                    if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
                    string filePath = Path.Combine(uploadsFolder, fileName);
                    using var stream = new FileStream(filePath, FileMode.Create);
                    await request.AvatarFile.CopyToAsync(stream);
                    user.Avatar = $"/uploads/avatars/{fileName}";
                }

                await _userRepository.UpdateAsync(user, true);
                return Ok(new
                {
                    status = 200,
                    message = "Cập nhật thông tin thành công."
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine("Lỗi cập nhật user: " + ex.Message);
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Lỗi máy chủ: " + ex.Message
                });
            }
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUserAsync([FromRoute] Guid id)
        {
            var user = await _userRepository.GetByIdAsync(id);

            if (user == null)
            {
                return NotFound(new
                {
                    status = 404,
                    message = "Không tìm thấy người dùng."
                });
            }

            await _userRepository.DeleteAsync(user, true);

            return Ok(new
            {
                status = 200,
                message = "Xoá tài khoản thành công."
            });
        }


        [HttpPatch("{id}/password")]
        [Authorize]
        public async Task<IActionResult> ChangePasswordAsync(
    [FromRoute] Guid id,
    [FromBody] ChangePasswordRequest request)
        {

            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                return NotFound(new
                {
                    status = 404,
                    message = "Không tìm thấy người dùng."
                });
            }

            if (!PasswordHelper.VerifyPassword(request.OldPassword!, user.Password))
            {
                return BadRequest(new
                {
                    status = 400,
                    message = "Mật khẩu cũ không chính xác."
                });
            }

            user.Password = PasswordHelper.HashPassword(request.NewPassword!);
            await _userRepository.UpdateAsync(user, true);

            return Ok(new
            {
                status = 200,
                message = "Đổi mật khẩu thành công."
            });
        }


        [HttpPatch("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ChangeStatusAsync(
     [FromRoute] Guid id,
     [FromBody] ChangeUserStatusRequest request)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                return NotFound(new
                {
                    status = 404,
                    message = "Không tìm thấy người dùng."
                });
            }

            user.Status = request.Status;
            await _userRepository.UpdateAsync(user, true);

            return Ok(new
            {
                status = 200,
                message = "Cập nhật trạng thái tài khoản thành công."
            });
        }


        [HttpPatch("{id}/role")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ChangeRoleAsync(
    [FromRoute] Guid id,
    [FromBody] ChangeUserRoleRequest request)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                return NotFound(new
                {
                    status = 404,
                    message = "Không tìm thấy người dùng."
                });
            }

            user.Role = request.Role;
            await _userRepository.UpdateAsync(user, true);

            return Ok(new
            {
                status = 200,
                message = "Cập nhật vai trò tài khoản thành công."
            });
        }


        [HttpGet("{userId}/address")]
        [Authorize]
        public async Task<IActionResult> GetAddressAsync([FromRoute] Guid userId)
        {

            // Không tìm thấy user
            var userExists = await _userRepository.AnyAsync(x => x.Id == userId);
            if (!userExists)
            {
                return NotFound(new
                {
                    status = 404,
                    message = "Không tìm thấy người dùng."
                });
            }

            var addresses = await _addressUserRepository.GetByUserIdAsync(userId);
            var result = addresses.Adapt<List<AddressUserDto>>();

            return Ok(new
            {
                status = 200,
                message = result.Count == 0 ? "Người dùng chưa có địa chỉ nào." : "Lấy danh sách địa chỉ thành công.",
                data = result
            });
        }


        [HttpPost("{userId}/address")]
        [Authorize]
        public async Task<IActionResult> AddAddressAsync(
    [FromRoute] Guid userId,
    [FromBody] CreateAddressUserRequest request)
        {

            // Không tồn tại user
            var userExists = await _userRepository.AnyAsync(x => x.Id == userId);
            if (!userExists)
            {
                return NotFound(new
                {
                    status = 404,
                    message = "Không tìm thấy người dùng."
                });
            }

            // Tạo địa chỉ
            var address = request.Adapt<AddressUser>();
            address.UserId = userId;
            address.CreatedAt = TimeHelper.GetVietnamTime();

            await _addressUserRepository.AddAsync(address, true);

            // Nếu chọn làm địa chỉ chính
            if (request.AddressMain == true)
            {
                await _addressUserRepository.UpdateMainAddressAsync(userId, address.Id);
            }

            return StatusCode(201, new
            {
                status = 201,
                message = "Thêm địa chỉ thành công."
            });
        }


        [HttpPut("{userId}/address/{addressId}")]
        [Authorize]
        public async Task<IActionResult> UpdateAddressAsync(
    [FromRoute] Guid userId,
    [FromRoute] Guid addressId,
    [FromBody] UpdateAddressUserRequest request)
        {

            var userExists = await _userRepository.AnyAsync(x => x.Id == userId);
            if (!userExists)
            {
                return NotFound(new
                {
                    status = 404,
                    message = "Không tìm thấy người dùng."
                });
            }

            var address = await _addressUserRepository.GetByIdAsync(addressId);
            if (address == null || address.UserId != userId)
            {
                return NotFound(new
                {
                    status = 404,
                    message = "Không tìm thấy địa chỉ của người dùng này."
                });
            }

            // Nếu được chọn làm địa chỉ chính
            if (request.AddressMain == true)
            {
                await _addressUserRepository.UpdateMainAddressAsync(userId, addressId);
            }

            request.Adapt(address);
            await _addressUserRepository.UpdateAsync(address, true);

            return Ok(new
            {
                status = 200,
                message = "Cập nhật địa chỉ thành công."
            });
        }


        [HttpDelete("{userId}/address/{addressId}")]
        [Authorize]
        public async Task<IActionResult> DeleteAddressAsync(
    [FromRoute] Guid userId,
    [FromRoute] Guid addressId)
        {

            var userExists = await _userRepository.AnyAsync(x => x.Id == userId);
            if (!userExists)
            {
                return NotFound(new
                {
                    status = 404,
                    message = "Không tìm thấy người dùng."
                });
            }

            var address = await _addressUserRepository.GetByIdAsync(addressId);
            if (address == null || address.UserId != userId)
            {
                return NotFound(new
                {
                    status = 404,
                    message = "Không tìm thấy địa chỉ của người dùng này."
                });
            }

            await _addressUserRepository.DeleteAsync(address, true);

            return Ok(new
            {
                status = 200,
                message = "Xoá địa chỉ thành công."
            });
        }




        [HttpGet("{userId}/address/{addressId}")]
        public async Task<IActionResult> GetAddressByIdAsync(
        [FromRoute] Guid userId,
        [FromRoute] Guid addressId)
        {
            // Kiểm tra người dùng có tồn tại không
            var userExists = await _userRepository.AnyAsync(x => x.Id == userId);
            if (!userExists)
            {
                return NotFound(new
                {
                    status = 404,
                    message = "Không tìm thấy người dùng."
                });
            }

            // Lấy địa chỉ theo ID
            var address = await _addressUserRepository.GetByIdAsync(addressId);
            if (address == null || address.UserId != userId)
            {
                return NotFound(new
                {
                    status = 404,
                    message = "Không tìm thấy địa chỉ của người dùng này."
                });
            }

            return Ok(new
            {
                status = 200,
                message = "Lấy địa chỉ thành công.",
                data = address.Adapt<AddressUserDto>()
            });
        }


        [HttpPatch("{id}/toggle-working-status")]
        public async Task<IActionResult> ToggleWorkingStatus([FromRoute] Guid id)
        {
            var user = await _unitOfWork.UserRepository.GetByIdAsync(id);
            if (user == null)
            {
                return NotFound(new
                {
                    status = 404,
                    message = "Không tìm thấy người dùng."
                });
            }

            user.WorkingStatus = user.WorkingStatus == "Online" ? "Offline" : "Online";
            await _unitOfWork.CompleteAsync();

            return Ok(new
            {
                status = 200,
                message = "Cập nhật trạng thái hoạt động thành công.",
                workingStatus = user.WorkingStatus
            });
        }
    }
}
