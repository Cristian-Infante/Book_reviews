using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore.Storage;

namespace Infrastructure;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;
    private IDbContextTransaction? _currentTransaction;
    private bool _disposed;
    
    public UnitOfWork(AppDbContext context)
    {
        _context = context;
        Users = new UserRepository(_context);
        PasswordResetTokens = new PasswordResetTokenRepository(_context);
        RefreshTokens = new RefreshTokenRepository(_context);
        Books = new BookRepository(_context);
        Categories = new CategoryRepository(_context);
        Reviews = new ReviewRepository(_context);
    }

    public IUserRepository Users { get; set; }
    public IPasswordResetTokenRepository PasswordResetTokens { get; set; }
    public IRefreshTokenRepository RefreshTokens { get; set; }
    public IBookRepository Books { get; set; }
    public ICategoryRepository Categories { get; set; }
    public IReviewRepository Reviews { get; set; }

    public int Save()
    {
        return _context.SaveChanges();
    }
    
    public async Task BeginTransactionAsync()
    {
        if (_currentTransaction != null) return;
        _currentTransaction = await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        if (_currentTransaction == null) 
            throw new InvalidOperationException("No hay transacción activa.");

        await _context.SaveChangesAsync();
        await _currentTransaction.CommitAsync();
        await DisposeTransactionAsync();
    }

    public async Task RollbackTransactionAsync()
    {
        if (_currentTransaction == null) return;
        await _currentTransaction.RollbackAsync();
        await DisposeTransactionAsync();
    }
    
    public async Task DisposeTransactionAsync()
    {
        await _currentTransaction!.DisposeAsync();
        _currentTransaction = null;
    }

    public void Dispose()
    {
        Dispose(disposing: true);
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (_disposed) return;
        if (disposing)
        {
            _context.Dispose();
        }
        _disposed = true;
    }
}