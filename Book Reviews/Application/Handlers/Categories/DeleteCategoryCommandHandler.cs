using Application.Commands.Categories;
using Domain.Interfaces;
using MediatR;

namespace Application.Handlers.Categories;

public class DeleteCategoryCommandHandler(ICategoryRepository repo) : IRequestHandler<DeleteCategoryCommand, Unit>
{
    public Task<Unit> Handle(DeleteCategoryCommand request, CancellationToken ct)
    {
        var category = repo.GetById(request.Id);
        
        repo.Delete(category);
        return Task.FromResult(Unit.Value);
    }
}