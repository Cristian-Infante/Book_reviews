using System.ComponentModel.DataAnnotations;
using Application.Interfaces;
using MediatR;

namespace Application.Commands.Categories;

public record DeleteCategoryCommand(
    [Required, Range(1, int.MaxValue, ErrorMessage = "El ID debe ser un número positivo.")]
    int Id
) : ICommand<Unit>;