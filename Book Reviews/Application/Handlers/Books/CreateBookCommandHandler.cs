using Application.Commands.Books;
using AutoMapper;
using Domain.Entities;
using Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Caching.Memory;

namespace Application.Handlers.Books;

public class CreateBookCommandHandler(
    IBookRepository repo,
    IMapper mapper,
    IMemoryCache cache)
    : IRequestHandler<CreateBookCommand, Book>
{
    private const string KeysCacheKey = "books_cache_keys";

    public Task<Book> Handle(CreateBookCommand request, CancellationToken ct)
    {
        var book = mapper.Map<Book>(request);
        repo.Add(book);

        InvalidateBooksCache();
        return Task.FromResult(book);
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