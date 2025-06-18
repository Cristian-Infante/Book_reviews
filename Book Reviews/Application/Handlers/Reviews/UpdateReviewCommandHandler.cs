using Microsoft.Extensions.Caching.Memory;
using Application.Commands.Reviews;
using AutoMapper;
using Domain.Interfaces;
using MediatR;

namespace Application.Handlers.Reviews
{
    public class UpdateReviewCommandHandler(
        IReviewRepository repo,
        IMapper mapper,
        IMemoryCache cache)
        : IRequestHandler<UpdateReviewCommand, Unit>
    {
        private const string KeysCachePrefix = "reviews_book_keys_";

        public Task<Unit> Handle(UpdateReviewCommand request, CancellationToken ct)
        {
            var existing = repo.GetById(request.Id);
            mapper.Map(request, existing);
            existing.UpdatedAt = DateTime.UtcNow;

            repo.Update(existing);

            InvalidateReviewsCache(request.BookId);

            return Task.FromResult(Unit.Value);
        }

        private void InvalidateReviewsCache(int bookId)
        {
            var keysCacheKey = $"{KeysCachePrefix}{bookId}";
            if (!cache.TryGetValue<HashSet<string>>(keysCacheKey, out var keys)) return;
            foreach (var key in keys!)
            {
                cache.Remove(key);
            }
            cache.Remove(keysCacheKey);
        }
    }
}