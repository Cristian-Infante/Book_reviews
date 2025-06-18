using Application.DTOs;
using MediatR;

namespace Application.Queries.Books;

public record GetBookByIdQuery(int Id) : IRequest<BookDto>;