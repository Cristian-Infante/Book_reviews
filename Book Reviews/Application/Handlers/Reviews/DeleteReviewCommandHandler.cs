using Application.Commands.Reviews;
using Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Caching.Memory;

namespace Application.Handlers.Reviews;

public class DeleteReviewCommandHandler(
    IReviewRepository repo,
    IMemoryCache cache) 
    : IRequestHandler<DeleteReviewCommand, Unit>
{
    private const string KeysCachePrefix = "reviews_book_keys_";

    public Task<Unit> Handle(DeleteReviewCommand request, CancellationToken ct)
    {
        var review = repo.GetById(request.Id);
        repo.Delete(review);

        InvalidateReviewsCache(review.BookId);

        return Task.FromResult(Unit.Value);
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