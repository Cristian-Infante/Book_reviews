using Application.DTOs;
using MediatR;

namespace Application.Queries.Users;

public record GetUsersQuery() : IRequest<IEnumerable<UserDto>>;