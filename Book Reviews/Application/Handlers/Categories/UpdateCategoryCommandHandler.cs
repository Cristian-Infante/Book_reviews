using Application.Commands.Categories;
using AutoMapper;
using Domain.Interfaces;
using MediatR;

namespace Application.Handlers.Categories;

public class UpdateCategoryCommandHandler(ICategoryRepository repo, IMapper mapper) : IRequestHandler<UpdateCategoryCommand, Unit>
{
    public Task<Unit> Handle(UpdateCategoryCommand request, CancellationToken ct)
    {
        var existing = repo.GetById(request.Id);
        mapper.Map(request, existing);
        
        repo.Update(existing);
        return Task.FromResult(Unit.Value);
    }
}