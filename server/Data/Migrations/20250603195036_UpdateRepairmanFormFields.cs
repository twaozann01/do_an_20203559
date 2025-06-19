using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateRepairmanFormFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CccdBack",
                table: "RepairmanFormDetails");

            migrationBuilder.DropColumn(
                name: "CccdFront",
                table: "RepairmanFormDetails");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CccdBack",
                table: "RepairmanFormDetails",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CccdFront",
                table: "RepairmanFormDetails",
                type: "text",
                nullable: true);
        }
    }
}
