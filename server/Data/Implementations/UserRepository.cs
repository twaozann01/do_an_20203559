using Data.Config;
using Data.Interfaces;
using Microsoft.EntityFrameworkCore;
using Shared;
using Shared.Entities;
using Shared.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shared.Utils;


namespace Data.Implementations
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(AppDbContext context) : base(context)
        {
        }
        public async Task<User?> GetByEmailAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == email);
            return user;
        }

        public async Task<User?> GetByPhoneAsync(string phone)
        {
            var user = await _context.Users
                .Include(x => x.RepairmanInfos) // 👈 Thêm dòng này nếu cần
                .FirstOrDefaultAsync(x => x.Phone == phone);
            return user;
        }

        public async Task<User?> GetDetailAsync(Guid id)
        {
            var entity = await _context.Users
                .Include(x => x.Addresses)
                .Include(x => x.RepairmanInfos) // 👈 Thêm để lấy danh sách thiết bị sửa chữa
                .FirstOrDefaultAsync(x => x.Id == id);
            return entity;
        }

        public async Task<List<User>> GetListWithFilterAsync(UserFilter filter)
        {
            var query = Filter(filter);

            // Bổ sung Include nếu hiển thị danh sách repairman
            query = query
                .Include(x => x.Addresses)
                .Include(x => x.RepairmanInfos);

            var result = await query.ToListAsync();
            return result;
        }

        public async Task<(int today, int thisWeek, int thisMonth)> GetNewUserCountAsync()
        {
            var todayStart = TimeHelper.GetVietnamTime().Date;
            var thisWeekStart = TimeHelper.GetVietnamTime().Date.AddDays(-((7 + (int)TimeHelper.GetVietnamTime().Date.DayOfWeek - 1) % 7));
            var thisMonthStart = new DateTime(TimeHelper.GetVietnamTime().Date.Year, TimeHelper.GetVietnamTime().Date.Month, 1);

            var todayEnd = todayStart.AddDays(1).AddTicks(-1);
            var thisWeekEnd = thisWeekStart.AddDays(7).AddTicks(-1);
            var thisMonthEnd = new DateTime(TimeHelper.GetVietnamTime().Date.Year, TimeHelper.GetVietnamTime().Date.Month, 1).AddMonths(1).AddTicks(-1);

            var todayCount = await _context.Users.CountAsync(x => x.CreatedAt >= todayStart && x.CreatedAt <= todayEnd);
            var thisWeekCount = await _context.Users.CountAsync(x => x.CreatedAt >= thisWeekStart && x.CreatedAt <= thisWeekEnd);
            var thisMonthCount = _context.Users.CountAsync(x => x.CreatedAt >= thisMonthStart && x.CreatedAt <= thisMonthEnd);

            return (todayCount, thisWeekCount, await thisMonthCount);
        }
        public async Task<int> GetCountByRoleAsync(string role)
        {
            return await _context.Users.CountAsync(u => u.Role == role);
        }

        private IQueryable<User> Filter(UserFilter filter)
        {
            IQueryable<User> query = _context.Users;
            query = query.Where(x => x.Role != UserRole.Admin.ToString());

            if (!string.IsNullOrEmpty(filter.Role))
            {
                query = query.Where(x => x.Role == filter.Role);
            }

            if (!string.IsNullOrEmpty(filter.Status))
            {
                query = query.Where(x => x.Status == filter.Status);
            }

            return query;
        }
    }
}
