using Application.DTOs;
using MediatR;

namespace Application.Queries.Reviews;

public record GetReviewsByBookPagedQuery(int BookId, int PageNumber, int PageSize) : IRequest<PagedResult<ReviewDto>>;