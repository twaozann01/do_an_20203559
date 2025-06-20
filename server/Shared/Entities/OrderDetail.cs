﻿using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Entities
{
    public class OrderDetail
    {
        public Guid Id { get; set; } = Guid.CreateVersion7();
        public Guid OrderId { get; set; }
        public Guid DeviceDetailId { get; set; }
        public string? Description { get; set; }
        public string? Video { get; set; }
        public string? Image { get; set; }
        public decimal? MinPrice { get; set; }
        public DateTime? CreatedAt { get; set; }

        public Order? Order { get; set; }
        public DeviceDetail? DeviceDetail { get; set; }
    }    
}
