﻿using Data.Interfaces;
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
            [FromQuery] int limit = 10
            )
        {
            var services = await _unitOfWork.ServiceRepository.GetPageAsync(offset, limit);
            return Ok(new PageData<ServiceDto>
            {
                Items = services.Item1.Adapt<List<ServiceDto>>(),
                Total = services.Item2
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetByIdAsync([FromRoute] Guid id)
        {
            var service = await _unitOfWork.ServiceRepository.GetDetailAsync(id);
            if (service == null)
            {
                return NotFound();
            }
            var result = service.Adapt<ServiceDto>();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromBody] CreateServiceRequest request)
        {
            var service = request.Adapt<Shared.Entities.Service>();
            service.CreatedAt = TimeHelper.GetVietnamTime();
            await _unitOfWork.ServiceRepository.AddAsync(service, true);
            return Created();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAsync([FromRoute] Guid id, [FromBody] UpdateServiceRequest request)
        {
            var existingService = await _unitOfWork.ServiceRepository.GetByIdAsync(id);
            if (existingService == null)
            {
                return NotFound();
            }
            var service = request.Adapt(existingService);
            await _unitOfWork.ServiceRepository.UpdateAsync(service, true);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync([FromRoute] Guid id)
        {
            try
            {
                var isServiceExists = await _unitOfWork.ServiceRepository.AnyAsync(x => x.Id == id);
                if (!isServiceExists)
                {
                    return NotFound();
                }
                var serviceDeviceIds = await _unitOfWork.ServiceDeviceRepository.GetIdsAsync(sd => sd.ServiceId == id);
                var serviceDetailIds = await _unitOfWork.DeviceDetailRepository.GetIdsAsync(sd => serviceDeviceIds.Contains(sd.ServiceDeviceId));

                await _unitOfWork.BeginTransactionAsync();
                await _unitOfWork.DeviceDetailRepository.ExecuteDeleteAsync(sd => serviceDetailIds.Contains(sd.Id));
                await _unitOfWork.ServiceDeviceRepository.ExecuteDeleteAsync(sd => sd.ServiceId == id);
                await _unitOfWork.ServiceRepository.ExecuteDeleteAsync(sd => sd.Id == id);
                await _unitOfWork.CommitTransactionAsync();

                return NoContent();
            }
            catch (Exception)
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }

        [HttpGet("{serviceId}/devices")]
        public async Task<IActionResult> GetDevicesAsync(
            [FromRoute] Guid serviceId,
            [FromQuery] int offset = 0,
            [FromQuery] int limit = 10
            )
        {
            var isServiceExists = await _unitOfWork.ServiceRepository.AnyAsync(s => s.Id == serviceId);
            if (!isServiceExists)
            {
                return BadRequest("Service not found");
            }
            var devices = await _unitOfWork.ServiceDeviceRepository.GetListWithFilterAsync(new Shared.Filters.ServiceDeviceFilter
            {
                ServiceId = serviceId,
                Offset = offset,
                Limit = limit
            });
            return Ok(new PageData<ServiceDeviceDto>
            {
                Items = devices.Item1.Adapt<List<ServiceDeviceDto>>(),
                Total = devices.Item2
            });
        }

        [HttpGet("{serviceId}/devices/{deviceId}")]
        public async Task<IActionResult> GetDeviceByIdAsync([FromRoute] Guid serviceId, [FromRoute] Guid deviceId)
        {
            var isServiceExists = await _unitOfWork.ServiceRepository.AnyAsync(s => s.Id == serviceId);
            if (!isServiceExists)
            {
                return BadRequest("Service not found");
            }
            var serviceDevice = await _unitOfWork.ServiceDeviceRepository.GetDetailAsync(deviceId);
            if (serviceDevice == null || serviceDevice.ServiceId != serviceId)
            {
                return NotFound();
            }
            var result = serviceDevice.Adapt<ServiceDeviceDto>();
            return Ok(result);
        }

        [HttpPost("{serviceId}/devices")]
        public async Task<IActionResult> AddDevicesAsync([FromRoute] Guid serviceId, [FromBody] CreateServiceDeviceRequest request)
        {
            var isServiceExists = await _unitOfWork.ServiceRepository.AnyAsync(s => s.Id == serviceId);
            if (!isServiceExists)
            {
                return BadRequest("Service not found");
            }
            var serviceDevice = request.Adapt<ServiceDevice>();
            serviceDevice.ServiceId = serviceId;
            await _unitOfWork.ServiceDeviceRepository.AddAsync(serviceDevice, true);
            return Created();
        }

        [HttpPut("{serviceId}/devices/{deviceId}")]
        public async Task<IActionResult> UpdateDeviceAsync([FromRoute] Guid serviceId, [FromRoute] Guid deviceId, [FromBody] CreateServiceDeviceRequest request)
        {
            var isServiceExists = await _unitOfWork.ServiceRepository.AnyAsync(s => s.Id == serviceId);
            if (!isServiceExists)
            {
                return BadRequest("Service not found");
            }
            var serviceDevice = await _unitOfWork.ServiceDeviceRepository.GetByIdAsync(deviceId);
            if (serviceDevice == null || serviceDevice.ServiceId != serviceId)
            {
                return NotFound();
            }
            request.Adapt(serviceDevice);
            await _unitOfWork.ServiceDeviceRepository.UpdateAsync(serviceDevice, true);
            return NoContent();
        }

        [HttpDelete("{serviceId}/devices/{deviceId}")]
        public async Task<IActionResult> RemoveDeviceAsync([FromRoute] Guid serviceId, [FromRoute] Guid deviceId)
        {
            var isServiceExists = await _unitOfWork.ServiceRepository.AnyAsync(s => s.Id == serviceId);
            if (!isServiceExists)
            {
                return BadRequest("Service not found");
            }
            var serviceDevice = await _unitOfWork.ServiceDeviceRepository.GetByIdAsync(deviceId);
            if (serviceDevice == null || serviceDevice.ServiceId != serviceId)
            {
                return NotFound();
            }
            await _unitOfWork.ServiceDeviceRepository.DeleteAsync(serviceDevice, true);
            return NoContent();
        }

        [HttpGet("{serviceId}/devices/{deviceId}/detail")]
        public async Task<IActionResult> GetDeviceDetailsAsync(
            [FromRoute] Guid serviceId,
            [FromRoute] Guid deviceId,
            [FromQuery] int offset = 0,
            [FromQuery] int limit = 10
            )
        {
            var isServiceExists = await _unitOfWork.ServiceRepository.AnyAsync(s => s.Id == serviceId);
            if (!isServiceExists)
            {
                return BadRequest("Service not found");
            }
            var isDeviceExists = await _unitOfWork.ServiceDeviceRepository.AnyAsync(sd => sd.Id == deviceId && sd.ServiceId == serviceId);
            if (!isDeviceExists)
            {
                return BadRequest("Service device not found");
            }
            var details = await _unitOfWork.DeviceDetailRepository.GetListWithFilterAsync(new Shared.Filters.DeviceDetailFilter
            {
                ServiceDeviceId = deviceId,
            });
            return Ok(new PageData<DeviceDetailDto>
            {
                Items = details.Item1.Adapt<List<DeviceDetailDto>>(),
                Total = details.Item2
            });
        }

        [HttpPost("{serviceId}/devices/{deviceId}/detail")]
        public async Task<IActionResult> AddDeviceDetailAsync([FromRoute] Guid serviceId, [FromRoute] Guid deviceId, [FromBody] CreateDeviceDetailRequest request)
        {
            var isServiceExists = await _unitOfWork.ServiceRepository.AnyAsync(s => s.Id == serviceId);
            if (!isServiceExists)
            {
                return BadRequest("Service not found");
            }
            var isDeviceExists = await _unitOfWork.ServiceDeviceRepository.AnyAsync(sd => sd.Id == deviceId && sd.ServiceId == serviceId);
            if (!isDeviceExists)
            {
                return BadRequest("Service device not found");
            }
            var serviceDetail = request.Adapt<DeviceDetail>();
            serviceDetail.ServiceDeviceId = deviceId;
            serviceDetail.CreatedAt = TimeHelper.GetVietnamTime();
            await _unitOfWork.DeviceDetailRepository.AddAsync(serviceDetail, true);
            return Created();
        }

        [HttpPut("{serviceId}/devices/{deviceId}/detail/{detailId}")]
        public async Task<IActionResult> UpdateDeviceDetailAsync([FromRoute] Guid serviceId, [FromRoute] Guid deviceId, [FromRoute] Guid detailId, [FromBody] UpdateDeviceDetailRequest request)
        {
            var isServiceExists = await _unitOfWork.ServiceRepository.AnyAsync(s => s.Id == serviceId);
            if (!isServiceExists)
            {
                return BadRequest("Service not found");
            }
            var isDeviceExists = await _unitOfWork.ServiceDeviceRepository.AnyAsync(sd => sd.Id == deviceId && sd.ServiceId == serviceId);
            if (!isDeviceExists)
            {
                return BadRequest("Service device not found");
            }
            var serviceDetail = await _unitOfWork.DeviceDetailRepository.GetByIdAsync(detailId);
            if (serviceDetail == null || serviceDetail.ServiceDeviceId != deviceId)
            {
                return NotFound();
            }
            request.Adapt(serviceDetail);
            await _unitOfWork.DeviceDetailRepository.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{serviceId}/devices/{deviceId}/detail/{detailId}")]
        public async Task<IActionResult> RemoveDeviceDetailAsync([FromRoute] Guid serviceId, [FromRoute] Guid deviceId, [FromRoute] Guid detailId)
        {
            var isServiceExists = await _unitOfWork.ServiceRepository.AnyAsync(s => s.Id == serviceId);
            if (!isServiceExists)
            {
                return BadRequest("Service not found");
            }
            var isDeviceExists = await _unitOfWork.ServiceDeviceRepository.AnyAsync(sd => sd.Id == deviceId && sd.ServiceId == serviceId);
            if (!isDeviceExists)
            {
                return BadRequest("Service device not found");
            }
            var serviceDetail = await _unitOfWork.DeviceDetailRepository.GetByIdAsync(detailId);
            if (serviceDetail == null || serviceDetail.ServiceDeviceId != deviceId)
            {
                return NotFound();
            }
            await _unitOfWork.DeviceDetailRepository.DeleteAsync(serviceDetail, true);
            return NoContent();
        }
    }
}
