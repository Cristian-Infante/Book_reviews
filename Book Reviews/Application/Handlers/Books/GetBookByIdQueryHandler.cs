using Application.DTOs;
using Application.Queries.Books;
using AutoMapper;
using Domain.Interfaces;
using MediatR;

namespace Application.Handlers.Books;

public class GetBookByIdQueryHandler(IBookRepository repo, IMapper mapper) : IRequestHandler<GetBookByIdQuery, BookDto>
{
    public Task<BookDto> Handle(GetBookByIdQuery q, CancellationToken ct)
    {
        var b   = repo.GetById(q.Id);
        var dto = mapper.Map<BookDto>(b);
        return Task.FromResult(dto);
    }
}