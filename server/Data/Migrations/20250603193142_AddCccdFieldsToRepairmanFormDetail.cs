using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class AddCccdFieldsToRepairmanFormDetail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CccdBack",
                table: "RepairmanForms",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CccdFront",
                table: "RepairmanForms",
                type: "text",
                nullable: true);

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CccdBack",
                table: "RepairmanForms");

            migrationBuilder.DropColumn(
                name: "CccdFront",
                table: "RepairmanForms");

            migrationBuilder.DropColumn(
                name: "CccdBack",
                table: "RepairmanFormDetails");

            migrationBuilder.DropColumn(
                name: "CccdFront",
                table: "RepairmanFormDetails");
        }
    }
}
