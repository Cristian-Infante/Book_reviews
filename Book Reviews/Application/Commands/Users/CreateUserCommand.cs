using System.ComponentModel.DataAnnotations;
using Application.Interfaces;
using Domain.Entities;

namespace Application.Commands.Users;

public record  CreateUserCommand(
    [Required, StringLength(50, ErrorMessage = "El nombre no puede exceder los 50 caracteres.")]
    string FirstName, 
    [Required, StringLength(50, ErrorMessage = "El apellido no puede exceder los 50 caracteres.")]
    string LastName, 
    [Required, EmailAddress(ErrorMessage = "El correo electrónico no es válido.")]
    string Email, 
    [Required, StringLength(20, ErrorMessage = "La contraseña debe tener al menos 6 caracteres.", MinimumLength = 6)]
    string Password
) : ICommand<User>;