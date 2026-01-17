import apiClient from "./api.client";
import { ENDPOINTS } from "./api.config";

const getProducts = () => {
  return apiClient.get(ENDPOINTS.INVENTORY.PRODUCTS);
};

const createProduct = (productData) => {
  return apiClient.post(ENDPOINTS.INVENTORY.PRODUCTS, productData);
};

const getCategories = () => {
  return apiClient.get(ENDPOINTS.INVENTORY.CATEGORIES);
};

const InventoryService = {
  getProducts,
  createProduct,
  getCategories,
};

export default InventoryService;