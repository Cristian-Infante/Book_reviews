using Application.DTOs;
using MediatR;

namespace Application.Queries.Users;

public record GetUserByIdQuery(int Id) : IRequest<UserDto>;