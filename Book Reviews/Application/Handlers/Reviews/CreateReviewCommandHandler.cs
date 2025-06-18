using Application.Commands.Reviews;
using AutoMapper;
using Domain.Entities;
using Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Caching.Memory;

namespace Application.Handlers.Reviews;

public class CreateReviewCommandHandler(
    IReviewRepository repo,
    IMapper mapper,
    IMemoryCache cache)
    : IRequestHandler<CreateReviewCommand, Review>
{
    private const string KeysCachePrefix = "reviews_book_keys_";

    public Task<Review> Handle(CreateReviewCommand request, CancellationToken ct)
    {
        var review = mapper.Map<Review>(request);
        review.CreatedAt = DateTime.UtcNow;

        repo.Add(review);

        InvalidateReviewsCache(request.BookId);
        return Task.FromResult(review);
    }

    private void InvalidateReviewsCache(int bookId)
    {
        var keysCacheKey = $"{KeysCachePrefix}{bookId}";

        if (!cache.TryGetValue<HashSet<string>>(keysCacheKey, out var keys))
            return;

        foreach (var key in keys!)
            cache.Remove(key);

        cache.Remove(keysCacheKey);
    }
}
