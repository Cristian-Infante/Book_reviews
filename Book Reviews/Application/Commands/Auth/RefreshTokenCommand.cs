using System.ComponentModel.DataAnnotations;
using Application.DTOs;
using MediatR;

namespace Application.Commands.Auth;

public record RefreshTokenCommand(
    [Required, StringLength(100, ErrorMessage = "El token no puede exceder los 100 caracteres.")]
    string RefreshToken
) : IRequest<AuthResultDto>;