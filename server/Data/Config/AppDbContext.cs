using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Shared.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Config
{
    public class AppDbContext : DbContext
    {
        public DbSet<AddressUser> AddressUsers { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartDetail> CartDetails { get; set; }
        public DbSet<DeviceDetail> DeviceDetails { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<RepairmanForm> RepairmanForms { get; set; }
        public DbSet<RepairmanFormDetail> RepairmanFormDetails { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<ServiceDevice> ServiceDevices { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserNotification> UserNotifications { get; set; }
        public DbSet<VatConfig> VatConfigs { get; set; }
        public DbSet<WalletTransaction> WalletTransactions { get; set; }


        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
            AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
{
    entity.Property(e => e.FullName).IsRequired().HasMaxLength(100);
    entity.Property(e => e.Phone).IsRequired().HasMaxLength(20);
    entity.HasIndex(e => e.Phone).IsUnique();
    entity.Property(e => e.Password).IsRequired();

    entity.OwnsMany(u => u.RepairmanInfos, rp =>
    {
        rp.WithOwner().HasForeignKey("UserId");
        rp.Property<int>("Id");
        rp.HasKey("Id");
        rp.ToTable("RepairmanProfiles"); // ✅ Giờ dùng bảng riêng
    });
});
            modelBuilder.Entity<WalletTransaction>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Amount).IsRequired();
                entity.Property(e => e.Description).HasMaxLength(255);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("NOW() AT TIME ZONE 'UTC'");
                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId);
            });



            modelBuilder.Entity<Cart>(entity =>
            {
                entity.HasOne(c => c.User)
                    .WithOne()
                    .HasForeignKey<Cart>(c => c.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
            modelBuilder.Entity<Order>(entity =>
{
    entity.Property(o => o.CreatedAt)
          .HasDefaultValueSql("NOW() AT TIME ZONE 'UTC'"); // PostgreSQL
});

        }
    }
}
