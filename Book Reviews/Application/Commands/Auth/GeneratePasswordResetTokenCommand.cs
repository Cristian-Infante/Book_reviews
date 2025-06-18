using System.ComponentModel.DataAnnotations;
using Application.Interfaces;
using MediatR;

namespace Application.Commands.Auth;

public record GeneratePasswordResetTokenCommand(
    [Required, StringLength(100, ErrorMessage = "El Email no puede exceder los 100 caracteres."), EmailAddress(ErrorMessage = "El Email es requerido")]
    string Email
) : ICommand<Unit>;