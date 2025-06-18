using Application.Commands.Users;
using Domain.Interfaces;
using MediatR;

namespace Application.Handlers.Users;

public class DeleteUserCommandHandler(IUserRepository repo) : IRequestHandler<DeleteUserCommand, Unit>
{
    public Task<Unit> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        var user = repo.GetById(request.Id);
        
        repo.Delete(user);
        return Task.FromResult(Unit.Value);
    }
}