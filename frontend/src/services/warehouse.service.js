import apiClient from "./api.client";
import { ENDPOINTS } from "./api.config";

const getAllWarehouses = () => {
  return apiClient.get(ENDPOINTS.WAREHOUSES.LIST);
};


const getAllLocations = () => {
  return apiClient.get(ENDPOINTS.WAREHOUSES.LOCATIONS);
};

const createWarehouse = (data) => {
  return apiClient.post(ENDPOINTS.WAREHOUSES.LIST, data);
};

const createLocation = (data) => {
  return apiClient.post(ENDPOINTS.WAREHOUSES.LOCATIONS, data);
};

const WarehouseService = {
  getAllWarehouses,
  getAllLocations,  
  createWarehouse,
  createLocation,
};

export default WarehouseService;