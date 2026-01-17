import apiClient from "./api.client";
import { ENDPOINTS } from "./api.config";

const getWarehouses = () => {
  return apiClient.get(ENDPOINTS.WAREHOUSES.LIST);
};

const getLocations = () => {
  return apiClient.get(ENDPOINTS.WAREHOUSES.LOCATIONS);
};

const createWarehouse = (data) => {
  return apiClient.post(ENDPOINTS.WAREHOUSES.LIST, data);
};

const createLocation = (data) => {
  return apiClient.post(ENDPOINTS.WAREHOUSES.LOCATIONS, data);
};

const WarehouseService = {
  getWarehouses,
  getLocations,
  createWarehouse,
  createLocation,
};

export default WarehouseService;