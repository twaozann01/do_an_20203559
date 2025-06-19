﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shared.Entities;

namespace Data.Interfaces
{
    public interface ICartDetailRepository : IRepository<CartDetail>
    {
        Task<CartDetail?> GetByCartAndServiceDeviceAsync(Guid cartId, Guid serviceDeviceId);
    }
}
