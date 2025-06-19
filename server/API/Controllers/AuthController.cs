using API.Services.Interfaces;
using Data.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Caching.Memory;
using Shared.ConfigurationSettings;
using Shared.Entities;
using Shared.Models;
using Shared.Utils;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Mapster;
namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;
        private readonly IMailService _mailService;
        private readonly IMemoryCache _memoryCache;

        public AuthController(
            IUnitOfWork unitOfWork,
            IConfiguration configuration,
            IMailService mailService,
            IMemoryCache memoryCache
            )
        {
            _unitOfWork = unitOfWork;
            _configuration = configuration;
            _mailService = mailService;
            _memoryCache = memoryCache;
        }
        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync([FromBody] AuthLoginRequest request)
        {
            var user = await _unitOfWork.UserRepository.GetByPhoneAsync(request.Phone!);

            if (user == null)
            {
                return NotFound(new
                {
                    status = 404,
                    message = "Số điện thoại chưa được đăng ký."
                });
            }

            if (!PasswordHelper.VerifyPassword(request.Password!, user.Password))
            {
                return Unauthorized(new
                {
                    status = 401,
                    message = "Mật khẩu không chính xác."
                });
            }

            var accessToken = GenerateToken(user);
            var refreshToken = Guid.NewGuid().ToString("N");
            _memoryCache.Set($"RefreshToken_{user.Id}", refreshToken, TimeSpan.FromDays(7));

            return Ok(new
            {
                status = 200,
                message = "Đăng nhập thành công.",
                accessToken = accessToken,
                refreshToken = refreshToken
            });
        }
        [HttpPost("register")]
        public async Task<IActionResult> CreateUserAsync([FromForm] CreateUserRequest request)
        {
            var existed = await _unitOfWork.UserRepository.GetByPhoneAsync(request.Phone!);
            if (existed != null)
            {
                return Conflict(new
                {
                    status = 409,
                    message = "Số điện thoại đã tồn tại"
                });
            }

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
            return Ok(new
            {
                status = 200,
                message = "Tạo tài khoản thành công",
            });

        }



        // [HttpPost("refresh-token")]
        // public async Task<IActionResult> RefreshTokenAsync([FromBody] AuthRefreshTokenRequest request)
        // {
        //     var user = await _unitOfWork.UserRepository.GetByIdAsync(request.UserId!.Value);
        //     if (user == null)
        //     {
        //         return NotFound("User not found.");
        //     }
        //     if (!_memoryCache.TryGetValue($"RefreshToken_{user.Id}", out string? cachedRefreshToken) || cachedRefreshToken != request.RefreshToken)
        //     {
        //         return Unauthorized("Invalid or expired refresh token.");
        //     }
        //     var newAccessToken = GenerateToken(user);
        //     var newRefreshToken = Guid.NewGuid().ToString("N");
        //     _memoryCache.Set($"RefreshToken_{user.Id}", newRefreshToken, TimeSpan.FromDays(7));
        //     return Ok(new AuthLoginResponse
        //     {
        //         AccessToken = newAccessToken,
        //         RefreshToken = newRefreshToken,
        //     });
        // }

        // [HttpPost("send-password-reset-code")]
        // public async Task<IActionResult> SendPasswordResetCodeAsync([FromBody] SendPasswordResetCodeRequest request)
        // {
        //     var isUserExists = await _unitOfWork.UserRepository.AnyAsync(u => u.Email == request.Email);
        //     if (!isUserExists)
        //     {
        //         return NotFound("User with this email does not exist.");
        //     }

        //     var random = new Random();
        //     var resetCode = random.Next(100000, 999999).ToString();
        //     var cacheKey = $"PasswordResetCode_{request.Email}";
        //     _memoryCache.Set(cacheKey, resetCode, TimeSpan.FromMinutes(10));

        //     var mailRequest = new MailRequest
        //     {
        //         ToEmail = request.Email!,
        //         Subject = "Password Reset Code",
        //         Body = $"Your password reset code is: <strong>{resetCode}</strong>. This code is valid for 10 minutes. Please do not share it with anyone."
        //     };
        //     await _mailService.SendEmailAsync(mailRequest);
        //     return Ok(new
        //     {
        //         Message = "Password reset code sent successfully.",
        //     });
        // }

        // [HttpPost("reset-password")]
        // public async Task<IActionResult> ResetPasswordAsync([FromBody] ResetPasswordRequest request)
        // {
        //     var cacheKey = $"PasswordResetCode_{request.Email}";
        //     if (!_memoryCache.TryGetValue(cacheKey, out string? cachedCode) || cachedCode != request.Code)
        //     {
        //         return BadRequest("Invalid or expired password reset code.");
        //     }
        //     var user = await _unitOfWork.UserRepository.GetByEmailAsync(request.Email!);
        //     if (user == null)
        //     {
        //         return NotFound("User with this email does not exist.");
        //     }
        //     user.Password = PasswordHelper.HashPassword(request.NewPassword!);
        //     await _unitOfWork.SaveChangesAsync();
        //     _memoryCache.Remove(cacheKey);
        //     return Ok(new { Message = "Password reset successfully." });
        // }
        private string GenerateToken(User user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings").Get<JwtSettings>();

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.MobilePhone, user.Phone),
                new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
                new Claim(ClaimTypes.Role, user.Role!),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings!.SecretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwtSettings.Issuer,
                audience: jwtSettings.Audience,
                claims: claims,
                expires: TimeHelper.GetVietnamTime().AddMinutes(jwtSettings.TokenValidityInMinutes!),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
