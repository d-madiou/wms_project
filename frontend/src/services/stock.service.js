import apiClient from "./api.client";
import { ENDPOINTS } from "./api.config";

const getStockItems = () => {
  return apiClient.get(ENDPOINTS.STOCK.ITEMS);
};

const receiveStock = (data) => {
  const payload = { ...data, movement_type: 'IN' };
  return apiClient.post(ENDPOINTS.STOCK.MOVEMENTS, payload);
};

const shipStock = (data) => {
  const payload = { ...data, movement_type: 'OUT' };
  return apiClient.post(ENDPOINTS.STOCK.MOVEMENTS, payload);
};

const getMovements = () => {
  return apiClient.get(ENDPOINTS.STOCK.MOVEMENTS);
};

const StockService = {
  getStockItems,
  receiveStock, 
  shipStock,
  getMovements,
};

export default StockService;