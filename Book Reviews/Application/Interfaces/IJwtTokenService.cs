using Application.DTOs;
using Domain.Entities;

namespace Application.Interfaces;

public interface IJwtTokenService
{
    AuthResultDto GenerateToken(User user);
}