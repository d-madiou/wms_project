const API_BASE_URL = "http://localhost:8000/api";

const ENDPOINTS = {
  AUTH: {
    LOGIN: "/token/",
    REFRESH: "/token/refresh/",
    REGISTER: "/register/",     
    PROFILE: "/user/profile/",    
  },
  INVENTORY: {
    CATEGORIES: "/categories/",
    PRODUCTS: "/products/",
  },
  STOCK: {
    ITEMS: "/stock/",
    MOVEMENTS: "/movements/",  
  },
  WAREHOUSES: {
    LIST: "/warehouses/",
    LOCATIONS: "/locations/",
  },
};

export { API_BASE_URL, ENDPOINTS };