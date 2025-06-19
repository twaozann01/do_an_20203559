using System.Threading.Tasks;

public interface IVatService
{
    Task<decimal?> GetCurrentVatAsync();
}
