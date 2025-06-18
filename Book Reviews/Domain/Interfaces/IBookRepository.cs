using Domain.Entities;

namespace Domain.Interfaces;

public interface IBookRepository : IRepository<Book>
{
    IEnumerable<Book> SearchByTitleOrAuthor(string term);
    IEnumerable<Book> GetByCategory(int categoryId);
}