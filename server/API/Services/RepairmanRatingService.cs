using Data.Interfaces;
using Microsoft.EntityFrameworkCore;
using Shared.Entities;

namespace API.Services
{
    public class RepairmanRatingService
    {
        private readonly IUnitOfWork _unitOfWork;

        public RepairmanRatingService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

       public async Task UpdateRepairmanRatingAsync(Guid repairmanId)
{
    // Lấy đơn hoàn thành
    var completedOrders = await _unitOfWork.OrderRepository.Query()
        .Where(o => o.RepairmanId == repairmanId && o.Status == "Completed")
        .ToListAsync();

    // Lọc đơn đã đánh giá
    var ratedOrders = completedOrders
        .Where(o => o.RatingNumber != null)
        .ToList();

    var totalRatings = ratedOrders.Count;
    var completedCount = completedOrders.Count;

    double? averageRating = null;
    if (totalRatings > 0)
    {
        averageRating = ratedOrders.Average(o => o.RatingNumber!.Value);
    }

    var user = await _unitOfWork.UserRepository.GetByIdAsync(repairmanId);
    if (user != null && user.Role == "Repairman")
    {
        user.Average = averageRating != null ? Math.Round(averageRating.Value, 1) : null;
        user.ReviewCount = totalRatings > 0 ? totalRatings : null;
        user.CompletedOrderCount = completedCount > 0 ? completedCount : null;

        await _unitOfWork.UserRepository.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();
    }
}

    }
}
