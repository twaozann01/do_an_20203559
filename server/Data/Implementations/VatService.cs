using Data.Config;
using Shared.Entities;
using Microsoft.EntityFrameworkCore;

public class VatService : IVatService
{
    private readonly AppDbContext _context;

    public VatService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<decimal?> GetCurrentVatAsync()
    {
        var vat = await _context.VatConfigs
            .OrderByDescending(v => v.UpdatedAt)
            .FirstOrDefaultAsync();

        return vat?.Value;
    }
}
