using FluentValidation;
using Shared.Models;

namespace Shared.Validators
{
    public class CreateServiceValidator : AbstractValidator<CreateServiceRequest>
    {
        public CreateServiceValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("Tên ngành không được để trống.");
        }
    }

    public class UpdateServiceValidator : AbstractValidator<UpdateServiceRequest>
    {
        public UpdateServiceValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("Tên ngành không được để trống.");
        }
    }
}
