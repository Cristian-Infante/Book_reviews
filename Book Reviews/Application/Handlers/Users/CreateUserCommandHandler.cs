using Application.Commands.Users;
using Application.Utilities;
using AutoMapper;
using Domain.Entities;
using Domain.Interfaces;
using MediatR;

namespace Application.Handlers.Users;

public class CreateUserCommandHandler(IUserRepository repo, IMapper mapper) : IRequestHandler<CreateUserCommand, User>
{
    public Task<User> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var user = mapper.Map<User>(request);

        repo.Add(user);
        return Task.FromResult(user);
    }
}