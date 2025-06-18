using System.Linq.Expressions;
using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class PasswordResetTokenRepository(AppDbContext ctx)
    : IPasswordResetTokenRepository
{
    public PasswordResetToken GetById(int id) =>
        ctx.PasswordResetTokens.Find(id)!;

    public IQueryable<PasswordResetToken> GetAll() =>
        ctx.PasswordResetTokens;

    public IQueryable<PasswordResetToken> Find(Expression<Func<PasswordResetToken, bool>> pred) =>
        ctx.PasswordResetTokens.Where(pred);

    public void Add(PasswordResetToken entity)    => ctx.PasswordResetTokens.Add(entity);
    public void Update(PasswordResetToken entity) => ctx.PasswordResetTokens.Update(entity);
    public void Delete(PasswordResetToken entity) => ctx.PasswordResetTokens.Remove(entity);

    public PasswordResetToken? GetByToken(string token) =>
        ctx.PasswordResetTokens
            .AsNoTracking()
            .FirstOrDefault(t => t.Token == token);

    public IEnumerable<PasswordResetToken> GetActiveTokens(int userId) =>
        ctx.PasswordResetTokens
            .Where(t => t.UserId == userId && !t.Used && t.ExpiresAt > DateTime.UtcNow)
            .ToList();
}