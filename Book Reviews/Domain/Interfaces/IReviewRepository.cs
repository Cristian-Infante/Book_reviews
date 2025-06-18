using Domain.Entities;

namespace Domain.Interfaces;

public interface IReviewRepository : IRepository<Review>
{
    IEnumerable<Review> GetByBook(int bookId);
    IEnumerable<Review> GetByUser(int userId);
}