using Application.DTOs;
using Application.Queries.Reviews;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Interfaces;
using MediatR;

namespace Application.Handlers.Reviews;

public class GetReviewsByUserQueryHandler(IReviewRepository repo, IMapper mapper)
    : IRequestHandler<GetReviewsByUserQuery, IEnumerable<ReviewDto>>
{
    public Task<IEnumerable<ReviewDto>> Handle(GetReviewsByUserQuery q, CancellationToken ct)
    {
        var dtos = repo
            .Find(r => r.UserId == q.UserId)
            .OrderByDescending(r => r.CreatedAt)
            .AsQueryable()
            .ProjectTo<ReviewDto>(mapper.ConfigurationProvider)
            .ToList();
        return Task.FromResult<IEnumerable<ReviewDto>>(dtos);
    }
}