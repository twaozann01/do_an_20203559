// using Microsoft.AspNetCore.Authorization;
// using Microsoft.AspNetCore.Mvc;
// using Shared.Entities;
// using Data.Config;
// using Microsoft.EntityFrameworkCore;
// using System.Security.Claims;

// namespace API.Controllers
// {
//     // [Authorize(Roles = "Repairman")]
//     [ApiController]
//     [Route("api/[controller]")]
//     public class WalletController : ControllerBase
//     {
//         private readonly AppDbContext _context;

//         public WalletController(AppDbContext context)
//         {
//             _context = context;
//         }

//         [HttpGet]
//         public async Task<IActionResult> GetWalletInfo()
//         {
//             var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

//             var user = await _context.Users.FindAsync(userId);
//             if (user == null) return NotFound("Không tìm thấy người dùng");

//             var transactions = await _context.WalletTransactions
//                 .Where(t => t.UserId == userId)
//                 .OrderByDescending(t => t.CreatedAt)
//                 .ToListAsync();

//             return Ok(new
//             {
//                 balance = user.WalletBalance,
//                 transactions
//             });
//         }
//     }
// }
