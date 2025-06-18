using Application.DTOs;
using Application.Queries.Users;
using AutoMapper;
using Domain.Interfaces;
using MediatR;

namespace Application.Handlers.Users;

public class GetUserByIdQueryHandler(IUserRepository repo, IMapper mapper) : IRequestHandler<GetUserByIdQuery, UserDto>
{
    public Task<UserDto> Handle(GetUserByIdQuery q, CancellationToken ct)
    {
        var user = repo.GetById(q.Id);
        var dto = mapper.Map<UserDto>(user);
        return Task.FromResult(dto);
    }
}