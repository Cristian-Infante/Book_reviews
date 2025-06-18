using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Application.DTOs;
using Application.Interfaces;
using Application.Settings;
using Domain.Entities;
using Domain.Interfaces;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Application.Services;

public class JwtTokenService(IOptions<JwtSettings> opts, IUnitOfWork uow) : IJwtTokenService
{
    private readonly JwtSettings _settings = opts.Value;

    public AuthResultDto GenerateToken(User user)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email)
        };

        var key    = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.SecretKey!));
        var creds  = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var now    = DateTime.UtcNow;
        var exp    = now.AddMinutes(_settings.AccessTokenExpirationMinutes);

        var jwt = new JwtSecurityToken(
            issuer:             _settings.Issuer,
            audience:           _settings.Audience,
            claims:             claims,
            notBefore:          now,
            expires:            exp,
            signingCredentials: creds
        );

        var accessToken = new JwtSecurityTokenHandler().WriteToken(jwt);

        var refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
        var rtEntity = new RefreshToken {
            UserId = user.Id,
            Token  = refreshToken,
            Created = now,
            Expires = now.AddDays(_settings.RefreshTokenExpirationDays),
            Revoked = false
        };
        uow.RefreshTokens.Add(rtEntity);
        uow.Save();

        return new AuthResultDto(
            accessToken,
            exp,
            refreshToken,
            rtEntity.Expires
        );
    }
}