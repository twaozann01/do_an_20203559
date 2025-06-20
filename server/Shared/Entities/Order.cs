using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Entities
{
    public class Order
    {
        public Guid Id { get; set; } = Guid.CreateVersion7();
        public string OrderCode { get; set; } = string.Empty;
        public Guid AddressId { get; set; }
        public Guid CustomerId { get; set; }
        public Guid? RepairmanId { get; set; }
        public Guid ServiceDeviceId { get; set; }
        public ServiceDevice? ServiceDevice { get; set; }
        public string? Status { get; set; }
        public decimal? Total { get; set; }
        public bool? PaymentStatus { get; set; }
        public DateTime? PaymentTerm { get; set; }
        public DateTime? PaymentDate { get; set; }
        public string? CustomerNote { get; set; }
        public int? RatingNumber { get; set; } // Số sao
        public string? RatingDescription { get; set; } // Mô tả
        public DateTime? RatingDate { get; set; } // Ngày đánh giá đầu tiên
        public DateTime? RatingUpdatedDate { get; set; } // Ngày cập nhật lại đánh giá
        public bool HasUpdatedRating { get; set; } = false; // Đã sửa đánh giá chưa

        public AddressUser? Address { get; set; }
        public User? Customer { get; set; }
        public User? Repairman { get; set; }

        public DateTime? RepairDate { get; set; }
        public DateTime CreatedAt { get; set; } 
        public DateTime? FoundRepairmanAt { get; set; }
        public DateTime? InProgressAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public DateTime? CanceledAt { get; set; }

        public List<OrderDetail>? OrderDetails { get; set; }
    }
}