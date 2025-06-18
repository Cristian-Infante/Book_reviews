using System.ComponentModel.DataAnnotations;
using Application.Interfaces;
using MediatR;

namespace Application.Commands.Auth;

public record ResetPasswordCommand(
    [Required, StringLength(6, ErrorMessage = "El token debe tener exactamente 6 caracteres.")]
    string Token,
    [Required, StringLength(20, ErrorMessage = "La contraseña debe tener al menos 6 caracteres.", MinimumLength = 6)]
    string NewPassword
) : ICommand<Unit>;