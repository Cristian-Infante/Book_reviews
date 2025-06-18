using Application.Commands.Users;
using Domain.Interfaces;
using ImageMagick;
using MediatR;

namespace Application.Handlers.Users;

public class UploadUserPhotoCommandHandler(IUserRepository userRepo) : IRequestHandler<UploadUserPhotoCommand, Unit>
{
    public Task<Unit> Handle(UploadUserPhotoCommand request, CancellationToken cancellationToken)
    {
        using var image = new MagickImage(request.Photo);

        image.Strip();

        if (image.Width > 1024)
            image.Resize(new MagickGeometry(1024, 0) { IgnoreAspectRatio = false });

        image.Quality = 80;

        image.Format = MagickFormat.WebP;

        byte[] optimizedBytes;
        using (var ms = new MemoryStream())
        {
            image.Write(ms);
            optimizedBytes = ms.ToArray();
        }

        var user = userRepo.GetById(request.UserId);
        user.ProfileImage = optimizedBytes;
        userRepo.Update(user);

        return Task.FromResult(Unit.Value);
    }
}
