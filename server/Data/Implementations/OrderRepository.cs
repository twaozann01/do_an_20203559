using Data.Config;
using Data.Interfaces;
using Microsoft.EntityFrameworkCore;
using Shared;
using Shared.Entities;
using Shared.Filters;
using Shared.Utils;
using System.Linq.Expressions;
using Shared.Models;



namespace Data.Implementations
{
    public class OrderRepository : Repository<Order>, IOrderRepository
    {
        public OrderRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<Order?> GetDetailAsync(Guid id)
        {
            var order = await _context.Orders
                .Where(o => o.Id == id)
                .AsNoTracking()
                .FirstOrDefaultAsync();

            if (order == null) return null;

            order.OrderDetails = await _context.OrderDetails
                .Where(od => od.OrderId == order.Id)
                .Include(od => od.DeviceDetail!)
                .AsNoTracking()
                .ToListAsync();

            return order;
        }
        public async Task<(int today, int thisWeek, int thisMonth)> GetNewOrderCountAsync()
        {
            var todayStart = TimeHelper.GetVietnamTime().Date;
            var thisWeekStart = TimeHelper.GetVietnamTime().Date.AddDays(-((7 + (int)TimeHelper.GetVietnamTime().Date.DayOfWeek - 1) % 7));
            var thisMonthStart = new DateTime(TimeHelper.GetVietnamTime().Date.Year, TimeHelper.GetVietnamTime().Date.Month, 1);

            var todayEnd = todayStart.AddDays(1).AddTicks(-1);
            var thisWeekEnd = thisWeekStart.AddDays(7).AddTicks(-1);
            var thisMonthEnd = new DateTime(TimeHelper.GetVietnamTime().Date.Year, TimeHelper.GetVietnamTime().Date.Month, 1).AddMonths(1).AddTicks(-1);

            var todayCount = await _context.Orders
                .CountAsync(o => o.CreatedAt >= todayStart && o.CreatedAt <= todayEnd);
            var thisWeekCount = await _context.Orders
                .CountAsync(o => o.CreatedAt >= thisWeekStart && o.CreatedAt <= thisWeekEnd);
            var thisMonthCount = await _context.Orders
                .CountAsync(o => o.CreatedAt >= thisMonthStart && o.CreatedAt <= thisMonthEnd);

            return (todayCount, thisWeekCount, thisMonthCount);
        }

        public async Task<(int pending, int inProgress, int completed, int canceled)> GetOrderStatusCountAsync()

        {
            var pendingCount = await _context.Orders.CountAsync(o => o.Status == OrderStatus.Pending.ToString());
            var inProgressCount = await _context.Orders.CountAsync(o => o.Status == OrderStatus.InProgress.ToString());
            var completedCount = await _context.Orders.CountAsync(o => o.Status == OrderStatus.Completed.ToString());
            var canceledCount = await _context.Orders.CountAsync(o => o.Status == OrderStatus.Canceled.ToString());

            return (pendingCount, inProgressCount, completedCount, canceledCount);
        }
        public async Task<List<Order>> FindAsync(Expression<Func<Order, bool>> predicate)
        {
            return await _context.Orders.Where(predicate).ToListAsync();
        }


        public async Task<(List<Order>, int)> GetPageByFilterAsync(OrderFilter filter)
        {
            var query = _context.Orders.AsQueryable().Include(o => o.OrderDetails!).ThenInclude(od => od.DeviceDetail) // 👈 đảm bảo lấy luôn DeviceDetail
        .AsQueryable();
            if (filter.CustomerId.HasValue)
            {
                query = query.Where(o => o.CustomerId == filter.CustomerId.Value);
            }
            if (filter.RepairmanId.HasValue)
            {
                query = query.Where(o => o.RepairmanId == filter.RepairmanId.Value);
            }
            if (filter.Status != null)
            {
                query = query.Where(o => o.Status == filter.Status);
            }
            if (filter.PaymentStatus.HasValue)
            {
                query = query.Where(o => o.PaymentStatus == filter.PaymentStatus.Value);
            }
            var entities = await query
                .OrderByDescending(o => o.CreatedAt)
                .Skip(filter.Offset)
                .Take(filter.Limit)
                .AsNoTracking()
                .ToListAsync();
            var total = await query.CountAsync();
            return (entities, total);
        }

        public async Task<(decimal today, decimal thisWeek, decimal thisMonth)> GetRevenueAsync()
{
    var todayStart = TimeHelper.GetVietnamTime().Date;
    var thisWeekStart = TimeHelper.GetVietnamTime().Date.AddDays(-((7 + (int)TimeHelper.GetVietnamTime().Date.DayOfWeek - 1) % 7));
    var thisMonthStart = new DateTime(TimeHelper.GetVietnamTime().Date.Year, TimeHelper.GetVietnamTime().Date.Month, 1);

    var todayEnd = todayStart.AddDays(1).AddTicks(-1);
    var thisWeekEnd = thisWeekStart.AddDays(7).AddTicks(-1);
    var thisMonthEnd = thisMonthStart.AddMonths(1).AddTicks(-1);

    var todayRevenue = await _context.Orders
        .Where(o => o.CreatedAt >= todayStart && o.CreatedAt <= todayEnd)
        .SumAsync(o => o.Total ?? 0);

    var thisWeekRevenue = await _context.Orders
        .Where(o => o.CreatedAt >= thisWeekStart && o.CreatedAt <= thisWeekEnd)
        .SumAsync(o => o.Total ?? 0);

    var thisMonthRevenue = await _context.Orders
        .Where(o => o.CreatedAt >= thisMonthStart && o.CreatedAt <= thisMonthEnd)
        .SumAsync(o => o.Total ?? 0);

    return (todayRevenue, thisWeekRevenue, thisMonthRevenue);
}

        public async Task<int> CountByDateAsync(DateTime date)
        {
            var start = date.Date;
            var end = start.AddDays(1);

            return await _context.Orders
                .Where(o => o.CreatedAt >= start && o.CreatedAt < end)
                .CountAsync();
        }
        public async Task<Order?> GetByOrderCodeAsync(string orderCode)
        {
            var order = await _context.Orders
                .Include(o => o.OrderDetails!)
                .ThenInclude(d => d.DeviceDetail)
                .FirstOrDefaultAsync(o => o.OrderCode == orderCode);

            return order;
        }
        public async Task<List<Order>> GetAllAsync()
        {
            return await _context.Orders.ToListAsync();
        }
        public async Task<decimal> GetTotalRevenueAsync()
        {
            return await _context.Orders
                .Where(o => o.Status == "Completed" && o.Total != null)
                .SumAsync(o => o.Total!.Value);
        }

        public async Task<List<DailyOrderCountDto>> GetOrderCountLast7DaysAsync()
        {
            DateTime today = TimeHelper.GetVietnamTime().Date;
            DateTime fromDate = today.AddDays(-6); // 7 ngày gần nhất bao gồm hôm nay

            var rawData = await _context.Orders
                .Where(o => o.CreatedAt.Date >= fromDate && o.CreatedAt.Date <= today)
                .GroupBy(o => o.CreatedAt.Date)
                .Select(g => new DailyOrderCountDto
                {
                    Date = g.Key,
                    OrderCount = g.Count()
                })
                .ToListAsync();

            // Bổ sung các ngày không có đơn
            var result = new List<DailyOrderCountDto>();
            for (int i = 0; i < 7; i++)
            {
                var date = fromDate.AddDays(i);
                var existing = rawData.FirstOrDefault(d => d.Date == date);
                result.Add(new DailyOrderCountDto
                {
                    Date = date,
                    OrderCount = existing?.OrderCount ?? 0
                });
            }

            return result;
        }

        public async Task<List<DailyRevenueDto>> GetRevenueLast7DaysAsync()
        {
            DateTime today = TimeHelper.GetVietnamTime().Date;
            DateTime fromDate = today.AddDays(-6);

            var rawData = await _context.Orders
                .Where(o => o.CreatedAt.Date >= fromDate && o.CreatedAt.Date <= today && o.Status == "Completed")
                .GroupBy(o => o.CreatedAt.Date)
                .Select(g => new DailyRevenueDto
                {
                    Date = g.Key,
                    Revenue = g.Sum(x => x.Total ?? 0)
                })
                .ToListAsync();

            var result = new List<DailyRevenueDto>();
            for (int i = 0; i < 7; i++)
            {
                var date = fromDate.AddDays(i);
                var match = rawData.FirstOrDefault(d => d.Date == date);
                result.Add(new DailyRevenueDto
                {
                    Date = date,
                    Revenue = match?.Revenue ?? 0
                });
            }

            return result;
        }

        public async Task<List<ServiceUsageDto>> GetServiceUsageAsync()
        {
            var groupedData = await _context.Orders
                .Include(o => o.ServiceDevice)
                .ThenInclude(sd => sd!.Service)
                .Where(o => o.ServiceDevice != null && o.ServiceDevice.Service != null)
                .GroupBy(o => o.ServiceDevice!.Service!.Name)
                .Select(g => new
                {
                    Name = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            int total = groupedData.Sum(x => x.Count);

            var result = groupedData.Select(item => new ServiceUsageDto
            {
                Name = item.Name ?? "Không xác định",
                Count = item.Count,
                Percentage = total == 0 ? 0 : Math.Round((item.Count * 100.0) / total, 2)
            }).ToList();

            return result;
        }

        public async Task<List<StatusRateDto>> GetOrderStatusRateAsync()
        {
            var total = await _context.Orders.CountAsync();
            if (total == 0) return new List<StatusRateDto>();

            var data = await _context.Orders
                .GroupBy(o => o.Status)
                .Select(g => new StatusRateDto
                {
                    Name = g.Key!.ToString(),
                    Count = g.Count(),
                    Percentage = Math.Round((double)g.Count() * 100 / total, 2)
                })
                .ToListAsync();

            return data;
        }

        public async Task<List<TopRepairmanDto>> GetTopRepairmenAsync(int top)
{
    var raw = await _context.Orders
    .Where(o => 
        o.Status == OrderStatus.Completed.ToString() &&
        o.RepairmanId != null &&
        o.RatingNumber != null // thêm dòng này để tránh null
    )
    .GroupBy(o => new { o.RepairmanId, o.Repairman!.FullName })
    .Select(g => new
    {
        RepairmanId = g.Key.RepairmanId!.Value,
        Name = g.Key.FullName!,
        Average = g.Average(x => x.RatingNumber!.Value), // giờ đã an toàn
        TotalRatedOrders = g.Count()
    })
    .ToListAsync();


    var result = raw
        .Select(r => new TopRepairmanDto
        {
            RepairmanId = r.RepairmanId,
            Name = r.Name,
            AverageRating = Math.Round(r.Average, 2),
            TotalOrders = r.TotalRatedOrders
        })
        .OrderByDescending(x => x.AverageRating)
        .ThenByDescending(x => x.TotalOrders)
        .Take(top)
        .ToList();

    return result;
}



        public async Task<List<TopCustomerDto>> GetTopCustomersAsync(int top = 5)
        {
            var result = await _context.Orders
                .Where(o => o.CustomerId != null && o.Total != null)
                .Join(
                    _context.Users,
                    o => o.CustomerId,
                    u => u.Id,
                    (o, u) => new { Order = o, User = u }
                )
                .GroupBy(x => new { x.User.Id, x.User.FullName })
                .Select(g => new TopCustomerDto
                {
                    CustomerId = g.Key.Id,
                    Name = g.Key.FullName,
                    TotalOrders = g.Count(),
                    TotalSpent = g.Sum(x => x.Order.Total ?? 0)
                })
                .OrderByDescending(x => x.TotalOrders)
                .ThenByDescending(x => x.TotalSpent)
                .Take(top)
                .ToListAsync();

            return result;
        }

public async Task<List<RecentOrderDto>> GetRecentOrdersAsync(int count = 10)
{
    var result = await _context.Orders
        .Where(o => o.CustomerId != null)
        .Include(o => o.Customer)
        .Include(o => o.ServiceDevice)
            .ThenInclude(sd => sd.Service)
        .OrderByDescending(o => o.CreatedAt)
        .Take(count)
        .Select(o => new RecentOrderDto
        {
            OrderId = o.Id,
            OrderCode = o.OrderCode,
            CreatedAt = o.CreatedAt,
            Status = o.Status!,
            Total = o.Total ?? 0,
            CustomerName = o.Customer != null ? o.Customer.FullName : "Không rõ",
            ServiceName = o.ServiceDevice != null && o.ServiceDevice.Service != null
                ? o.ServiceDevice.Service.Name
                : "Không rõ",
            DeviceName = o.ServiceDevice != null ? o.ServiceDevice.Name : "Không rõ"
        })
        .ToListAsync();

    return result;
}








    }
}
