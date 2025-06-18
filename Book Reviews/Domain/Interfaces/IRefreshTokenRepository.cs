using Domain.Entities;

namespace Domain.Interfaces;

public interface IRefreshTokenRepository : IRepository<RefreshToken>
{
    RefreshToken? GetByToken(string token);
    IEnumerable<RefreshToken> GetAllValid(int userId);
}