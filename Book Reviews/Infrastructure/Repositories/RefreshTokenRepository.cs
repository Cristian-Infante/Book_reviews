using System.Linq.Expressions;
using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class RefreshTokenRepository(AppDbContext ctx) : IRefreshTokenRepository
{
    public RefreshToken GetById(int id) =>
        ctx.RefreshTokens.Find(id)!;
    public IQueryable<RefreshToken> GetAll() =>
        ctx.RefreshTokens;
    public IQueryable<RefreshToken> Find(Expression<Func<RefreshToken, bool>> pred) =>
        ctx.RefreshTokens.Where(pred);
    public void Add(RefreshToken e)    => ctx.RefreshTokens.Add(e);
    public void Update(RefreshToken e) => ctx.RefreshTokens.Update(e);
    public void Delete(RefreshToken e) => ctx.RefreshTokens.Remove(e);

    public RefreshToken? GetByToken(string token) =>
        ctx.RefreshTokens
            .AsNoTracking()
            .FirstOrDefault(t => t.Token == token);
    public IEnumerable<RefreshToken> GetAllValid(int userId) =>
        ctx.RefreshTokens
            .Where(t => t.UserId == userId && !t.Revoked && t.Expires > DateTime.UtcNow)
            .ToList();
}