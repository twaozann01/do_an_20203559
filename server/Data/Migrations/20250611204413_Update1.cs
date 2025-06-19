using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class Update1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Orders_ServiceDeviceId",
                table: "Orders",
                column: "ServiceDeviceId");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_ServiceDevices_ServiceDeviceId",
                table: "Orders",
                column: "ServiceDeviceId",
                principalTable: "ServiceDevices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_ServiceDevices_ServiceDeviceId",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_ServiceDeviceId",
                table: "Orders");
        }
    }
}
