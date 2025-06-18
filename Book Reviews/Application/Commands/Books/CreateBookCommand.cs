using System.ComponentModel.DataAnnotations;
using Application.Interfaces;
using Domain.Entities;

namespace Application.Commands.Books;

public record CreateBookCommand(
    [Required, StringLength(200, ErrorMessage = "El título no puede exceder los 200 caracteres.")]
    string Title,

    [Required, StringLength(100, ErrorMessage = "El nombre del autor no puede exceder los 100 caracteres.")]
    string Author,

    [Required, StringLength(1000, ErrorMessage = "La descripción no puede exceder los 1000 caracteres.")]
    string Summary,

    [Range(1, int.MaxValue, ErrorMessage = "CategoryId debe ser > 0")]
    int CategoryId
) : ICommand<Book>;