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

        [HttpPost]
        public async Task<IActionResult> CreateUserAsync([FromForm] CreateUserRequest request)
        {
            var user = request.Adapt<User>();
            user.Password = PasswordHelper.HashPassword(request.Password!);
            user.CreatedAt = TimeHelper.GetVietnamTime();
            Console.WriteLine("Thời gian tạo: " + user.CreatedAt);

            if (request.AvatarFile != null)
            {
                string fileExtension = Path.GetExtension(request.AvatarFile.FileName);
                string fileName = $"{Guid.NewGuid().ToString("N")}{fileExtension}";

                string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "avatars");

                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                string filePath = Path.Combine(uploadsFolder, fileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await request.AvatarFile.CopyToAsync(fileStream);
                }

                user.Avatar = $"/uploads/avatars/{fileName}";
            }

            await _unitOfWork.UserRepository.AddAsync(user, true);
            await _unitOfWork.CartRepository.AddAsync(new Cart
            {
                UserId = user.Id,
                Qty = 0
            }, true);
            return Created();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserByIdAsync([FromRoute] Guid id)
        {
            var user = await _userRepository.GetDetailAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user.Adapt<UserDto>());
        }

        [HttpGet]
        public async Task<IActionResult> GetListUserAsync([FromQuery] UserFilter request)
        {
            var users = await _userRepository.GetListWithFilterAsync(request);
            return Ok(users.Adapt<List<UserDto>>());
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateUserAsync(
        [FromRoute] Guid id,
        [FromForm] UpdateUserRequest request)
        {
            try
            {
                var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                bool isAdmin = User.IsInRole("Admin");
                if (!isAdmin && currentUserId != id.ToString())
                {
                    return Forbid("You do not have permission to update this user.");
                }

                var user = await _userRepository.GetByIdAsync(id);
                if (user == null)
                {
                    return NotFound();
                }

                // Gán từng trường một cách an toàn
                user.FullName = request.FullName!;
                user.Gender = request.Gender;
                user.Email = request.Email;
                user.Bio = request.Bio;
                if (request.Average.HasValue) user.Average = request.Average.Value;
                if (request.ReviewCount.HasValue) user.ReviewCount = request.ReviewCount.Value;

                // ⚠️ Ép kiểu DateTime sang UTC để tránh lỗi PostgreSQL
                if (request.DateOfBirth.HasValue)
                {
                    user.DateOfBirth = DateTime.SpecifyKind(request.DateOfBirth.Value, DateTimeKind.Utc);
                }

                // Xử lý avatar nếu có upload
                if (request.AvatarFile != null)
                {
                    string fileExtension = Path.GetExtension(request.AvatarFile.FileName);
                    string fileName = $"{Guid.NewGuid():N}{fileExtension}";

                    string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "avatars");
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    string filePath = Path.Combine(uploadsFolder, fileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await request.AvatarFile.CopyToAsync(fileStream);
                    }

                    user.Avatar = $"/uploads/avatars/{fileName}";
                }

                await _userRepository.UpdateAsync(user, true);
                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Lỗi cập nhật user: " + ex.Message);
                return StatusCode(500, "Lỗi server: " + ex.Message);
            }
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUserAsync([FromRoute] Guid id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            await _userRepository.DeleteAsync(user, true);
            return NoContent();
        }

        [HttpPatch("{id}/password")]
        [Authorize]
        public async Task<IActionResult> ChangePasswordAsync(
            [FromRoute] Guid id,
            [FromBody] ChangePasswordRequest request)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            bool isAdmin = User.IsInRole("Admin");
            if (!isAdmin && currentUserId != id.ToString())
            {
                return Forbid("You do not have permission to change this user's password.");
            }

            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            if (!PasswordHelper.VerifyPassword(request.OldPassword!, user.Password))
            {
                return BadRequest("Invalid email or password.");
            }
            user.Password = PasswordHelper.HashPassword(request.NewPassword!);
            await _userRepository.UpdateAsync(user, true);
            return NoContent();
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
                return NotFound();
            }
            user.Status = request.Status;
            await _userRepository.UpdateAsync(user, true);
            return NoContent();
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
                return NotFound();
            }
            user.Role = request.Role;
            await _userRepository.UpdateAsync(user, true);
            return NoContent();
        }

        [HttpGet("{userId}/address")]
        [Authorize]
        public async Task<IActionResult> GetAddressAsync([FromRoute] Guid userId)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            bool isAdmin = User.IsInRole("Admin");
            if (!isAdmin && currentUserId != userId.ToString())
            {
                return Forbid("You do not have permission to view this user's address.");
            }
            var user = await _userRepository.AnyAsync(x => x.Id == userId);
            if (!user)
            {
                return NotFound();
            }
            var addresses = await _addressUserRepository.GetByUserIdAsync(userId);
            return Ok(addresses.Adapt<List<AddressUserDto>>());
        }

        [HttpPost("{userId}/address")]
        [Authorize]
        public async Task<IActionResult> AddAddressAsync(
            [FromRoute] Guid userId,
            [FromBody] CreateAddressUserRequest request)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            bool isAdmin = User.IsInRole("Admin");
            if (!isAdmin && currentUserId != userId.ToString())
            {
                return Forbid("You do not have permission to add an address for this user.");
            }

            var user = await _userRepository.AnyAsync(x => x.Id == userId);
            if (!user)
            {
                return NotFound();
            }

            var address = request.Adapt<AddressUser>();
            address.UserId = userId;
            address.CreatedAt = TimeHelper.GetVietnamTime();
            await _addressUserRepository.AddAsync(address, true);

            if (request.AddressMain == true)
            {
                await _addressUserRepository.UpdateMainAddressAsync(userId, address.Id);
            }
            return Created();
        }

        [HttpPut("{userId}/address/{addressId}")]
[Authorize]
public async Task<IActionResult> UpdateAddressAsync(
    [FromRoute] Guid userId,
    [FromRoute] Guid addressId,
    [FromBody] UpdateAddressUserRequest request)
{
    var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    bool isAdmin = User.IsInRole("Admin");
    if (!isAdmin && currentUserId != userId.ToString())
    {
        return Forbid("You do not have permission to update this user's address.");
    }

    var user = await _userRepository.AnyAsync(x => x.Id == userId);
    if (!user)
    {
        return NotFound();
    }

    var address = await _addressUserRepository.GetByIdAsync(addressId);
    if (address == null || address.UserId != userId)
    {
        return NotFound();
    }

    // Nếu đang set addressMain = true => cần tắt các địa chỉ chính khác
    if (request.AddressMain == true)
    {
        await _addressUserRepository.UpdateMainAddressAsync(userId, addressId);
    }

    request.Adapt(address);
    await _addressUserRepository.UpdateAsync(address, true);

    return NoContent();
}

        [HttpDelete("{userId}/address/{addressId}")]
        [Authorize]
        public async Task<IActionResult> DeleteAddressAsync(
            [FromRoute] Guid userId,
            [FromRoute] Guid addressId)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            bool isAdmin = User.IsInRole("Admin");
            if (!isAdmin && currentUserId != userId.ToString())
            {
                return Forbid("You do not have permission to delete this user's address.");
            }
            var user = await _userRepository.AnyAsync(x => x.Id == userId);
            if (!user)
            {
                return NotFound();
            }
            var address = await _addressUserRepository.GetByIdAsync(addressId);
            if (address == null || address.UserId != userId)
            {
                return NotFound();
            }
            await _addressUserRepository.DeleteAsync(address, true);
            return NoContent();
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
                return NotFound();
            }

            // Lấy địa chỉ theo ID
            var address = await _addressUserRepository.GetByIdAsync(addressId);
            if (address == null || address.UserId != userId)
            {
                return NotFound();
            }

            // Trả về DTO
            return Ok(address.Adapt<AddressUserDto>());
        }

        [HttpPatch("{id}/toggle-working-status")]
        public async Task<IActionResult> ToggleWorkingStatus([FromRoute] Guid id)
        {
            var user = await _unitOfWork.UserRepository.GetByIdAsync(id);
            if (user == null) return NotFound("Không tìm thấy người dùng.");

            user.WorkingStatus = user.WorkingStatus == "Online" ? "Offline" : "Online";
            await _unitOfWork.CompleteAsync();

            return Ok(new
            {
                success = true,
                message = "Cập nhật trạng thái hoạt động thành công.",
                workingStatus = user.WorkingStatus
            });
        }



    }
}
