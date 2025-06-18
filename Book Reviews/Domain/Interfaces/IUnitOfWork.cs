namespace Domain.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IUserRepository Users { get; }
    IPasswordResetTokenRepository PasswordResetTokens { get; }
    IRefreshTokenRepository RefreshTokens { get; }
    IBookRepository Books { get; }
    ICategoryRepository Categories { get; }
    IReviewRepository Reviews { get; }
    
    int Save();
    
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
    Task DisposeTransactionAsync();
}