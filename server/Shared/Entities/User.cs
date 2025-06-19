using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shared.Models;
namespace Shared.Entities
{
    public class User
    {
        public Guid Id { get; set; } = Guid.CreateVersion7();
        public string FullName { get; set; } = null!;
        public DateTime? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? Avatar { get; set; }
        public string? Email { get; set; }
        public string Phone { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string? Status { get; set; } = UserStatus.Active.ToString();
        public string? Role { get; set; } = UserRole.Customer.ToString();
        public double? Average { get; set; }
        public int? ReviewCount { get; set; }
        public int? CompletedOrderCount { get; set; } = 0;

        public string? Bio { get; set; }
        public string WorkingStatus { get; set; } = "Offline";
        public DateTime? CreatedAt { get; set; }
        public decimal WalletBalance { get; set; } = 0;
        public string? BankAccount { get; set; }
        public List<RepairmanProfile>? RepairmanInfos { get; set; }


        public List<AddressUser>? Addresses { get; set; }
    }
}
