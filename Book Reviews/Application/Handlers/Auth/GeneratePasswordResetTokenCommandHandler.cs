using System.Security.Cryptography;
using Application.Commands.Auth;
using Domain.Entities;
using Domain.Interfaces;
using MediatR;
using Application.Interfaces;

namespace Application.Handlers.Auth;

public class GeneratePasswordResetTokenCommandHandler(
    IUserRepository userRepo,
    IPasswordResetTokenRepository tokenRepo,
    IEmailService emailService)
    : IRequestHandler<GeneratePasswordResetTokenCommand, Unit>
{
    public async Task<Unit> Handle(
        GeneratePasswordResetTokenCommand request,
        CancellationToken cancellationToken)
    {
        var user = userRepo.GetByEmail(request.Email);
        if (user is null)
            return Unit.Value;

        var code    = RandomNumberGenerator.GetInt32(100000, 1000000).ToString();
        var expires = DateTime.UtcNow.AddHours(1);

        tokenRepo.Add(new PasswordResetToken {
            UserId    = user.Id,
            Token     = code,
            ExpiresAt = expires,
            Used      = false
        });

        var body = $"""
            <p>Hemos recibido una solicitud para cambiar tu contraseña.</p>
            <h2 style="color:#2E86C1;">{code}</h2>
            <p>Expira en 1 hora.</p>
        """;

        try
        {
            await emailService.SendAsync(user.Email,
                "Tu código para restablecer la contraseña",
                body);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
        }

        return Unit.Value;
    }
}