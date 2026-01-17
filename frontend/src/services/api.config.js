const API_BASE_URL = "http://localhost:8000/api";

const ENDPOINTS = {
  AUTH: {
    LOGIN: "/token/",
    REFRESH: "/token/refresh/",
  },
  INVENTORY: {
    CATEGORIES: "/categories/",
    PRODUCTS: "/products/",
  },
  STOCK: {
    ITEMS: "/stock/",
  },
  WAREHOUSES: {
    LIST: "/warehouses/",
    LOCATIONS: "/locations/",
  },
};

export { API_BASE_URL, ENDPOINTS };