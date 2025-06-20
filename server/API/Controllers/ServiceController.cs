using Data.Interfaces;
using Mapster;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage;
using Shared.Entities;
using Shared.Utils;
using Shared.Models;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public ServiceController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<IActionResult> GetListAsync(
    [FromQuery] int offset = 0,
    [FromQuery] int limit = 10)
        {
            var services = await _unitOfWork.ServiceRepository.GetPageAsync(offset, limit);

            return Ok(new
            {
                status = 200,
                message = "Lấy danh sách ngành dịch vụ thành công.",
                data = new PageData<ServiceDto>
                {
                    Items = services.Item1.Adapt<List<ServiceDto>>(),
                    Total = services.Item2
                }
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetByIdAsync([FromRoute] Guid id)
        {
            var service = await _unitOfWork.ServiceRepository.GetDetailAsync(id);
            if (service == null)
            {
                return NotFound(new
                {
                    status = 404,
                    message = "Không tìm thấy ngành dịch vụ."
                });
            }

            var result = service.Adapt<ServiceDto>();
            return Ok(new
            {
                status = 200,
                message = "Lấy thông tin ngành dịch vụ thành công.",
                data = result
            });
        }


        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromBody] CreateServiceRequest request)
        {
            // Kiểm tra trùng tên ngành
            var isExisted = await _unitOfWork.ServiceRepository
                .AnyAsync(s => s.Name!.ToLower().Trim() == request.Name!.ToLower().Trim());

            if (isExisted)
            {
                return BadRequest(new
                {
                    status = 400,
                    message = "Tên ngành đã tồn tại trong hệ thống."
                });
            }

            var service = request.Adapt<Shared.Entities.Service>();
            service.CreatedAt = TimeHelper.GetVietnamTime();

            await _unitOfWork.ServiceRepository.AddAsync(service, true);

            return StatusCode(201, new
            {
                status = 201,
                message = "Tạo ngành dịch vụ thành công.",
                data = new
                {
                    service.Id,
                    service.Name,
                    service.Description
                }
            });
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAsync([FromRoute] Guid id, [FromBody] UpdateServiceRequest request)
        {
            var existingService = await _unitOfWork.ServiceRepository.GetByIdAsync(id);
            if (existingService == null)
            {
                return NotFound(new
                {
                    status = 404,
                    message = "Không tìm thấy ngành dịch vụ."
                });
            }

            // Kiểm tra trùng tên (loại trừ bản ghi hiện tại)
            var isDuplicate = await _unitOfWork.ServiceRepository
                .AnyAsync(s => s.Name!.ToLower().Trim() == request.Name!.ToLower().Trim() && s.Id != id);

            if (isDuplicate)
            {
                return BadRequest(new
                {
                    status = 400,
                    message = "Tên ngành đã tồn tại trong hệ thống."
                });
            }

            var service = request.Adapt(existingService);
            await _unitOfWork.ServiceRepository.UpdateAsync(service, true);

            return Ok(new
            {
                status = 200,
                message = "Cập nhật ngành dịch vụ thành công."
            });
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync([FromRoute] Guid id)
        {
            try
            {
                var isServiceExists = await _unitOfWork.ServiceRepository.AnyAsync(x => x.Id == id);
                if (!isServiceExists)
                {
                    return NotFound(new
                    {
                        status = 404,
                        message = "Không tìm thấy ngành dịch vụ."
                    });
                }

                var serviceDeviceIds = await _unitOfWork.ServiceDeviceRepository
                    .GetIdsAsync(sd => sd.ServiceId == id);

                var serviceDetailIds = await _unitOfWork.DeviceDetailRepository
                    .GetIdsAsync(sd => serviceDeviceIds.Contains(sd.ServiceDeviceId));

                await _unitOfWork.BeginTransactionAsync();
                await _unitOfWork.DeviceDetailRepository.ExecuteDeleteAsync(sd => serviceDetailIds.Contains(sd.Id));
                await _unitOfWork.ServiceDeviceRepository.ExecuteDeleteAsync(sd => sd.ServiceId == id);
                await _unitOfWork.ServiceRepository.ExecuteDeleteAsync(sd => sd.Id == id);
                await _unitOfWork.CommitTransactionAsync();

                return Ok(new
                {
                    status = 200,
                    message = "Xóa ngành dịch vụ thành công."
                });
            }
            catch (Exception)
            {
                await _unitOfWork.RollbackTransactionAsync();
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi khi xóa ngành dịch vụ."
                });
            }
        }


        [HttpGet("{serviceId}/devices")]
        public async Task<IActionResult> GetDevicesAsync(
    [FromRoute] Guid serviceId,
    [FromQuery] int offset = 0,
    [FromQuery] int limit = 10)
        {
            var isServiceExists = await _unitOfWork.ServiceRepository.AnyAsync(s => s.Id == serviceId);
            if (!isServiceExists)
            {
                return BadRequest(new
                {
                    status = 400,
                    message = "Không tìm thấy ngành dịch vụ."
                });
            }

            var devices = await _unitOfWork.ServiceDeviceRepository.GetListWithFilterAsync(new Shared.Filters.ServiceDeviceFilter
            {
                ServiceId = serviceId,
                Offset = offset,
                Limit = limit
            });

            return Ok(new
            {
                status = 200,
                message = "Lấy danh sách thiết bị thành công.",
                data = new PageData<ServiceDeviceDto>
                {
                    Items = devices.Item1.Adapt<List<ServiceDeviceDto>>(),
                    Total = devices.Item2
                }
            });
        }


        [HttpGet("{serviceId}/devices/{deviceId}")]
        public async Task<IActionResult> GetDeviceByIdAsync(
     [FromRoute] Guid serviceId,
     [FromRoute] Guid deviceId)
        {
            var isServiceExists = await _unitOfWork.ServiceRepository.AnyAsync(s => s.Id == serviceId);
            if (!isServiceExists)
            {
                return BadRequest(new
                {
                    status = 400,
                    message = "Không tìm thấy ngành dịch vụ."
                });
            }

            var serviceDevice = await _unitOfWork.ServiceDeviceRepository.GetDetailAsync(deviceId);
            if (serviceDevice == null || serviceDevice.ServiceId != serviceId)
            {
                return NotFound(new
                {
                    status = 404,
                    message = "Không tìm thấy thiết bị thuộc ngành dịch vụ này."
                });
            }

            var result = serviceDevice.Adapt<ServiceDeviceDto>();
            return Ok(new
            {
                status = 200,
                message = "Lấy thông tin thiết bị thành công.",
                data = result
            });
        }


        [HttpPost("{serviceId}/devices")]
        public async Task<IActionResult> AddDevicesAsync([FromRoute] Guid serviceId, [FromBody] CreateServiceDeviceRequest request)
        {
            var isServiceExists = await _unitOfWork.ServiceRepository.AnyAsync(s => s.Id == serviceId);
            if (!isServiceExists)
            {
                return BadRequest(new
                {
                    status = 400,
                    message = "Không tìm thấy ngành dịch vụ."
                });
            }

            var serviceDevice = request.Adapt<ServiceDevice>();
            serviceDevice.ServiceId = serviceId;

            await _unitOfWork.ServiceDeviceRepository.AddAsync(serviceDevice, true);

            return StatusCode(201, new
            {
                status = 201,
                message = "Thêm thiết bị vào ngành thành công.",
                data = new
                {
                    serviceDevice.Id,
                    serviceDevice.Name,
                    serviceDevice.Description,
                    serviceDevice.ServiceId
                }
            });
        }


        [HttpPut("{serviceId}/devices/{deviceId}")]
        public async Task<IActionResult> UpdateDeviceAsync(
    [FromRoute] Guid serviceId,
    [FromRoute] Guid deviceId,
    [FromBody] CreateServiceDeviceRequest request)
        {
            var isServiceExists = await _unitOfWork.ServiceRepository.AnyAsync(s => s.Id == serviceId);
            if (!isServiceExists)
            {
                return BadRequest(new
                {
                    status = 400,
                    message = "Không tìm thấy ngành dịch vụ."
                });
            }

            var serviceDevice = await _unitOfWork.ServiceDeviceRepository.GetByIdAsync(deviceId);
            if (serviceDevice == null || serviceDevice.ServiceId != serviceId)
            {
                return NotFound(new
                {
                    status = 404,
                    message = "Không tìm thấy thiết bị thuộc ngành dịch vụ này."
                });
            }

            request.Adapt(serviceDevice);
            await _unitOfWork.ServiceDeviceRepository.UpdateAsync(serviceDevice, true);

            return Ok(new
            {
                status = 200,
                message = "Cập nhật thiết bị thành công."
            });
        }

        [HttpDelete("{serviceId}/devices/{deviceId}")]
        public async Task<IActionResult> RemoveDeviceAsync([FromRoute] Guid serviceId, [FromRoute] Guid deviceId)
        {
            var isServiceExists = await _unitOfWork.ServiceRepository.AnyAsync(s => s.Id == serviceId);
            if (!isServiceExists)
            {
                return BadRequest(new
                {
                    status = 400,
                    message = "Không tìm thấy ngành dịch vụ."
                });
            }

            var serviceDevice = await _unitOfWork.ServiceDeviceRepository.GetByIdAsync(deviceId);
            if (serviceDevice == null || serviceDevice.ServiceId != serviceId)
            {
                return NotFound(new
                {
                    status = 404,
                    message = "Không tìm thấy thiết bị thuộc ngành dịch vụ này."
                });
            }

            await _unitOfWork.ServiceDeviceRepository.DeleteAsync(serviceDevice, true);

            return Ok(new
            {
                status = 200,
                message = "Xóa thiết bị khỏi ngành thành công."
            });
        }


        [HttpGet("{serviceId}/devices/{deviceId}/detail")]
        public async Task<IActionResult> GetDeviceDetailsAsync(
    [FromRoute] Guid serviceId,
    [FromRoute] Guid deviceId,
    [FromQuery] int offset = 0,
    [FromQuery] int limit = 10)
        {
            var isServiceExists = await _unitOfWork.ServiceRepository.AnyAsync(s => s.Id == serviceId);
            if (!isServiceExists)
            {
                return BadRequest(new
                {
                    status = 400,
                    message = "Không tìm thấy ngành dịch vụ."
                });
            }

            var isDeviceExists = await _unitOfWork.ServiceDeviceRepository
                .AnyAsync(sd => sd.Id == deviceId && sd.ServiceId == serviceId);
            if (!isDeviceExists)
            {
                return BadRequest(new
                {
                    status = 400,
                    message = "Không tìm thấy thiết bị thuộc ngành dịch vụ."
                });
            }

            var details = await _unitOfWork.DeviceDetailRepository.GetListWithFilterAsync(
                new Shared.Filters.DeviceDetailFilter
                {
                    ServiceDeviceId = deviceId,
                    Offset = offset,
                    Limit = limit
                });

            return Ok(new
            {
                status = 200,
                message = "Lấy danh sách lỗi thiết bị thành công.",
                data = new PageData<DeviceDetailDto>
                {
                    Items = details.Item1.Adapt<List<DeviceDetailDto>>(),
                    Total = details.Item2
                }
            });
        }


        [HttpPost("{serviceId}/devices/{deviceId}/detail")]
        public async Task<IActionResult> AddDeviceDetailAsync(
    [FromRoute] Guid serviceId,
    [FromRoute] Guid deviceId,
    [FromBody] CreateDeviceDetailRequest request)
        {
            var isServiceExists = await _unitOfWork.ServiceRepository.AnyAsync(s => s.Id == serviceId);
            if (!isServiceExists)
            {
                return BadRequest(new
                {
                    status = 400,
                    message = "Không tìm thấy ngành dịch vụ."
                });
            }

            var isDeviceExists = await _unitOfWork.ServiceDeviceRepository
                .AnyAsync(sd => sd.Id == deviceId && sd.ServiceId == serviceId);
            if (!isDeviceExists)
            {
                return BadRequest(new
                {
                    status = 400,
                    message = "Không tìm thấy thiết bị thuộc ngành dịch vụ."
                });
            }

            var serviceDetail = request.Adapt<DeviceDetail>();
            serviceDetail.ServiceDeviceId = deviceId;
            serviceDetail.CreatedAt = TimeHelper.GetVietnamTime();

            await _unitOfWork.DeviceDetailRepository.AddAsync(serviceDetail, true);

            return StatusCode(201, new
            {
                status = 201,
                message = "Thêm lỗi thiết bị thành công.",
                data = new
                {
                    serviceDetail.Id,
                    serviceDetail.Name,
                    serviceDetail.MinPrice,
                    serviceDetail.Description
                }
            });
        }


        [HttpPut("{serviceId}/devices/{deviceId}/detail/{detailId}")]
        public async Task<IActionResult> UpdateDeviceDetailAsync(
     [FromRoute] Guid serviceId,
     [FromRoute] Guid deviceId,
     [FromRoute] Guid detailId,
     [FromBody] UpdateDeviceDetailRequest request)
        {
            var isServiceExists = await _unitOfWork.ServiceRepository.AnyAsync(s => s.Id == serviceId);
            if (!isServiceExists)
            {
                return BadRequest(new
                {
                    status = 400,
                    message = "Không tìm thấy ngành dịch vụ."
                });
            }

            var isDeviceExists = await _unitOfWork.ServiceDeviceRepository.AnyAsync(sd => sd.Id == deviceId && sd.ServiceId == serviceId);
            if (!isDeviceExists)
            {
                return BadRequest(new
                {
                    status = 400,
                    message = "Không tìm thấy thiết bị thuộc ngành dịch vụ."
                });
            }

            var serviceDetail = await _unitOfWork.DeviceDetailRepository.GetByIdAsync(detailId);
            if (serviceDetail == null || serviceDetail.ServiceDeviceId != deviceId)
            {
                return NotFound(new
                {
                    status = 404,
                    message = "Không tìm thấy lỗi thiết bị thuộc thiết bị này."
                });
            }

            request.Adapt(serviceDetail);
            await _unitOfWork.DeviceDetailRepository.SaveChangesAsync();

            return Ok(new
            {
                status = 200,
                message = "Cập nhật lỗi thiết bị thành công."
            });
        }


        [HttpDelete("{serviceId}/devices/{deviceId}/detail/{detailId}")]
        public async Task<IActionResult> RemoveDeviceDetailAsync(
    [FromRoute] Guid serviceId,
    [FromRoute] Guid deviceId,
    [FromRoute] Guid detailId)
        {
            var isServiceExists = await _unitOfWork.ServiceRepository.AnyAsync(s => s.Id == serviceId);
            if (!isServiceExists)
            {
                return BadRequest(new
                {
                    status = 400,
                    message = "Không tìm thấy ngành dịch vụ."
                });
            }

            var isDeviceExists = await _unitOfWork.ServiceDeviceRepository
                .AnyAsync(sd => sd.Id == deviceId && sd.ServiceId == serviceId);
            if (!isDeviceExists)
            {
                return BadRequest(new
                {
                    status = 400,
                    message = "Không tìm thấy thiết bị thuộc ngành dịch vụ."
                });
            }

            var serviceDetail = await _unitOfWork.DeviceDetailRepository.GetByIdAsync(detailId);
            if (serviceDetail == null || serviceDetail.ServiceDeviceId != deviceId)
            {
                return NotFound(new
                {
                    status = 404,
                    message = "Không tìm thấy lỗi thiết bị thuộc thiết bị này."
                });
            }

            await _unitOfWork.DeviceDetailRepository.DeleteAsync(serviceDetail, true);

            return Ok(new
            {
                status = 200,
                message = "Xóa lỗi thiết bị thành công."
            });
        }

    }
}
