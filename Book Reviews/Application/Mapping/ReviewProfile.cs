using Application.Commands.Reviews;
using Application.DTOs;
using AutoMapper;
using Domain.Entities;

namespace Application.Mapping;

public class ReviewProfile : Profile
{
    public ReviewProfile()
    {
        CreateMap<Review, ReviewDto>()
            .ForMember(d => d.UserName, o => o.MapFrom(s => s.User.FirstName + " " + s.User.LastName));
        
        CreateMap<CreateReviewCommand, Review>()
            .ForMember(d => d.CreatedAt,
                o => o.MapFrom(_ => DateTime.UtcNow));

        CreateMap<UpdateReviewCommand, Review>()
            .ForMember(d => d.UpdatedAt,
                o => o.MapFrom(_ => DateTime.UtcNow));
    }
}