using System.Linq.Expressions;
using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;

namespace Infrastructure.Repositories;

public class UserRepository(AppDbContext ctx) : IUserRepository
{
    public User GetById(int id) =>
        ctx.Users.Find(id)!;

    public IQueryable<User> GetAll() =>
        ctx.Users;

    public IQueryable<User> Find(Expression<Func<User, bool>> predicate) =>
        ctx.Users.Where(predicate);

    public void Add(User entity)    => ctx.Users.Add(entity);
    public void Update(User entity) => ctx.Users.Update(entity);
    public void Delete(User entity) => ctx.Users.Remove(entity);

    public User? GetByEmail(string email) =>
        ctx.Users.FirstOrDefault(u => u.Email == email);
}