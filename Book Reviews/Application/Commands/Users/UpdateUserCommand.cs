using System.ComponentModel.DataAnnotations;
using Application.Interfaces;
using MediatR;

namespace Application.Commands.Users;

public record UpdateUserCommand(
    [Required, Range(1, int.MaxValue, ErrorMessage = "El ID debe ser un número positivo.")]
    int Id, 
    [Required, StringLength(50, ErrorMessage = "El nombre no puede exceder los 50 caracteres.")]
    string FirstName, 
    [Required, StringLength(50, ErrorMessage = "El apellido no puede exceder los 50 caracteres.")]
    string LastName, 
    [Required, EmailAddress(ErrorMessage = "El correo electrónico no es válido.")]
    string Email, 
    [MinLength(1,  ErrorMessage = "El archivo no puede estar vacío.")]
    byte[]? ProfileImage
) : ICommand<Unit>;