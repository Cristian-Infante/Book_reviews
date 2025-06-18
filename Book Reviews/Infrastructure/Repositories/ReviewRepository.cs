using System.Linq.Expressions;
using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ReviewRepository(AppDbContext ctx) : IReviewRepository
{
    public Review GetById(int id) =>
        ctx.Reviews
            .Include(r => r.User)
            .Include(r => r.Book)
            .First(r => r.Id == id);

    public IQueryable<Review> GetAll() =>
        ctx.Reviews
            .Include(r => r.User)
            .Include(r => r.Book);

    public IQueryable<Review> Find(Expression<Func<Review, bool>> pred) =>
        ctx.Reviews
            .Include(r => r.User)
            .Include(r => r.Book)
            .Where(pred);

    public void Add(Review e)    => ctx.Reviews.Add(e);
    public void Update(Review e) => ctx.Reviews.Update(e);
    public void Delete(Review e) => ctx.Reviews.Remove(e);

    public IEnumerable<Review> GetByBook(int bookId) =>
        Find(r => r.BookId == bookId);

    public IEnumerable<Review> GetByUser(int userId) =>
        Find(r => r.UserId == userId);
}