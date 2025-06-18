using Domain.Entities;

namespace Domain.Interfaces;

public interface IPasswordResetTokenRepository : IRepository<PasswordResetToken>
{
    PasswordResetToken? GetByToken(string token);
    IEnumerable<PasswordResetToken> GetActiveTokens(int userId);
}