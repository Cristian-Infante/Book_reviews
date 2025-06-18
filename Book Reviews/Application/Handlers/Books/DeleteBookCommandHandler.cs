using Application.Commands.Books;
using Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Caching.Memory;

namespace Application.Handlers.Books;

public class DeleteBookCommandHandler(
    IBookRepository repo,
    IMemoryCache cache)
    : IRequestHandler<DeleteBookCommand, Unit>
{
    private const string KeysCacheKey = "books_cache_keys";

    public Task<Unit> Handle(DeleteBookCommand q, CancellationToken ct)
    {
        var book = repo.GetById(q.Id);
        repo.Delete(book);

        InvalidateBooksCache();
        return Task.FromResult(Unit.Value);
    }

    private void InvalidateBooksCache()
    {
        if (!cache.TryGetValue<HashSet<string>>(KeysCacheKey, out var keys))
            return;

        foreach (var key in keys!)
            cache.Remove(key);

        cache.Remove(KeysCacheKey);
    }
}