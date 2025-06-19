using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class AddCityDistrictToRepairmanForm : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Areas",
                table: "RepairmanForms");

            migrationBuilder.RenameColumn(
                name: "CccdFront",
                table: "RepairmanForms",
                newName: "District");

            migrationBuilder.RenameColumn(
                name: "CccdBack",
                table: "RepairmanForms",
                newName: "City");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "District",
                table: "RepairmanForms",
                newName: "CccdFront");

            migrationBuilder.RenameColumn(
                name: "City",
                table: "RepairmanForms",
                newName: "CccdBack");

            migrationBuilder.AddColumn<string>(
                name: "Areas",
                table: "RepairmanForms",
                type: "text",
                nullable: true);
        }
    }
}
