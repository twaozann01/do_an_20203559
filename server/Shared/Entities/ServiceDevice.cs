﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shared.Entities;

namespace Shared.Entities
{
    public class ServiceDevice
    {
        public Guid Id { get; set; } = Guid.CreateVersion7();
        public Guid ServiceId { get; set; }

        public string? Name { get; set; }
        public string? Description { get; set; }

        public Service? Service { get; set; }
        public DateTime? CreatedAt { get; set; }
        public List<DeviceDetail>? DeviceDetails { get; set; }
        


        
    }
}
