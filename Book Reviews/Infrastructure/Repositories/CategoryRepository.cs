using System.Linq.Expressions;
using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;

namespace Infrastructure.Repositories;

public class CategoryRepository(AppDbContext ctx) : ICategoryRepository
{
    public Category GetById(int id) =>
        ctx.Categories.Find(id)!;

    public IQueryable<Category> GetAll() =>
        ctx.Categories;

    public IQueryable<Category> Find(Expression<Func<Category, bool>> predicate) =>
        ctx.Categories.Where(predicate);

    public void Add(Category entity)    => ctx.Categories.Add(entity);
    public void Update(Category entity) => ctx.Categories.Update(entity);
    public void Delete(Category entity) => ctx.Categories.Remove(entity);
}