using Application.Commands.Auth;
using Application.DTOs;
using Application.Interfaces;
using Domain.Interfaces;
using MediatR;

namespace Application.Handlers.Auth;

public class RefreshTokenCommandHandler(
    IRefreshTokenRepository refreshRepo,
    IUserRepository userRepo,
    IJwtTokenService jwtService)
    : IRequestHandler<RefreshTokenCommand, AuthResultDto>
{
    public Task<AuthResultDto> Handle(
        RefreshTokenCommand cmd,
        CancellationToken ct)
    {
        var rt = refreshRepo.GetByToken(cmd.RefreshToken);
        if (rt == null || rt.Expires < DateTime.UtcNow || rt.Revoked)
            throw new ApplicationException("Refresh token inválido o expirado.");

        rt.Revoked = true;
        refreshRepo.Update(rt);

        var user = userRepo.GetById(rt.UserId);
        var auth = jwtService.GenerateToken(user);

        return Task.FromResult(auth);
    }
}