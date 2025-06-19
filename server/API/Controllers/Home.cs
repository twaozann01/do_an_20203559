// using Microsoft.AspNetCore.Mvc;
// using Shared.Utils;

// namespace API.Controllers
// {
//     [ApiController]
//     [Route("api/")]
//     public class HomeController : ControllerBase
//     {
//         [HttpGet]
//         public IActionResult Get()
//         { 
//             var response = new
//             {
//                 Message = "API backend hoạt động thành công!",
//                 Timestamp = TimeHelper.GetVietnamTime(),
//                 Version = "v1.0"
//             };

//             return Ok(response);
//         }
//     }
// }
