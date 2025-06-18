using Application.DTOs;
using MediatR;

namespace Application.Queries.Books;

public record SearchBooksQuery(string Term) : IRequest<IEnumerable<BookDto>>;