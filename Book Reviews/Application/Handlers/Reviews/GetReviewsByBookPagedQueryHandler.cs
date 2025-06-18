using Application.DTOs;
using Application.Queries.Reviews;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Application.Handlers.Reviews;

public class GetReviewsByBookPagedQueryHandler(
    IReviewRepository repo,
    IMemoryCache cache,
    IMapper mapper)
    : IRequestHandler<GetReviewsByBookPagedQuery, PagedResult<ReviewDto>>
{
    private const string KeysCachePrefix = "reviews_book_keys_";
    private readonly MemoryCacheEntryOptions _opts = new()
    {
        SlidingExpiration = TimeSpan.FromMinutes(5)
    };

    public async Task<PagedResult<ReviewDto>> Handle(
        GetReviewsByBookPagedQuery q,
        CancellationToken ct)
    {
        var key = $"reviews_book_{q.BookId}_{q.PageNumber}_{q.PageSize}";
        if (cache.TryGetValue(key, out PagedResult<ReviewDto>? cached))
            return cached!;

        var query = repo
            .Find(r => r.BookId == q.BookId)
            .OrderByDescending(r => r.CreatedAt);

        var total = await query.CountAsync(ct);
        var list  = await query
            .Skip((q.PageNumber - 1) * q.PageSize)
            .Take(q.PageSize)
            .ProjectTo<ReviewDto>(mapper.ConfigurationProvider)
            .ToListAsync(ct);

        var result = new PagedResult<ReviewDto>(list, q.PageNumber, q.PageSize, total);

        cache.Set(key, result, _opts);

        var keysCacheKey = $"{KeysCachePrefix}{q.BookId}";
        var keys = cache.GetOrCreate(keysCacheKey, entry =>
        {
            entry.SlidingExpiration = TimeSpan.FromMinutes(5);
            return new HashSet<string>();
        });
        keys!.Add(key);
        cache.Set(keysCacheKey, keys, _opts);

        return result;
    }
}
