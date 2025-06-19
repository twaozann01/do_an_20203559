namespace Shared.Models
{
    public class RepairmanProfile
    {
        public Guid ServiceDeviceId { get; set; }
        public string? DeviceName { get; set; }
        public int YearsOfExperience { get; set; }
        public string? Description { get; set; }
        public string? Degree { get; set; }
    }
}
