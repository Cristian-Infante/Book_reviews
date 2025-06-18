using Application.DTOs;
using Application.Queries.Reviews;
using AutoMapper;
using Domain.Interfaces;
using MediatR;

namespace Application.Handlers.Reviews;

public class GetReviewByIdQueryHandler(IReviewRepository repo, IMapper mapper) : IRequestHandler<GetReviewByIdQuery, ReviewDto>
{
    public Task<ReviewDto> Handle(GetReviewByIdQuery q, CancellationToken ct)
    {
        var r = repo.GetById(q.Id);
        var dto = mapper.Map<ReviewDto>(r);
        return Task.FromResult(dto);
    }
}