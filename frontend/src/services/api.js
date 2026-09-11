const API_BASE_URL =
  "http://127.0.0.1:5000/api";


// ==================================================
// GET AUTH TOKEN
// ==================================================

const getAuthToken = () => {

  return localStorage.getItem(
    "moveitToken"
  );
};


// ==================================================
// GENERIC API REQUEST
// ==================================================

const apiRequest = async (
  endpoint,
  options = {}
) => {

  const token =
    getAuthToken();


  const headers = {
    "Content-Type":
      "application/json",
    ...(options.headers || {}),
  };


  if (token) {

    headers.Authorization =
      `Bearer ${token}`;

  }


  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );


  let data = {};


  try {

    data = await response.json();

  } catch (error) {

    data = {};

  }


  if (!response.ok) {

    throw new Error(
      data.error ||
      data.message ||
      "Something went wrong."
    );

  }


  return data;
};


// ==================================================
// AUTH
// ==================================================

export const registerUser = async (
  userData
) => {

  return apiRequest(
    "/auth/register",
    {
      method: "POST",

      body:
        JSON.stringify(
          userData
        ),
    }
  );
};


export const loginUser = async (
  credentials
) => {

  return apiRequest(
    "/auth/login",
    {
      method: "POST",

      body:
        JSON.stringify(
          credentials
        ),
    }
  );
};


// ==================================================
// USERS
// ==================================================

export const getUsers = async () => {

  return apiRequest(
    "/users/"
  );
};


export const getUser = async (
  userId
) => {

  return apiRequest(
    `/users/${userId}`
  );
};


export const updateUser = async (
  userId,
  userData
) => {

  return apiRequest(
    `/users/${userId}`,
    {
      method: "PATCH",

      body:
        JSON.stringify(
          userData
        ),
    }
  );
};


// ==================================================
// DRIVERS
// ==================================================

export const getDriverByUser = async (
  userId
) => {

  return apiRequest(
    `/drivers/user/${userId}`
  );
};


export const createDriver = async (
  driverData
) => {

  return apiRequest(
    "/drivers/",
    {
      method: "POST",

      body:
        JSON.stringify(
          driverData
        ),
    }
  );
};


export const updateDriverAvailability =
  async (
    driverId,
    isAvailable
  ) => {

    return apiRequest(
      `/drivers/${driverId}/availability`,
      {
        method: "PATCH",

        body:
          JSON.stringify({
            is_available:
              isAvailable,
          }),
      }
    );
  };


export const getDriverTrips = async (
  driverId
) => {

  return apiRequest(
    `/drivers/${driverId}/trips`
  );
};


// ==================================================
// VEHICLES
// ==================================================

export const getDriverVehicles =
  async (
    driverId
  ) => {

    return apiRequest(
      `/vehicles/driver/${driverId}`
    );
  };


export const createVehicle =
  async (
    vehicleData
  ) => {

    return apiRequest(
      "/vehicles/",
      {
        method: "POST",

        body:
          JSON.stringify(
            vehicleData
          ),
      }
    );
  };


export const updateVehicle =
  async (
    vehicleId,
    vehicleData
  ) => {

    return apiRequest(
      `/vehicles/${vehicleId}`,
      {
        method: "PATCH",

        body:
          JSON.stringify(
            vehicleData
          ),
      }
    );
  };


export const deleteVehicle =
  async (
    vehicleId
  ) => {

    return apiRequest(
      `/vehicles/${vehicleId}`,
      {
        method: "DELETE",
      }
    );
  };


// ==================================================
// TRIPS / DELIVERIES
// ==================================================

export const getTrips = async () => {

  return apiRequest(
    "/trips/"
  );
};


export const getTrip = async (
  tripId
) => {

  return apiRequest(
    `/trips/${tripId}`
  );
};


export const createTrip =
  async (
    tripData
  ) => {

    return apiRequest(
      "/trips/",
      {
        method: "POST",

        body:
          JSON.stringify(
            tripData
          ),
      }
    );
  };


export const assignDriver =
  async (
    tripId,
    driverId
  ) => {

    return apiRequest(
      `/trips/${tripId}/assign`,
      {
        method: "PATCH",

        body:
          JSON.stringify({
            driver_id:
              driverId,
          }),
      }
    );
  };


export const updateTripStatus =
  async (
    tripId,
    status
  ) => {

    return apiRequest(
      `/trips/${tripId}/status`,
      {
        method: "PATCH",

        body:
          JSON.stringify({
            status,
          }),
      }
    );
  };


// ==================================================
// CUSTOMER DELIVERIES
// ==================================================

export const getCustomerDeliveries =
  async (
    customerId
  ) => {

    return apiRequest(
      `/deliveries/customer/${customerId}`
    );
  };


// ==================================================
// DRIVER DELIVERIES
// ==================================================

export const getDriverDeliveries =
  async (
    driverId
  ) => {

    return apiRequest(
      `/deliveries/driver/${driverId}`
    );
  };


// ==================================================
// HEALTH CHECK
// ==================================================

export const checkApiHealth =
  async () => {

    return apiRequest(
      "/health"
    );
  };