import apiClient from "./api.client";
import { ENDPOINTS } from "./api.config";

// --- RENAMED to match Inventory.jsx ---
const getAllProducts = () => {
  return apiClient.get(ENDPOINTS.INVENTORY.PRODUCTS);
};

const createProduct = (productData) => {
  return apiClient.post(ENDPOINTS.INVENTORY.PRODUCTS, productData);
};

const getCategories = () => {
  return apiClient.get(ENDPOINTS.INVENTORY.CATEGORIES);
};

const InventoryService = {
  getAllProducts, // Now matches the Component call
  createProduct,
  getCategories,
};

export default InventoryService;