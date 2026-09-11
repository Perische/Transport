// ==================================================
// DRIVER SERVICE
// ==================================================
//
// Handles driver-related operations:
// - Driver profile
// - Driver availability
// - Driver deliveries
// - Driver vehicles
// - Accepting deliveries
// - Updating delivery status
//
// ==================================================

import {
  getDriverByUser,
  createDriver,
  updateDriverAvailability,
  getDriverTrips,
  getAvailableTrips,
  getDriverVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  assignDriver,
  updateTripStatus,
} from "./api";


// ==================================================
// DRIVER PROFILE
// ==================================================

export const getDriverProfile = async (
  userId
) => {

  return getDriverByUser(
    userId
  );
};


export const setupDriver = async (
  driverData
) => {

  return createDriver(
    driverData
  );
};


// ==================================================
// DRIVER AVAILABILITY
// ==================================================

export const setDriverAvailability =
  async (
    driverId,
    isAvailable
  ) => {

    return updateDriverAvailability(
      driverId,
      isAvailable
    );
  };


// ==================================================
// DRIVER TRIPS
// ==================================================

export const getMyDriverTrips =
  async (
    driverId
  ) => {

    return getDriverTrips(
      driverId
    );
  };


export const getAvailableDeliveries =
  async () => {

    return getAvailableTrips();
  };


// ==================================================
// ACCEPT DELIVERY
// ==================================================
//
// The backend identifies the driver
// from the JWT, so driverId is NOT sent.
//
// ==================================================

export const acceptDelivery =
  async (
    tripId
  ) => {

    return assignDriver(
      tripId
    );
  };


// ==================================================
// UPDATE DELIVERY STATUS
// ==================================================

export const changeDeliveryStatus =
  async (
    tripId,
    status
  ) => {

    return updateTripStatus(
      tripId,
      status
    );
  };


// ==================================================
// VEHICLES
// ==================================================

export const getMyVehicles =
  async (
    driverId
  ) => {

    return getDriverVehicles(
      driverId
    );
  };


export const addVehicle =
  async (
    vehicleData
  ) => {

    return createVehicle(
      vehicleData
    );
  };


export const editVehicle =
  async (
    vehicleId,
    vehicleData
  ) => {

    return updateVehicle(
      vehicleId,
      vehicleData
    );
  };


export const removeVehicle =
  async (
    vehicleId
  ) => {

    return deleteVehicle(
      vehicleId
    );
  };


// ==================================================
// VEHICLE AVAILABILITY
// ==================================================

export const setVehicleAvailability =
  async (
    vehicleId,
    isAvailable
  ) => {

    return updateVehicle(
      vehicleId,
      {
        is_available:
          isAvailable,
      }
    );
  };


// ==================================================
// DRIVER STATUS HELPERS
// ==================================================

export const hasAvailableVehicle = (
  vehicles
) => {

  if (!Array.isArray(vehicles)) {

    return false;
  }


  return vehicles.some(
    (vehicle) =>
      vehicle.is_available === true
  );
};


export const getActiveDeliveries = (
  trips,
  driverId
) => {

  if (!Array.isArray(trips)) {

    return [];
  }


  return trips.filter(
    (trip) =>
      trip.driver_id === driverId &&
      [
        "assigned",
        "picked_up",
        "in_transit",
      ].includes(
        trip.status
      )
  );
};


export const getCompletedDeliveries = (
  trips,
  driverId
) => {

  if (!Array.isArray(trips)) {

    return [];
  }


  return trips.filter(
    (trip) =>
      trip.driver_id === driverId &&
      trip.status === "delivered"
  );
};


export const getPendingDeliveries = (
  trips
) => {

  if (!Array.isArray(trips)) {

    return [];
  }


  return trips.filter(
    (trip) =>
      trip.status === "pending"
  );
};


// ==================================================
// DELIVERY STATUS HELPERS
// ==================================================

export const getNextDeliveryStatus = (
  currentStatus
) => {

  const statusFlow = {

    assigned:
      "picked_up",

    picked_up:
      "in_transit",

    in_transit:
      "delivered",

  };


  return (
    statusFlow[currentStatus] ||
    null
  );
};


export const getNextDeliveryStatusLabel = (
  currentStatus
) => {

  const labels = {

    assigned:
      "Mark Picked Up",

    picked_up:
      "Start Delivery",

    in_transit:
      "Mark Delivered",

  };


  return (
    labels[currentStatus] ||
    ""
  );
};


// ==================================================
// DRIVER DASHBOARD DATA
// ==================================================

export const getDriverDashboardData =
  async (
    userId
  ) => {

    const driverResponse =
      await getDriverProfile(
        userId
      );


    const driver =
      driverResponse.driver ||
      driverResponse;


    if (!driver?.id) {

      throw new Error(
        "Driver profile not found."
      );
    }


    const [
      vehiclesResponse,
      tripsResponse,
    ] = await Promise.all([

      getMyVehicles(
        driver.id
      ),

      getMyDriverTrips(
        driver.id
      ),

    ]);


    const vehicles =
      Array.isArray(
        vehiclesResponse
      )
        ? vehiclesResponse
        : vehiclesResponse.vehicles ||
          [];


    const trips =
      Array.isArray(
        tripsResponse
      )
        ? tripsResponse
        : tripsResponse.trips ||
          [];


    return {

      driver,

      vehicles,

      trips,

      availableVehicles:
        vehicles.filter(
          (vehicle) =>
            vehicle.is_available
        ),

      activeDeliveries:
        getActiveDeliveries(
          trips,
          driver.id
        ),

      completedDeliveries:
        getCompletedDeliveries(
          trips,
          driver.id
        ),

      pendingDeliveries:
        getPendingDeliveries(
          trips
        ),

    };
  };