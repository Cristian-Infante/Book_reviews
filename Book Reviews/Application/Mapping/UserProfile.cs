using Application.Commands.Users;
using Application.DTOs;
using Application.Utilities;
using AutoMapper;
using Domain.Entities;

namespace Application.Mapping;

public class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<User, UserDto>();
        CreateMap<CreateUserCommand, User>()
            .ForMember(dest => dest.PasswordHash,
                opt  => opt.MapFrom(src => PasswordHasher.HashPassword(src.Password)));
        CreateMap<UpdateUserCommand, User>();
    }
}