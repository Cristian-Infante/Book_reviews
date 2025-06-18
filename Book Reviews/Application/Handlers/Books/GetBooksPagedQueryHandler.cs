using Application.DTOs;
using Application.Queries.Books;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Application.Handlers.Books;

public class GetBooksPagedQueryHandler(
    IBookRepository repo,
    IMemoryCache cache,
    IMapper mapper)
    : IRequestHandler<GetBooksPagedQuery, PagedResult<BookDto>>
{
    private const string KeysCacheKey = "books_cache_keys";
    private readonly MemoryCacheEntryOptions _opts = new()
    {
        SlidingExpiration = TimeSpan.FromMinutes(5)
    };

    public async Task<PagedResult<BookDto>> Handle(
        GetBooksPagedQuery q,
        CancellationToken    ct)
    {
        var searchKey = string.IsNullOrWhiteSpace(q.Search) ? "all" : q.Search.Trim();
        var categoryKey = q.CategoryId.HasValue ? q.CategoryId.Value.ToString() : "all";

        var cacheKey = $"books_{q.PageNumber}_{q.PageSize}_{searchKey}_{categoryKey}";
        if (cache.TryGetValue(cacheKey, out PagedResult<BookDto>? cached))
            return cached!;

        var query = repo
            .Find(b =>
                (!q.CategoryId.HasValue || b.CategoryId == q.CategoryId.Value) &&
                (string.IsNullOrWhiteSpace(q.Search) ||
                 b.Title.Contains(q.Search!) ||
                 b.Author.Contains(q.Search!)))
            .AsQueryable()
            .Include(b => b.Category)
            .OrderBy(b => b.Title);

        var total = await query.CountAsync(ct);
        var items = await query
            .Skip((q.PageNumber - 1) * q.PageSize)
            .Take(q.PageSize)
            .ProjectTo<BookDto>(mapper.ConfigurationProvider)
            .ToListAsync(ct);

        var result = new PagedResult<BookDto>(items, q.PageNumber, q.PageSize, total);
        cache.Set(cacheKey, result, _opts);

        var keys = cache.GetOrCreate(KeysCacheKey, entry =>
        {
            entry.SlidingExpiration = TimeSpan.FromMinutes(5);
            return new HashSet<string>();
        });
        keys!.Add(cacheKey);
        cache.Set(KeysCacheKey, keys, _opts);

        return result;
    }
}
