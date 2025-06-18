using Application.Commands.Auth;
using Application.Utilities;
using Domain.Interfaces;
using MediatR;

namespace Application.Handlers.Auth;

public class ResetPasswordCommandHandler(
    IUserRepository userRepo,
    IPasswordResetTokenRepository tokenRepo,
    IUnitOfWork uow)
    : IRequestHandler<ResetPasswordCommand, Unit>
{
    private readonly IUnitOfWork _uow = uow;

    public Task<Unit> Handle(ResetPasswordCommand req, CancellationToken ct)
    {
        var prToken = tokenRepo
            .Find(t => t.Token == req.Token && !t.Used)
            .FirstOrDefault();
        if (prToken == null || prToken.ExpiresAt < DateTime.UtcNow)
            throw new ApplicationException("Token inválido o expirado.");

        var user = userRepo.GetById(prToken.UserId);
        user.PasswordHash = PasswordHasher.HashPassword(req.NewPassword);
        userRepo.Update(user);

        prToken.Used = true;
        tokenRepo.Update(prToken);

        return Task.FromResult(Unit.Value);
    }
}
