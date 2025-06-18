using System.ComponentModel.DataAnnotations;
using Application.Interfaces;
using MediatR;

namespace Application.Commands.Categories;

public record UpdateCategoryCommand(
    [Required, Range(1, int.MaxValue, ErrorMessage = "El ID debe ser un número positivo.")]
    int Id,
    [Required, StringLength(50, ErrorMessage = "El nombre no puede exceder los 50 caracteres.")]
    string Name
) : ICommand<Unit>;