using System.Linq.Expressions;
using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Infrastructure.Repositories;

public class BookRepository(AppDbContext ctx) : IBookRepository
{
    public Book GetById(int id) =>
        ctx.Books.Include(b => b.Category).Include(b => b.Reviews).First(b => b.Id == id);

    public IQueryable<Book> GetAll() =>
        ctx.Books.Include(b => b.Category).Include(b => b.Reviews);

    public IQueryable<Book> Find(Expression<Func<Book, bool>> pred) =>
        ctx.Books.Include(b => b.Category).Include(b => b.Reviews).Where(pred);

    public void Add(Book e)    => ctx.Books.Add(e);
    public void Update(Book e) => ctx.Books.Update(e);
    public void Delete(Book e) => ctx.Books.Remove(e);

    public IEnumerable<Book> SearchByTitleOrAuthor(string term) =>
        Find(b => b.Title.Contains(term) || b.Author.Contains(term));

    public IEnumerable<Book> GetByCategory(int categoryId) =>
        Find(b => b.CategoryId == categoryId);
}