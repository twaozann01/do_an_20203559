﻿using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Models
{
    public class UserDto
    {
        public Guid? Id { get; set; }
        public string? FullName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? Avatar { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Status { get; set; }
        public string? Role { get; set; }
        public double? Average { get; set; }
        public int? ReviewCount { get; set; }
        public int? CompletedOrderCount { get; set; } = 0;

        public string? Bio { get; set; }
        public string? WorkingStatus { get; set; }
        public DateTime? CreatedAt { get; set; }

        public List<RepairmanProfile>? RepairmanInfos { get; set; }


        public List<AddressUserDto>? Addresses { get; set; }
    }

    public class AuthLoginRequest
    {
        public string? Phone { get; set; }
        public string? Password { get; set; }
    }
    public class AuthRefreshTokenRequest
    {
        public Guid? UserId { get; set; }
        public string? RefreshToken { get; set; }
    }

    public class SendPasswordResetCodeRequest
    {
        public string? Email { get; set; }
    }

    public class ResetPasswordRequest
    {
        public string? Email { get; set; }
        public string? Code { get; set; }
        public string? NewPassword { get; set; }
    }
    public class AuthLoginResponse
    {
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }
    }

    public class ChangePasswordRequest
    {
        public string? OldPassword { get; set; }
        public string? NewPassword { get; set; }
    }

    public class ForgotPasswordRequest
    {
        public string? Email { get; set; }
    }

    public class CreateUserRequest
    {
        public string? FullName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        // public IFormFile? AvatarFile { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Password { get; set; }
    }

    public class UpdateUserRequest
    {
        public string? FullName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public IFormFile? AvatarFile { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        // public int? Average { get; set; }
        // public int? ReviewCount { get; set; }
        public string? Bio { get; set; }
        // public string? WorkingStatus { get; set; }
    }

    public class ChangeUserStatusRequest
    {
        public string? Status { get; set; }
    }

    public class ChangeUserRoleRequest
    {
        public string? Role { get; set; }
    }
    public class TopRepairmanDto
    {
        public Guid RepairmanId { get; set; }
        public string Name { get; set; } = null!;
        public double AverageRating { get; set; }
        public int TotalOrders { get; set; }
    }
    public class TopCustomerDto
    {
        public Guid CustomerId { get; set; }
        public string Name { get; set; } = null!;
        public int TotalOrders { get; set; }
        public decimal TotalSpent { get; set; }
    }

}
