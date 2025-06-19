using Data.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Shared;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public DashboardController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet("statistics")]
        public async Task<IActionResult> GetStatisticsAsync()
        {
            var totalUserCount = await _unitOfWork.UserRepository.GetCountAsync();
            var customerCount = await _unitOfWork.UserRepository.GetCountByRoleAsync("Customer");
            var repairmanCount = await _unitOfWork.UserRepository.GetCountByRoleAsync("Repairman");

            var totalRevenue = await _unitOfWork.OrderRepository.GetTotalRevenueAsync();
            var (todayOrderRevenue, thisWeekOrderRevenue, thisMonthorderRevenue) = await _unitOfWork.OrderRepository.GetRevenueAsync();
            var (todayNewUserCount, thisWeekNewUserCount, thisMonthNewUserCount) = await _unitOfWork.UserRepository.GetNewUserCountAsync();
            var (todayNewOrderCount, thisWeekNewOrderCount, thisMonthNewOrderCount) = await _unitOfWork.OrderRepository.GetNewOrderCountAsync();
            var (pendingOrderStatusCount, inProgressOrderStatusCount, completedOrderStatusCount, canceledOrderStatusCount) = await _unitOfWork.OrderRepository.GetOrderStatusCountAsync();

            return Ok(new
            {
                TotalUserCount = totalUserCount, //Tổng số người dùng
                CustomerCount = customerCount, //Khách hàng
                RepairmanCount = repairmanCount, //Thợ sửa chữa

                TodayOrderRevenue = todayOrderRevenue,//Tổng doanh thu trong ngày
                ThisWeekOrderRevenue = thisWeekOrderRevenue, //Tổng doanh thu trong tuần
                ThisMonthOrderRevenue = thisMonthorderRevenue,//Tổng doanh thu trong tháng
                TotalRevenue = totalRevenue, //Tổng doanh thu

                TodayNewUserCount = todayNewUserCount, //Người dùng mới hôm nay
                ThisWeekNewUserCount = thisWeekNewUserCount, //Người dùng mới tuần này
                ThisMonthNewUserCount = thisMonthNewUserCount, //Người dùng mới tháng này

                TodayNewOrderCount = todayNewOrderCount, //Đơn mới hôm nay
                ThisWeekNewOrderCount = thisWeekNewOrderCount, //Đơn mới tuần này
                ThisMonthNewOrderCount = thisMonthNewOrderCount, //Đơn mới tháng này

                PendingOrderStatusCount = pendingOrderStatusCount, // Đang chờ xử lý
                InProgressOrderStatusCount = inProgressOrderStatusCount,  //Tổng số đơn đang sửa chữa
                CompletedOrderStatusCount = completedOrderStatusCount, // Tổng số đơn đã hoàn thành
                CanceledOrderStatusCount = canceledOrderStatusCount, //Tổng số đơn đã hủy
                TotalOrderCount = pendingOrderStatusCount + inProgressOrderStatusCount + completedOrderStatusCount + canceledOrderStatusCount, // Tổng số đơn
            });
        }

        //Đơn hàng trong 7 ngày gần nhất
        [HttpGet("daily-orders")]
        public async Task<IActionResult> GetDailyOrderStatsAsync()
        {
            var data = await _unitOfWork.OrderRepository.GetOrderCountLast7DaysAsync();
            return Ok(data);
        }

        //Doanh thu trong 7 ngày gần nhất
        [HttpGet("daily-revenue")]
        public async Task<IActionResult> GetDailyRevenueAsync()
        {
            var data = await _unitOfWork.OrderRepository.GetRevenueLast7DaysAsync();
            return Ok(data);
        }

        //Tỉ lệ sử dụng dịch vụ
        [HttpGet("service-usage")]
        public async Task<IActionResult> GetServiceUsageAsync()
        {
            var data = await _unitOfWork.OrderRepository.GetServiceUsageAsync();
            return Ok(data);
        }

        [HttpGet("order-status-rate")]
        public async Task<IActionResult> GetOrderStatusRateAsync()
        {
            var data = await _unitOfWork.OrderRepository.GetOrderStatusRateAsync();
            return Ok(data);
        }

        [HttpGet("top-repairmen")]
        public async Task<IActionResult> GetTopRepairmenAsync()
        {
            var topRepairmen = await _unitOfWork.OrderRepository.GetTopRepairmenAsync(5); // 5 người
            return Ok(topRepairmen);
        }

        [HttpGet("top-customers")]
        public async Task<IActionResult> GetTopCustomersAsync()
        {
            var data = await _unitOfWork.OrderRepository.GetTopCustomersAsync();
            return Ok(data);
        }

[HttpGet("recent-orders")]
public async Task<IActionResult> GetRecentOrdersAsync()
{
    var data = await _unitOfWork.OrderRepository.GetRecentOrdersAsync();
    return Ok(data);
}


    }
}