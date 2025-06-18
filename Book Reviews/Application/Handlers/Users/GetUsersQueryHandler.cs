using Application.DTOs;
using Application.Queries.Users;
using AutoMapper;
using Domain.Interfaces;
using MediatR;

namespace Application.Handlers.Users;

public class GetUsersQueryHandler(IUserRepository repo, IMapper mapper)
    : IRequestHandler<GetUsersQuery, IEnumerable<UserDto>>
{
    public Task<IEnumerable<UserDto>> Handle(GetUsersQuery q, CancellationToken ct)
    {
        var list = repo.GetAll();
        var dtos = mapper.Map<IEnumerable<UserDto>>(list);
        return Task.FromResult(dtos);
    }
}