using System.ComponentModel.DataAnnotations;
using Application.Interfaces;
using MediatR;

namespace Application.Commands.Users;

public record DeleteUserPhotoCommand(
    [Required, Range(1, int.MaxValue)]
    int Id
) : ICommand<Unit>;