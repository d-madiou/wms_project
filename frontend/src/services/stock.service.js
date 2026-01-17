import apiClient from "./api.client";
import { ENDPOINTS } from "./api.config";

const getAllStock = () => {
  return apiClient.get(ENDPOINTS.STOCK.ITEMS);
};

const addStock = (data) => {
  return apiClient.post(ENDPOINTS.STOCK.ITEMS, data);
};
const shipStock = (data) => {
  return apiClient.post(`${ENDPOINTS.STOCK.ITEMS}ship/`, data);
};

const StockService = {
  getAllStock,
  addStock,
  shipStock,
};

export default StockService;