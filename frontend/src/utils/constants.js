// ==================================================
// MOVEIT CONSTANTS
// ==================================================


// ==================================================
// APPLICATION
// ==================================================

export const APP_NAME = "MoveIt";

export const APP_DESCRIPTION =
  "Reliable package pickup and delivery made simple.";

export const API_BASE_URL =
  "http://127.0.0.1:5000/api";


// ==================================================
// LOCAL STORAGE KEYS
// ==================================================

export const STORAGE_KEYS = {
  TOKEN: "moveitToken",
  USER: "moveitUser",
};


// ==================================================
// USER ROLES
// ==================================================

export const USER_ROLES = {
  CUSTOMER: "customer",
  DRIVER: "driver",
};


// ==================================================
// DELIVERY STATUSES
// ==================================================

export const DELIVERY_STATUS = {
  PENDING: "pending",
  ASSIGNED: "assigned",
  PICKED_UP: "picked_up",
  IN_TRANSIT: "in_transit",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};


// ==================================================
// DELIVERY STATUS LABELS
// ==================================================

export const DELIVERY_STATUS_LABELS = {
  [DELIVERY_STATUS.PENDING]:
    "Pending",

  [DELIVERY_STATUS.ASSIGNED]:
    "Driver Assigned",

  [DELIVERY_STATUS.PICKED_UP]:
    "Picked Up",

  [DELIVERY_STATUS.IN_TRANSIT]:
    "In Transit",

  [DELIVERY_STATUS.DELIVERED]:
    "Delivered",

  [DELIVERY_STATUS.CANCELLED]:
    "Cancelled",
};


// ==================================================
// DELIVERY STATUS DESCRIPTIONS
// ==================================================

export const DELIVERY_STATUS_DESCRIPTIONS = {
  [DELIVERY_STATUS.PENDING]:
    "Your delivery request has been received.",

  [DELIVERY_STATUS.ASSIGNED]:
    "A driver has accepted your delivery.",

  [DELIVERY_STATUS.PICKED_UP]:
    "Your package has been picked up.",

  [DELIVERY_STATUS.IN_TRANSIT]:
    "Your package is on its way.",

  [DELIVERY_STATUS.DELIVERED]:
    "Your package has been delivered.",

  [DELIVERY_STATUS.CANCELLED]:
    "This delivery has been cancelled.",
};


// ==================================================
// DELIVERY STATUS FLOW
// ==================================================

export const DELIVERY_STATUS_FLOW = {
  [DELIVERY_STATUS.PENDING]: [
    DELIVERY_STATUS.ASSIGNED,
  ],

  [DELIVERY_STATUS.ASSIGNED]: [
    DELIVERY_STATUS.PICKED_UP,
    DELIVERY_STATUS.CANCELLED,
  ],

  [DELIVERY_STATUS.PICKED_UP]: [
    DELIVERY_STATUS.IN_TRANSIT,
    DELIVERY_STATUS.CANCELLED,
  ],

  [DELIVERY_STATUS.IN_TRANSIT]: [
    DELIVERY_STATUS.DELIVERED,
    DELIVERY_STATUS.CANCELLED,
  ],

  [DELIVERY_STATUS.DELIVERED]: [],

  [DELIVERY_STATUS.CANCELLED]: [],
};


// ==================================================
// DRIVER STATUS
// ==================================================

export const DRIVER_STATUS = {
  AVAILABLE: true,
  UNAVAILABLE: false,
};


// ==================================================
// VEHICLE TYPES
// ==================================================

export const VEHICLE_TYPES = {
  MOTORCYCLE: "motorcycle",
  CAR: "car",
  VAN: "van",
  PICKUP: "pickup",
  TRUCK: "truck",
  LORRY: "lorry",
};


// ==================================================
// VEHICLE TYPE LABELS
// ==================================================

export const VEHICLE_TYPE_LABELS = {
  [VEHICLE_TYPES.MOTORCYCLE]:
    "Motorcycle",

  [VEHICLE_TYPES.CAR]:
    "Car",

  [VEHICLE_TYPES.VAN]:
    "Van",

  [VEHICLE_TYPES.PICKUP]:
    "Pickup",

  [VEHICLE_TYPES.TRUCK]:
    "Truck",

  [VEHICLE_TYPES.LORRY]:
    "Lorry",
};


// ==================================================
// VEHICLE TYPE OPTIONS
// ==================================================

export const VEHICLE_TYPE_OPTIONS = [
  {
    value: VEHICLE_TYPES.MOTORCYCLE,
    label: "Motorcycle",
  },

  {
    value: VEHICLE_TYPES.CAR,
    label: "Car",
  },

  {
    value: VEHICLE_TYPES.VAN,
    label: "Van",
  },

  {
    value: VEHICLE_TYPES.PICKUP,
    label: "Pickup",
  },

  {
    value: VEHICLE_TYPES.TRUCK,
    label: "Truck",
  },

  {
    value: VEHICLE_TYPES.LORRY,
    label: "Lorry",
  },
];


// ==================================================
// NAVIGATION PAGES
// ==================================================

export const PAGES = {
  HOME: "home",
  LOGIN: "login",
  REGISTER: "register",

  DASHBOARD: "dashboard",

  CREATE_TRIP:
    "create-trip",

  MY_TRIPS:
    "my-trips",

  TRIP_DETAILS:
    "trip-details",

  DRIVER_SETUP:
    "driver-setup",

  DRIVER_DASHBOARD:
    "driver-dashboard",

  VEHICLES:
    "vehicles",
};


// ==================================================
// HTTP / API
// ==================================================

export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PATCH: "PATCH",
  PUT: "PUT",
  DELETE: "DELETE",
};


// ==================================================
// DEFAULT VALUES
// ==================================================

export const DEFAULTS = {
  DELIVERY_STATUS:
    DELIVERY_STATUS.PENDING,

  DRIVER_AVAILABLE:
    true,

  VEHICLE_AVAILABLE:
    true,

  POLLING_INTERVAL:
    5000,
};


// ==================================================
// VALIDATION
// ==================================================

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,

  MAX_NAME_LENGTH: 100,

  MAX_EMAIL_LENGTH: 120,

  MAX_LOCATION_LENGTH: 255,

  MAX_PACKAGE_DESCRIPTION_LENGTH: 255,

  MAX_PHONE_LENGTH: 20,

  MAX_LICENSE_LENGTH: 100,

  MAX_REGISTRATION_LENGTH: 50,

  MAX_MODEL_LENGTH: 100,
};


// ==================================================
// DRIVER DELIVERY ACTION LABELS
// ==================================================

export const DELIVERY_ACTION_LABELS = {
  [DELIVERY_STATUS.ASSIGNED]:
    "Mark Picked Up",

  [DELIVERY_STATUS.PICKED_UP]:
    "Start Delivery",

  [DELIVERY_STATUS.IN_TRANSIT]:
    "Mark Delivered",
};


// ==================================================
// ACTIVE DELIVERY STATUSES
// ==================================================

export const ACTIVE_DELIVERY_STATUSES = [
  DELIVERY_STATUS.ASSIGNED,
  DELIVERY_STATUS.PICKED_UP,
  DELIVERY_STATUS.IN_TRANSIT,
];


// ==================================================
// TERMINAL DELIVERY STATUSES
// ==================================================

export const TERMINAL_DELIVERY_STATUSES = [
  DELIVERY_STATUS.DELIVERED,
  DELIVERY_STATUS.CANCELLED,
];


// ==================================================
// STATUS COLORS
// ==================================================
//
// These are CSS class names rather than actual colors.
// This keeps styling inside index.css.
//

export const STATUS_CLASSES = {
  [DELIVERY_STATUS.PENDING]:
    "status-pending",

  [DELIVERY_STATUS.ASSIGNED]:
    "status-assigned",

  [DELIVERY_STATUS.PICKED_UP]:
    "status-picked-up",

  [DELIVERY_STATUS.IN_TRANSIT]:
    "status-in-transit",

  [DELIVERY_STATUS.DELIVERED]:
    "status-delivered",

  [DELIVERY_STATUS.CANCELLED]:
    "status-cancelled",
};