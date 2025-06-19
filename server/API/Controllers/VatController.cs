using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Shared.Entities;
using Data.Config; // nếu AppDbContext nằm ở đây
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;


[Route("api/[controller]")]
public class VatController : ControllerBase
{
    private readonly AppDbContext _context;

    public VatController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> UpdateVat([FromBody] decimal newValue)
    {
        if (newValue <= 0 || newValue > 1)
            return BadRequest("Giá trị VAT phải nằm trong khoảng 0 < VAT ≤ 1");

        var vat = new VatConfig
        {
            Id = Guid.NewGuid(),
            Value = newValue,
            UpdatedAt = DateTime.UtcNow
        };

        await _context.VatConfigs.AddAsync(vat);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Cập nhật VAT thành công",
            value = vat.Value
        });
    }

    [HttpGet("current")]
    public async Task<IActionResult> GetCurrentVat()
    {
        var vat = await _context.VatConfigs
            .OrderByDescending(v => v.UpdatedAt)
            .FirstOrDefaultAsync();

        if (vat == null)
            return NotFound("Chưa có VAT nào được cấu hình.");

        return Ok(vat.Value);
    }

}
