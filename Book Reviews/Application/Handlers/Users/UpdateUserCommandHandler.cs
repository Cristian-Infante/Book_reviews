using Application.Commands.Users;
using AutoMapper;
using Domain.Interfaces;
using MediatR;

namespace Application.Handlers.Users;

public class UpdateUserCommandHandler(IUserRepository repo, IMapper mapper) : IRequestHandler<UpdateUserCommand, Unit>
{
    public Task<Unit> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var existing = repo.GetById(request.Id);
        mapper.Map(request, existing);

        repo.Update(existing);
        return Task.FromResult(Unit.Value);
    }
}