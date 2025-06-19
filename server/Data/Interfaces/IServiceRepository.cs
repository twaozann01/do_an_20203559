﻿using Shared.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Interfaces
{
    public interface IServiceRepository : IRepository<Service>
    {
        Task<Service?> GetDetailAsync(Guid id);
    }
}
