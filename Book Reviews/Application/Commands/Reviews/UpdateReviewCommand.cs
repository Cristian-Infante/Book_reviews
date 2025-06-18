using System.ComponentModel.DataAnnotations;
using Application.Interfaces;
using MediatR;

namespace Application.Commands.Reviews;

public record UpdateReviewCommand(
    [Required, Range(1, int.MaxValue, ErrorMessage = "El ID debe ser un número positivo.")]
    int Id, 
    [Required, Range(1, int.MaxValue, ErrorMessage = "El ID del libro debe ser un número positivo.")]
    int BookId,
    [Required, Range(1, 5, ErrorMessage = "La calificación debe estar entre 1 y 5.")]
    int Rating, 
    [Required, StringLength(1000, ErrorMessage = "El comentario no puede exceder los 1000 caracteres.")]
    string Comment
) : ICommand<Unit>
{
}