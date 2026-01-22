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

const updateWarehouse = (id, data) => {
  return apiClient.patch(`${ENDPOINTS.WAREHOUSES.LIST}${id}/`, data);
};

const updateLocation = (id, data) => {
  return apiClient.patch(`${ENDPOINTS.WAREHOUSES.LOCATIONS}${id}/`, data);
};


const deleteWarehouse = (id) => {
  return apiClient.delete(`${ENDPOINTS.WAREHOUSES.LIST}${id}/`);
};

const deleteLocation = (id) => {
  return apiClient.delete(`${ENDPOINTS.WAREHOUSES.LOCATIONS}${id}/`);
};

const WarehouseService = {
  getAllWarehouses,
  getAllLocations,
  createWarehouse,
  createLocation,
  updateWarehouse,
  updateLocation,
  deleteWarehouse,
  deleteLocation,
};

export default WarehouseService;