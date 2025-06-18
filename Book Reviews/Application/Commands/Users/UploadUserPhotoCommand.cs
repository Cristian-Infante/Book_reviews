using System.ComponentModel.DataAnnotations;
using Application.Interfaces;
using MediatR;

namespace Application.Commands.Users;

public record UploadUserPhotoCommand(
    [Required, Range(1, int.MaxValue, ErrorMessage = "El ID del usuario debe ser un número positivo.")]
    int UserId, 
    [Required(ErrorMessage = "Debe enviar la imagen en 'Photo'."), MinLength(1,  ErrorMessage = "El archivo no puede estar vacío.")]
    byte[] Photo
) : ICommand<Unit>;