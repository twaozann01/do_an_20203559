using Data.Config;
using Data.Interfaces;
using Microsoft.EntityFrameworkCore;
using Shared.Entities;

namespace Data.Implementations
{
    public class RepairmanFormRepository : Repository<RepairmanForm>, IRepairmanFormRepository
    {
        public RepairmanFormRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<RepairmanForm?> GetDetailAsync(Guid id)
        {
            var entity = await _context.RepairmanForms
                .Where(x => x.Id == id)
                .Include(x => x.Detail)
                    .ThenInclude(x => x.ServiceDevice)
                        .ThenInclude(sd => sd.Service) // 👈 CẦN BỔ SUNG
                .FirstOrDefaultAsync();
            return entity;
        }
        public async Task<(List<RepairmanForm>, int)> GetPageAsync(int offset, int limit)
        {
            var query = _context.RepairmanForms
                .Include(x => x.Detail)
                    .ThenInclude(x => x.ServiceDevice)
                        .ThenInclude(sd => sd.Service) // THÊM DÒNG NÀY
                .AsQueryable();

            int total = await query.CountAsync();

            var items = await query
                .OrderByDescending(x => x.Id)
                .Skip(offset)
                .Take(limit)
                .ToListAsync();

            return (items, total);
        }

        public async Task<List<RepairmanForm>> GetByUserIdAsync(Guid userId)
        {
            return await _context.RepairmanForms
                .Where(x => x.UserId == userId)
                .Include(x => x.Detail)
                    .ThenInclude(x => x.ServiceDevice)
                        .ThenInclude(sd => sd.Service) // 👈 BỔ SUNG DÒNG NÀY
                .OrderByDescending(x => x.Id)
                .ToListAsync();
        }



    }
}
