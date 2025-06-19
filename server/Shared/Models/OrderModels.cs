using Shared.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Models
{
    public class OrderDto
    {
        public Guid? Id { get; set; }
        public string? OrderCode { get; set; }
        public Guid? AddressId { get; set; }
        public Guid? CustomerId { get; set; }
        public Guid? RepairmanId { get; set; }
        public string? Status { get; set; }
        public DateTime? RepairDate { get; set; }
        public int? Total { get; set; }
        public bool? PaymentStatus { get; set; }
        public DateTime? PaymentTerm { get; set; }
        public DateTime? PaymentDate { get; set; }
        public string? CustomerNote { get; set; }
        public int? RatingNumber { get; set; } // Số sao
        public string? RatingDescription { get; set; } // Mô tả
        public DateTime? RatingDate { get; set; } // Ngày đánh giá đầu tiên
        public DateTime? RatingUpdatedDate { get; set; } // Ngày cập nhật lại đánh giá
        public bool HasUpdatedRating { get; set; } = false; // Đã sửa đánh giá chưa
        public Guid? ServiceDeviceId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? FoundRepairmanAt { get; set; }
        public DateTime? InProgressAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public DateTime? CanceledAt { get; set; }

        public List<OrderDetailDto>? OrderDetails { get; set; }

    }

    public class CreateOrderRequest
    {
        public Guid? AddressId { get; set; }
        public Guid? CustomerId { get; set; }

        public string? CustomerNote { get; set; }
        public Guid ServiceDeviceId { get; set; }

        public DateTime RepairDate { get; set; }
        public List<CreateOrderDetailRequest> OrderDetails { get; set; } = new List<CreateOrderDetailRequest>();
    }

    public class RateOrderRequest
    {
        public int? RatingNumber { get; set; }
        public string? RatingDescription { get; set; }

    }

    public class RepairOrderRequest
    {
        public string Status { get; set; } = OrderStatus.InProgress.ToString();
        public Guid? RepairmanId { get; set; }
        public DateTime? RepairDate { get; set; }
        public DateTime? RepairCompleted { get; set; }
    }

    public class PaymentOrderRequest
    {
        public bool PaymentStatus { get; set; }
        public DateTime? PaymentTern { get; set; }
        public DateTime? PaymentDate { get; set; }
    }

    public class AcceptOrderRequest
    {
        public Guid RepairmanId { get; set; }
    }

    public class DailyOrderCountDto
    {
        public DateTime Date { get; set; }
        public int OrderCount { get; set; }
    }
    public class DailyRevenueDto
    {
        public DateTime Date { get; set; }
        public long Revenue { get; set; }
    }

    public class StatusRateDto
    {
        public string Name { get; set; } = string.Empty;
        public int Count { get; set; }
        public double Percentage { get; set; }
    }

    public class RecentOrderDto
    {
        public Guid OrderId { get; set; }
        public string OrderCode { get; set; } = default!;
        public DateTime CreatedAt { get; set; }
        public string Status { get; set; } = default!;
        public decimal Total { get; set; }
        public string? CustomerName { get; set; }
        public string? ServiceName { get; set; }
        public string? DeviceName { get; set; }
    }

}
