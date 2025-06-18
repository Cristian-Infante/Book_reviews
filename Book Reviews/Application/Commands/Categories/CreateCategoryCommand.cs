using System.ComponentModel.DataAnnotations;
using Application.Interfaces;
using Domain.Entities;
using MediatR;

namespace Application.Commands.Categories;

public record CreateCategoryCommand(
    [Required, StringLength(50, ErrorMessage = "El nombre no puede exceder los 50 caracteres.")]
    string Name
) : ICommand<Category>;