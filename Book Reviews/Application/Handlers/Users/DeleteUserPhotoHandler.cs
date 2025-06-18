using Application.Commands.Users;
using Domain.Interfaces;
using MediatR;

namespace Application.Handlers.Users;

public class DeleteUserPhotoHandler(IUserRepository repository)
    : IRequestHandler<DeleteUserPhotoCommand, Unit>
{
    public Task<Unit> Handle(DeleteUserPhotoCommand request, CancellationToken ct)
    {
        var user = repository.GetById(request.Id);
        if (user is null)
            throw new Exception("Usuario no encontrado");

        user.ProfileImage = null;
        repository.Update(user);

        return Task.FromResult(Unit.Value);
    }
}