// ==================================================
// TRIP SERVICE
// ==================================================
//
// Handles:
// - Creating deliveries
// - Getting deliveries
// - Getting a single delivery
// - Customer deliveries
// - Accepting deliveries
// - Updating delivery status
// - Delivery status helpers
//
// ==================================================

import {
  getTrips,
  getTrip,
  createTrip,
  getCustomerDeliveries,
  getDriverDeliveries,
  assignDriver,
  updateTripStatus,
} from "./api";


// ==================================================
// GET ALL TRIPS
// ==================================================

export const getAllTrips = async () => {

  const response =
    await getTrips();


  return Array.isArray(response)
    ? response
    : response.trips || [];
};


// ==================================================
// GET ONE TRIP
// ==================================================

export const getTripById = async (
  tripId
) => {

  const response =
    await getTrip(
      tripId
    );


  return response.trip ||
    response;
};


// ==================================================
// CREATE TRIP
// ==================================================
//
// customer_id is intentionally NOT included.
// The backend gets the customer ID from the JWT.
//
// ==================================================

export const createDelivery = async ({
  pickupLocation,
  deliveryLocation,
  packageDescription,
}) => {

  return createTrip({

    pickup_location:
      pickupLocation.trim(),

    delivery_location:
      deliveryLocation.trim(),

    package_description:
      packageDescription.trim(),

  });
};


// ==================================================
// GET CUSTOMER DELIVERIES
// ==================================================

export const getMyDeliveries =
  async (
    customerId
  ) => {

    const response =
      await getCustomerDeliveries(
        customerId
      );


    return Array.isArray(response)
      ? response
      : response.deliveries || [];
  };


// ==================================================
// GET DRIVER DELIVERIES
// ==================================================

export const getMyDriverDeliveries =
  async (
    driverId
  ) => {

    const response =
      await getDriverDeliveries(
        driverId
      );


    return Array.isArray(response)
      ? response
      : response.deliveries || [];
  };


// ==================================================
// ACCEPT DELIVERY
// ==================================================
//
// driverId is intentionally NOT sent.
// The backend gets the driver identity
// from the authenticated JWT.
//
// ==================================================

export const acceptTrip = async (
  tripId
) => {

  const response =
    await assignDriver(
      tripId
    );


  return response.trip ||
    response;
};


// ==================================================
// UPDATE DELIVERY STATUS
// ==================================================

export const updateDeliveryStatus =
  async (
    tripId,
    status
  ) => {

    const response =
      await updateTripStatus(
        tripId,
        status
      );


    return response.trip ||
      response;
  };


// ==================================================
// STATUS FLOW
// ==================================================

const statusFlow = {

  pending: [
    "assigned",
  ],

  assigned: [
    "picked_up",
    "cancelled",
  ],

  picked_up: [
    "in_transit",
    "cancelled",
  ],

  in_transit: [
    "delivered",
    "cancelled",
  ],

  delivered: [],

  cancelled: [],

};


// ==================================================
// GET NEXT POSSIBLE STATUSES
// ==================================================

export const getNextStatuses = (
  currentStatus
) => {

  return (
    statusFlow[currentStatus] ||
    []
  );
};


// ==================================================
// CHECK VALID STATUS TRANSITION
// ==================================================

export const canChangeStatus = (
  currentStatus,
  newStatus
) => {

  return getNextStatuses(
    currentStatus
  ).includes(
    newStatus
  );
};


// ==================================================
// GET NEXT DRIVER STATUS
// ==================================================

export const getNextDriverStatus = (
  currentStatus
) => {

  const nextStatus = {

    assigned:
      "picked_up",

    picked_up:
      "in_transit",

    in_transit:
      "delivered",

  };


  return (
    nextStatus[currentStatus] ||
    null
  );
};


// ==================================================
// GET STATUS LABEL
// ==================================================

export const getStatusLabel = (
  status
) => {

  const labels = {

    pending:
      "Pending",

    assigned:
      "Driver Assigned",

    picked_up:
      "Picked Up",

    in_transit:
      "In Transit",

    delivered:
      "Delivered",

    cancelled:
      "Cancelled",

  };


  return (
    labels[status] ||
    "Unknown"
  );
};


// ==================================================
// GET STATUS DESCRIPTION
// ==================================================

export const getStatusDescription = (
  status
) => {

  const descriptions = {

    pending:
      "Your delivery request has been received.",

    assigned:
      "A driver has accepted your delivery.",

    picked_up:
      "Your package has been picked up.",

    in_transit:
      "Your package is on its way.",

    delivered:
      "Your package has been delivered.",

    cancelled:
      "This delivery has been cancelled.",

  };


  return (
    descriptions[status] ||
    ""
  );
};


// ==================================================
// CHECK ACTIVE DELIVERY
// ==================================================

export const isActiveDelivery = (
  status
) => {

  return [
    "assigned",
    "picked_up",
    "in_transit",
  ].includes(
    status
  );
};


// ==================================================
// CHECK COMPLETED DELIVERY
// ==================================================

export const isCompletedDelivery = (
  status
) => {

  return status ===
    "delivered";
};


// ==================================================
// CHECK CANCELLED DELIVERY
// ==================================================

export const isCancelledDelivery = (
  status
) => {

  return status ===
    "cancelled";
};


// ==================================================
// FILTER CUSTOMER DELIVERIES
// ==================================================

export const filterCustomerDeliveries = (
  deliveries,
  status
) => {

  if (!Array.isArray(
    deliveries
  )) {

    return [];
  }


  if (!status ||
      status === "all") {

    return deliveries;
  }


  return deliveries.filter(
    (delivery) =>
      delivery.status ===
      status
  );
};


// ==================================================
// FILTER ACTIVE DELIVERIES
// ==================================================

export const getActiveDeliveries = (
  deliveries
) => {

  if (!Array.isArray(
    deliveries
  )) {

    return [];
  }


  return deliveries.filter(
    (delivery) =>
      isActiveDelivery(
        delivery.status
      )
  );
};


// ==================================================
// FILTER COMPLETED DELIVERIES
// ==================================================

export const getCompletedDeliveries = (
  deliveries
) => {

  if (!Array.isArray(
    deliveries
  )) {

    return [];
  }


  return deliveries.filter(
    (delivery) =>
      isCompletedDelivery(
        delivery.status
      )
  );
};


// ==================================================
// FILTER PENDING DELIVERIES
// ==================================================

export const getPendingDeliveries = (
  deliveries
) => {

  if (!Array.isArray(
    deliveries
  )) {

    return [];
  }


  return deliveries.filter(
    (delivery) =>
      delivery.status ===
      "pending"
  );
};


// ==================================================
// SORT BY NEWEST
// ==================================================

export const sortTripsByNewest = (
  deliveries
) => {

  if (!Array.isArray(
    deliveries
  )) {

    return [];
  }


  return [
    ...deliveries,
  ].sort(
    (a, b) => {

      const dateA =
        new Date(
          a.created_at
        );

      const dateB =
        new Date(
          b.created_at
        );


      return (
        dateB - dateA
      );

    }
  );
};


// ==================================================
// FORMAT TRIP DATE
// ==================================================

export const formatTripDate = (
  date
) => {

  if (!date) {

    return "Not available";
  }


  return new Date(
    date
  ).toLocaleString(
    "en-KE",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );
};


// ==================================================
// GET TRIP SUMMARY
// ==================================================

export const getTripSummary = (
  deliveries
) => {

  if (!Array.isArray(
    deliveries
  )) {

    return {

      total: 0,

      pending: 0,

      assigned: 0,

      active: 0,

      delivered: 0,

      cancelled: 0,

    };
  }


  return {

    total:
      deliveries.length,

    pending:
      deliveries.filter(
        (trip) =>
          trip.status ===
          "pending"
      ).length,

    assigned:
      deliveries.filter(
        (trip) =>
          trip.status ===
          "assigned"
      ).length,

    active:
      deliveries.filter(
        (trip) =>
          isActiveDelivery(
            trip.status
          )
      ).length,

    delivered:
      deliveries.filter(
        (trip) =>
          trip.status ===
          "delivered"
      ).length,

    cancelled:
      deliveries.filter(
        (trip) =>
          trip.status ===
          "cancelled"
      ).length,

  };
};