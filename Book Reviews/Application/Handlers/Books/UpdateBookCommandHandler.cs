using Application.Commands.Books;
using AutoMapper;
using Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Caching.Memory;

namespace Application.Handlers.Books;

public class UpdateBookCommandHandler(
    IBookRepository repo,
    IMapper mapper,
    IMemoryCache cache)
    : IRequestHandler<UpdateBookCommand, Unit>
{
    private const string KeysCacheKey = "books_cache_keys";

    public Task<Unit> Handle(UpdateBookCommand request, CancellationToken ct)
    {
        var existing = repo.GetById(request.Id);
        mapper.Map(request, existing);
        repo.Update(existing);

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