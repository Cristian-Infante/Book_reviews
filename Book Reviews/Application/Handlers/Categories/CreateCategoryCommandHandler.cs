using Application.Commands.Categories;
using AutoMapper;
using Domain.Entities;
using Domain.Interfaces;
using MediatR;

namespace Application.Handlers.Categories;

public class CreateCategoryCommandHandler(ICategoryRepository repo, IMapper mapper) : IRequestHandler<CreateCategoryCommand, Category>
{
    public Task<Category> Handle(CreateCategoryCommand request, CancellationToken ct)
    {
        var category = mapper.Map<Category>(request);
        
        repo.Add(category);
        return Task.FromResult(category);
    }
}