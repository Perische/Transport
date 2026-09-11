// ==================================================
// VEHICLE SERVICE
// ==================================================
//
// Handles:
// - Getting driver vehicles
// - Adding vehicles
// - Updating vehicles
// - Deleting vehicles
// - Vehicle availability
// - Vehicle filtering/helpers
//
// ==================================================

import {
  getDriverVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "./api";


// ==================================================
// GET DRIVER VEHICLES
// ==================================================

export const getMyVehicles = async (
  driverId
) => {

  const response =
    await getDriverVehicles(
      driverId
    );


  return Array.isArray(response)
    ? response
    : response.vehicles || [];
};


// ==================================================
// ADD VEHICLE
// ==================================================

export const addVehicle = async ({
  vehicleType,
  registrationNumber,
  model,
  capacity,
}) => {

  return createVehicle({

    vehicle_type:
      vehicleType.trim(),

    registration_number:
      registrationNumber
        .trim()
        .toUpperCase(),

    model:
      model
        ? model.trim()
        : null,

    capacity:
      capacity !== "" &&
      capacity !== null &&
      capacity !== undefined
        ? Number(capacity)
        : null,

  });
};


// ==================================================
// UPDATE VEHICLE
// ==================================================

export const editVehicle = async (
  vehicleId,
  vehicleData
) => {

  return updateVehicle(
    vehicleId,
    vehicleData
  );
};


// ==================================================
// UPDATE VEHICLE DETAILS
// ==================================================

export const updateVehicleDetails =
  async (
    vehicleId,
    {
      vehicleType,
      registrationNumber,
      model,
      capacity,
    }
  ) => {

    return updateVehicle(
      vehicleId,
      {

        vehicle_type:
          vehicleType.trim(),

        registration_number:
          registrationNumber
            .trim()
            .toUpperCase(),

        model:
          model
            ? model.trim()
            : null,

        capacity:
          capacity !== "" &&
          capacity !== null &&
          capacity !== undefined
            ? Number(capacity)
            : null,

      }
    );
  };


// ==================================================
// SET VEHICLE AVAILABILITY
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
// TOGGLE VEHICLE AVAILABILITY
// ==================================================

export const toggleVehicleAvailability =
  async (
    vehicle
  ) => {

    if (!vehicle?.id) {

      throw new Error(
        "Vehicle information is required."
      );
    }


    return setVehicleAvailability(
      vehicle.id,
      !vehicle.is_available
    );
  };


// ==================================================
// DELETE VEHICLE
// ==================================================

export const removeVehicle = async (
  vehicleId
) => {

  return deleteVehicle(
    vehicleId
  );
};


// ==================================================
// GET AVAILABLE VEHICLES
// ==================================================

export const getAvailableVehicles = (
  vehicles
) => {

  if (!Array.isArray(
    vehicles
  )) {

    return [];
  }


  return vehicles.filter(
    (vehicle) =>
      vehicle.is_available === true
  );
};


// ==================================================
// GET UNAVAILABLE VEHICLES
// ==================================================

export const getUnavailableVehicles = (
  vehicles
) => {

  if (!Array.isArray(
    vehicles
  )) {

    return [];
  }


  return vehicles.filter(
    (vehicle) =>
      vehicle.is_available === false
  );
};


// ==================================================
// CHECK AVAILABLE VEHICLE
// ==================================================

export const hasAvailableVehicle = (
  vehicles
) => {

  return getAvailableVehicles(
    vehicles
  ).length > 0;
};


// ==================================================
// COUNT AVAILABLE VEHICLES
// ==================================================

export const countAvailableVehicles = (
  vehicles
) => {

  return getAvailableVehicles(
    vehicles
  ).length;
};


// ==================================================
// COUNT TOTAL VEHICLES
// ==================================================

export const countVehicles = (
  vehicles
) => {

  if (!Array.isArray(
    vehicles
  )) {

    return 0;
  }


  return vehicles.length;
};


// ==================================================
// FIND VEHICLE
// ==================================================

export const findVehicleById = (
  vehicles,
  vehicleId
) => {

  if (!Array.isArray(
    vehicles
  )) {

    return null;
  }


  return vehicles.find(
    (vehicle) =>
      vehicle.id === vehicleId
  ) || null;
};


// ==================================================
// FIND BY REGISTRATION NUMBER
// ==================================================

export const findVehicleByRegistration =
  (
    vehicles,
    registrationNumber
  ) => {

    if (!Array.isArray(
      vehicles
    )) {

      return null;
    }


    const registration =
      registrationNumber
        ?.trim()
        .toUpperCase();


    return vehicles.find(
      (vehicle) =>
        vehicle.registration_number
          ?.toUpperCase() ===
        registration
    ) || null;
  };


// ==================================================
// VEHICLE TYPE LABEL
// ==================================================

export const getVehicleTypeLabel = (
  vehicleType
) => {

  const labels = {

    motorcycle:
      "Motorcycle",

    car:
      "Car",

    van:
      "Van",

    pickup:
      "Pickup",

    truck:
      "Truck",

    lorry:
      "Lorry",

  };


  return (
    labels[vehicleType] ||
    vehicleType ||
    "Vehicle"
  );
};


// ==================================================
// VEHICLE DISPLAY NAME
// ==================================================

export const getVehicleDisplayName = (
  vehicle
) => {

  if (!vehicle) {

    return "Vehicle";
  }


  const type =
    getVehicleTypeLabel(
      vehicle.vehicle_type
    );


  if (vehicle.model) {

    return `${type} - ${vehicle.model}`;
  }


  return type;
};


// ==================================================
// VEHICLE STATUS LABEL
// ==================================================

export const getVehicleStatusLabel = (
  vehicle
) => {

  if (!vehicle) {

    return "Unknown";
  }


  return vehicle.is_available
    ? "Available"
    : "Unavailable";
};


// ==================================================
// FORMAT CAPACITY
// ==================================================

export const formatVehicleCapacity = (
  capacity
) => {

  if (
    capacity === null ||
    capacity === undefined ||
    capacity === ""
  ) {

    return "Not specified";
  }


  return `${capacity} kg`;
};


// ==================================================
// VALIDATE VEHICLE DATA
// ==================================================

export const validateVehicleData = ({
  vehicleType,
  registrationNumber,
  model,
  capacity,
}) => {

  const errors = {};


  if (!vehicleType?.trim()) {

    errors.vehicleType =
      "Vehicle type is required.";
  }


  if (!registrationNumber?.trim()) {

    errors.registrationNumber =
      "Registration number is required.";
  }


  if (
    capacity !== "" &&
    capacity !== null &&
    capacity !== undefined
  ) {

    const numericCapacity =
      Number(capacity);


    if (
      Number.isNaN(
        numericCapacity
      )
    ) {

      errors.capacity =
        "Capacity must be a valid number.";

    } else if (
      numericCapacity <= 0
    ) {

      errors.capacity =
        "Capacity must be greater than zero.";
    }
  }


  return errors;
};


// ==================================================
// CHECK IF VEHICLE CAN BE DELETED
// ==================================================
//
// Backend requires the vehicle to be
// unavailable before deletion.
//
// ==================================================

export const canDeleteVehicle = (
  vehicle
) => {

  if (!vehicle) {

    return false;
  }


  return vehicle.is_available ===
    false;
};