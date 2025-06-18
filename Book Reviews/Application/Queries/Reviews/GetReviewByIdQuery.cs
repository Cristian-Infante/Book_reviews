using Application.DTOs;
using MediatR;

namespace Application.Queries.Reviews;

public record GetReviewByIdQuery(int Id) : IRequest<ReviewDto>;