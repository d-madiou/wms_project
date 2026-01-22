import apiClient from "./api.client";
import { ENDPOINTS } from "./api.config";

const getAllProducts = () => {
  return apiClient.get(ENDPOINTS.INVENTORY.PRODUCTS);
};

const createProduct = (productData) => {
  return apiClient.post(ENDPOINTS.INVENTORY.PRODUCTS, productData);
};
const getAllCategories = () => {
  return apiClient.get("/categories/");
};

const InventoryService = {
  getAllProducts,
  createProduct,
  getAllCategories,
};

export default InventoryService;