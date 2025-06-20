using Data.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Shared;
using Microsoft.AspNetCore.Authorization;
using Shared.Entities;
using Data.Config; // nếu AppDbContext nằm ở đây
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly AppDbContext _context;


        public DashboardController(IUnitOfWork unitOfWork, AppDbContext context)
        {
            _unitOfWork = unitOfWork;
            _context = context;
        }

        [HttpGet("statistics")]
public async Task<IActionResult> GetStatisticsAsync()
{
    try
    {
        var totalUserCount = await _unitOfWork.UserRepository.GetCountAsync();
        var customerCount = await _unitOfWork.UserRepository.GetCountByRoleAsync("Customer");
        var repairmanCount = await _unitOfWork.UserRepository.GetCountByRoleAsync("Repairman");

        var totalRevenue = await _unitOfWork.OrderRepository.GetTotalRevenueAsync();
        var (todayOrderRevenue, thisWeekOrderRevenue, thisMonthOrderRevenue) = await _unitOfWork.OrderRepository.GetRevenueAsync();

        var (todayNewUserCount, thisWeekNewUserCount, thisMonthNewUserCount) = await _unitOfWork.UserRepository.GetNewUserCountAsync();
        var (todayNewOrderCount, thisWeekNewOrderCount, thisMonthNewOrderCount) = await _unitOfWork.OrderRepository.GetNewOrderCountAsync();
        var (pendingOrderStatusCount, inProgressOrderStatusCount, completedOrderStatusCount, canceledOrderStatusCount) = await _unitOfWork.OrderRepository.GetOrderStatusCountAsync();

        return Ok(new
        {
            status = 200,
            message = "Lấy thống kê hệ thống thành công.",
            data = new
            {
                TotalUserCount = totalUserCount,
                CustomerCount = customerCount,
                RepairmanCount = repairmanCount,

                TodayOrderRevenue = todayOrderRevenue,
                ThisWeekOrderRevenue = thisWeekOrderRevenue,
                ThisMonthOrderRevenue = thisMonthOrderRevenue,
                TotalRevenue = totalRevenue,

                TodayNewUserCount = todayNewUserCount,
                ThisWeekNewUserCount = thisWeekNewUserCount,
                ThisMonthNewUserCount = thisMonthNewUserCount,

                TodayNewOrderCount = todayNewOrderCount,
                ThisWeekNewOrderCount = thisWeekNewOrderCount,
                ThisMonthNewOrderCount = thisMonthNewOrderCount,

                PendingOrderStatusCount = pendingOrderStatusCount,
                InProgressOrderStatusCount = inProgressOrderStatusCount,
                CompletedOrderStatusCount = completedOrderStatusCount,
                CanceledOrderStatusCount = canceledOrderStatusCount,
                TotalOrderCount = pendingOrderStatusCount + inProgressOrderStatusCount + completedOrderStatusCount + canceledOrderStatusCount
            }
        });
    }
    catch (Exception ex)
    {
        Console.WriteLine("[ERROR] Thống kê thất bại: " + ex.Message);
        return StatusCode(500, new
        {
            status = 500,
            message = "Đã xảy ra lỗi khi lấy thống kê."
        });
    }
}


        //Đơn hàng trong 7 ngày gần nhất
        [HttpGet("daily-orders")]
public async Task<IActionResult> GetDailyOrderStatsAsync()
{
    try
    {
        var data = await _unitOfWork.OrderRepository.GetOrderCountLast7DaysAsync();

        return Ok(new
        {
            status = 200,
            message = "Lấy thống kê đơn hàng 7 ngày gần nhất thành công.",
            data = data // dạng: [{ date: "2025-06-14", count: 4 }, ...]
        });
    }
    catch (Exception ex)
    {
        Console.WriteLine("[ERROR] Thống kê đơn theo ngày lỗi: " + ex.Message);
        return StatusCode(500, new
        {
            status = 500,
            message = "Đã xảy ra lỗi khi lấy thống kê theo ngày."
        });
    }
}


        //Doanh thu trong 7 ngày gần nhất
        [HttpGet("daily-revenue")]
public async Task<IActionResult> GetDailyRevenueAsync()
{
    try
    {
        var data = await _unitOfWork.OrderRepository.GetRevenueLast7DaysAsync();

        return Ok(new
        {
            status = 200,
            message = "Lấy thống kê doanh thu 7 ngày gần nhất thành công.",
            data = data // dạng: [{ date: "2025-06-14", revenue: 500000 }, ...]
        });
    }
    catch (Exception ex)
    {
        Console.WriteLine("[ERROR] Lỗi thống kê doanh thu: " + ex.Message);
        return StatusCode(500, new
        {
            status = 500,
            message = "Đã xảy ra lỗi khi lấy thống kê doanh thu."
        });
    }
}

        //Tỉ lệ sử dụng dịch vụ
        [HttpGet("service-usage")]
public async Task<IActionResult> GetServiceUsageAsync()
{
    try
    {
        var data = await _unitOfWork.OrderRepository.GetServiceUsageAsync();

        return Ok(new
        {
            status = 200,
            message = "Lấy thống kê dịch vụ được sử dụng thành công.",
            data = data // Ví dụ: [{ serviceName: "Điện lạnh", totalOrders: 12 }, ...]
        });
    }
    catch (Exception ex)
    {
        Console.WriteLine("[ERROR] Thống kê dịch vụ lỗi: " + ex.Message);
        return StatusCode(500, new
        {
            status = 500,
            message = "Đã xảy ra lỗi khi lấy thống kê dịch vụ."
        });
    }
}


        [HttpGet("order-status-rate")]
public async Task<IActionResult> GetOrderStatusRateAsync()
{
    try
    {
        var data = await _unitOfWork.OrderRepository.GetOrderStatusRateAsync();

        return Ok(new
        {
            status = 200,
            message = "Lấy tỷ lệ trạng thái đơn hàng thành công.",
            data = data // ví dụ: [{ status: "Pending", count: 5 }, ...]
        });
    }
    catch (Exception ex)
    {
        Console.WriteLine("[ERROR] Lỗi lấy tỷ lệ đơn hàng: " + ex.Message);
        return StatusCode(500, new
        {
            status = 500,
            message = "Đã xảy ra lỗi khi lấy tỷ lệ trạng thái đơn hàng."
        });
    }
}


       [HttpGet("top-repairmen")]
public async Task<IActionResult> GetTopRepairmenAsync()
{
    try
    {
        var topRepairmen = await _unitOfWork.OrderRepository.GetTopRepairmenAsync(5); // top 5

        return Ok(new
        {
            status = 200,
            message = "Lấy danh sách top kỹ thuật viên thành công.",
            data = topRepairmen // ví dụ: [{ name: "Nguyễn Văn A", orderCount: 10, totalRevenue: 3000000 }, ...]
        });
    }
    catch (Exception ex)
    {
        Console.WriteLine("[ERROR] Lỗi lấy top repairmen: " + ex.Message);
        return StatusCode(500, new
        {
            status = 500,
            message = "Đã xảy ra lỗi khi lấy top kỹ thuật viên."
        });
    }
}


        [HttpGet("top-customers")]
public async Task<IActionResult> GetTopCustomersAsync()
{
    try
    {
        var data = await _unitOfWork.OrderRepository.GetTopCustomersAsync();

        return Ok(new
        {
            status = 200,
            message = "Lấy danh sách top khách hàng thân thiết thành công.",
            data = data // ví dụ: [{ userId, fullName, totalOrders, totalSpent }]
        });
    }
    catch (Exception ex)
    {
        Console.WriteLine("[ERROR] Lỗi lấy top khách hàng: " + ex.Message);
        return StatusCode(500, new
        {
            status = 500,
            message = "Đã xảy ra lỗi khi lấy top khách hàng."
        });
    }
}


        [HttpGet("recent-orders")]
public async Task<IActionResult> GetRecentOrdersAsync()
{
    try
    {
        var data = await _unitOfWork.OrderRepository.GetRecentOrdersAsync();

        return Ok(new
        {
            status = 200,
            message = "Lấy danh sách đơn hàng gần đây thành công.",
            data = data
        });
    }
    catch (Exception ex)
    {
        Console.WriteLine("[ERROR] Lỗi lấy recent orders: " + ex.Message);
        return StatusCode(500, new
        {
            status = 500,
            message = "Đã xảy ra lỗi khi lấy danh sách đơn hàng gần đây."
        });
    }
}

        [HttpPost("vat")]
public async Task<IActionResult> UpdateVat([FromBody] decimal newValue)
{
    if (newValue <= 0 || newValue > 1)
    {
        return BadRequest(new
        {
            status = 400,
            message = "Giá trị VAT phải nằm trong khoảng 0 < VAT ≤ 1"
        });
    }

    try
    {
        var vat = new VatConfig
        {
            Id = Guid.NewGuid(),
            Value = newValue,
            UpdatedAt = DateTime.UtcNow
        };

        await _context.VatConfigs.AddAsync(vat);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            status = 200,
            message = "Cập nhật VAT thành công",
            value = vat.Value
        });
    }
    catch (Exception ex)
    {
        Console.WriteLine("[ERROR] Lỗi cập nhật VAT: " + ex.Message);
        return StatusCode(500, new
        {
            status = 500,
            message = "Đã xảy ra lỗi khi cập nhật VAT."
        });
    }
}


        [HttpGet("vatCurrent")]
public async Task<IActionResult> GetCurrentVat()
{
    var vat = await _context.VatConfigs
        .OrderByDescending(v => v.UpdatedAt)
        .FirstOrDefaultAsync();

    if (vat == null)
    {
        return NotFound(new
        {
            status = 404,
            message = "Chưa có VAT nào được cấu hình."
        });
    }

    return Ok(new
    {
        status = 200,
        message = "Lấy VAT hiện tại thành công",
        value = vat.Value
    });
}


    }
}