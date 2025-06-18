using System.Linq.Expressions;

namespace Domain.Interfaces;

public interface IRepository<T> where T : class
{
    T GetById(int id);
    IQueryable<T> GetAll();
    IQueryable<T> Find(Expression<Func<T,bool>> predicate);

    void Add(T entity);
    void Update(T entity);
    void Delete(T entity);
}