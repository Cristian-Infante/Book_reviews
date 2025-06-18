using Application.DTOs;
using MediatR;

namespace Application.Queries.Reviews;

public record GetReviewsByUserQuery(int UserId) : IRequest<IEnumerable<ReviewDto>>;