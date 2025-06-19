﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shared.Entities;

namespace Data.Interfaces
{
    public interface ICartRepository : IRepository<Cart>
    {
        public Task<Cart?> GetCartByUserIdAsync(Guid userId);
    }
}
