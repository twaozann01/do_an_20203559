using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class AddOrderRatingFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "RatingTern",
                table: "Orders",
                newName: "RatingUpdatedDate");

            migrationBuilder.AddColumn<bool>(
                name: "HasUpdatedRating",
                table: "Orders",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HasUpdatedRating",
                table: "Orders");

            migrationBuilder.RenameColumn(
                name: "RatingUpdatedDate",
                table: "Orders",
                newName: "RatingTern");
        }
    }
}
