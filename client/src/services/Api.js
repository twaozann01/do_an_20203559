import Http from "./Http";

//Register
export const registerUser = (formData) =>
  Http.post("/Auth/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// Login
export const loginUser = (config) => Http.post("/Auth/login", config)


//Service
export const getServices = (config) => Http.get("/Service", config);
export const postServices = (config) => Http.post("/Service",config)

export const getService = (serviceId,config) => Http.get(`/Service/${serviceId}`, config);
export const putService = (serviceId, config) => Http.put(`/Service/${serviceId}`,config)
export const deleteService = (serviceId, config) => Http.delete(`/Service/${serviceId}`,config)

export const getServiceDevices = (serviceId, config) => Http.get(`/Service/${serviceId}/devices`, config);
export const postServiceDevices = (serviceId, config) => Http.post(`/Service/${serviceId}/devices`, config);

export const getServiceDevice = (serviceId, deviceId, config) => Http.get(`/Service/${serviceId}/devices/${deviceId}`, config);
export const putServiceDevice = (serviceId, deviceId, config) => Http.put(`/Service/${serviceId}/devices/${deviceId}`, config);
export const deleteServiceDevice = (serviceId, deviceId, config) => Http.delete(`/Service/${serviceId}/devices/${deviceId}`, config);

export const getDeviceDetails = (serviceId, deviceId, config) => Http.get(`/Service/${serviceId}/devices/${deviceId}/detail`, config);
export const postDeviceDetails = (serviceId, deviceId, config) => Http.post(`/Service/${serviceId}/devices/${deviceId}/detail`, config);

export const putDeviceDetail = (serviceId, deviceId, detailId, config) => Http.put(`/Service/${serviceId}/devices/${deviceId}/detail/${detailId}`, config)
export const deleteDeviceDetail = (serviceId, deviceId, detailId, config) => Http.delete(`/Service/${serviceId}/devices/${deviceId}/detail/${detailId}`, config)

//Device
export const getDevice = (serviceDeviceId, config) => Http.get(`/ServiceDevice/${serviceDeviceId}`, config)
//Device Detail
export const getDetail = (deviceDetailId, config) => Http.get(`/DeviceDetail/${deviceDetailId}`, config)




  //User
export const getCustomer = (config) => Http.get("/User", config)

export const getInfo = (userId, config) => Http.get(`/User/${userId}`, config)
export const putInfo = (userId, formData) =>
  Http.put(`/User/${userId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });


export const deleteCustomer  = (userId, config) => Http.delete(`/User/${userId}`, config)


export const updatePassword = (userId, config) => Http.patch(`/User/${userId}/password`, config)
export const updateStatus = (userId, config) => Http.patch(`/User/${userId}/status`, config)
export const updateRole = (userId, config) => Http.patch(`/User/${userId}/role`, config)

// Address
export const postAddress = (userId, config) => Http.post(`/User/${userId}/address`, config)
export const getAddress = (userId, config) => Http.get(`/User/${userId}/address`, config)
export const putAddress = (userId, addressId, config) => Http.put(`/User/${userId}/address/${addressId}`, config)
export const deleteAddress = (userId, addressId, config) => Http.delete(`/User/${userId}/address/${addressId}`, config)
export const getAddressUser = (userId, addressId, config) => Http.get(`/User/${userId}/address/${addressId}`, config)

// Repairman Form
export const getRepairmanForms = (config) => Http.get("/RepairmanForm", config)
export const postRepairmanForm = (formData, config) => {
  return Http.post("/RepairmanForm", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(config?.headers || {})
    },
    ...config
  });
};

export const getRepairmanForm = (Id, config) => Http.get(`/RepairmanForm/${Id}`, config)
export const getRepairmanFormUser = (userId, config) => Http.get(`/RepairmanForm/user/${userId}`, config)
export const updateRepairmanForm = (userId, config) => Http.patch(`/RepairmanForm/${userId}/status`, config)

//Order
export const getOrders = (config) => Http.get("/Order", config)
export const postOrder = (formData) => {
  return Http.post("/Order", formData, {
    headers: {
      "Content-Type": "multipart/form-data", // <- thêm dòng này
    },
  });
};

export const getOrder = (id, config) => Http.get(`/Order/${id}`, config)
export const patchOrderRate = (id, config) => Http.patch(`/Order/${id}/rate`, config)
// export const patchOrderRepair = (id, config) =>Http.patch(`/Order/${id}/repair`, config)
// export const patchOrderPayment = (id, config) => Http.patch(`/Order/${id}/payment`, config)
export const patchOrderCompleted = (id, config) => Http.patch(`/Order/${id}/complete-order`, config)
export const patchOrderCannel = (id, config) => Http.patch(`/Order/${id}/cancel-order`, config)
export const patchOrderStart = (id, config) => Http.patch(`/Order/${id}/start-repair`, config)
export const postOrderPayment = (orderId, config) => Http.post(`Order/payment/${orderId}/pay`, config)
export const patchUpdatePayment = (orderId) => Http.patch(`/Order/${orderId}/update-payment`);
export const patchStatusWorking  = (userId) => Http.patch(`/User/${userId}/toggle-working-status`)
export const putAcceptOrder = (OrderId, repairmanId) => Http.put(`/Order/${OrderId}/accept`, {repairmanId: repairmanId})




// VAT
export const postVAT = (vatValue) =>
  Http.post("Vat", vatValue, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
export const getVATCurrent = () => Http.get("/Vat/current")

export const getWalletInfo = () =>
  Http.get("/Wallet", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

// Dashboard
export const getDashboard= () => Http.get("/Dashboard/statistics")
export const getDashboardDailyOrders = () => Http.get("/Dashboard/daily-orders")
export const getDashboardDailyRevenue = () => Http.get("/Dashboard/daily-revenue")
export const getDashboardServiceUsage = () => Http.get("/Dashboard/service-usage")
export const getDashboardOrderStatusRate = () => Http.get("/Dashboard/order-status-rate")
export const getDashboardTopRepairmen = () => Http.get("/Dashboard/top-repairmen") 
export const getDashboardTopCustomers = () => Http.get("/Dashboard/top-customers") 
export const getDashboardRecentOrders  = () => Http.get("/Dashboard/recent-orders") 
