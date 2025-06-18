using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Application.DTOs;

public class UploadPhotoRequest
{
    [Required]
    [FromForm(Name = "file")]
    public IFormFile File { get; set; } = default!;
}