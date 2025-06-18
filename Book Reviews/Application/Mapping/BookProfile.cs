using Application.Commands.Books;
using Application.DTOs;
using AutoMapper;
using Domain.Entities;

namespace Application.Mapping;

public class BookProfile : Profile
{
    public BookProfile()
    {
        CreateMap<Book, BookDto>()
            .ForMember(d => d.CategoryName,
                o => o.MapFrom(s => s.Category.Name)
            );
        CreateMap<CreateBookCommand, Book>();
        CreateMap<UpdateBookCommand, Book>();
    }
}