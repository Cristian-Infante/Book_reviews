using System.ComponentModel.DataAnnotations;
using Application.Interfaces;
using Domain.Entities;

namespace Application.Commands.Reviews;

public record CreateReviewCommand(
    [Required, Range(1, int.MaxValue, ErrorMessage = "El ID del libro debe ser un número positivo.")]
    int BookId, 
    [Required, Range(1, int.MaxValue, ErrorMessage = "El ID del usuario debe ser un número positivo.")]
    int UserId, 
    [Required, Range(1, 5, ErrorMessage = "La calificación debe estar entre 1 y 5.")]
    int Rating, 
    [Required, StringLength(1000, ErrorMessage = "El comentario no puede exceder los 1000 caracteres.")]
    string Comment
) : ICommand<Review>;