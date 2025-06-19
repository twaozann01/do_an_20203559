using Shared.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Interfaces
{
    public interface IRepairmanFormRepository : IRepository<RepairmanForm>
    {
        Task<(List<RepairmanForm>, int)> GetPageAsync(int offset, int limit);
        Task<RepairmanForm?> GetDetailAsync(Guid id);
        Task<List<RepairmanForm>> GetByUserIdAsync(Guid userId);

    }
}
