using System.ComponentModel.DataAnnotations;
using Application.Interfaces;
using MediatR;

namespace Application.Commands.Users;

public record DeleteUserCommand(
    [Required, Range(1, int.MaxValue, ErrorMessage = "El ID del usuario debe ser un número positivo.")]
    int Id
) : ICommand<Unit>;