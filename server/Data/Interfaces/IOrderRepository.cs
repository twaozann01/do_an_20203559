﻿using Shared;
using Shared.Entities;
using Shared.Filters;
using Shared.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Linq.Expressions;


namespace Data.Interfaces
{
    public interface IOrderRepository : IRepository<Order>
    {
        Task<(List<Order>, int)> GetPageByFilterAsync(OrderFilter filter);
        Task<Order?> GetDetailAsync(Guid id);
        Task<(long today, long thisWeek, long thisMonth)> GetRevenueAsync();
        Task<(int today, int thisWeek, int thisMonth)> GetNewOrderCountAsync();
        Task<(int pending, int inProgress, int completed, int canceled)> GetOrderStatusCountAsync();
        Task<decimal> GetTotalRevenueAsync();

        Task<int> CountByDateAsync(DateTime date);
        Task<Order?> GetByOrderCodeAsync(string orderCode);

        Task<List<Order>> FindAsync(Expression<Func<Order, bool>> predicate);
        Task<List<Order>> GetAllAsync();
        IQueryable<Order> Query();
        Task<List<DailyOrderCountDto>> GetOrderCountLast7DaysAsync();
        Task<List<DailyRevenueDto>> GetRevenueLast7DaysAsync();
        Task<List<ServiceUsageDto>> GetServiceUsageAsync();
        Task<List<StatusRateDto>> GetOrderStatusRateAsync();
        Task<List<TopRepairmanDto>> GetTopRepairmenAsync(int top);
        Task<List<TopCustomerDto>> GetTopCustomersAsync(int top = 5);
        Task<List<RecentOrderDto>> GetRecentOrdersAsync(int count = 10);








    }
}
