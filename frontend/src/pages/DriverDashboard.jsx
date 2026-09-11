import { useEffect, useState } from "react";

import VehicleCard from "../components/VehicleCard";

import {
  getDriverByUser,
  getDriverVehicles,
  getTrips,
  updateDriverAvailability,
  assignDriver,
  updateTripStatus,
} from "../services/api";


function DriverDashboard({
  navigate,
  user,
  logout,
}) {

  const [driver, setDriver] = useState(null);

  const [vehicles, setVehicles] = useState([]);

  const [trips, setTrips] = useState([]);

  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");


  // ==================================================
  // LOAD DRIVER DATA
  // ==================================================

  const loadDriverData = async () => {

    if (!user) {

      navigate("login");

      return;
    }


    try {

      setLoading(true);

      setError("");


      // ----------------------------------------------
      // DRIVER PROFILE
      // ----------------------------------------------

      const driverData =
        await getDriverByUser(user.id);


      const driverProfile =
        driverData.driver ||
        driverData;


      if (!driverProfile?.id) {

        setError(
          "Driver profile not found. Please complete your driver setup."
        );

        return;
      }


      setDriver(driverProfile);


      // ----------------------------------------------
      // VEHICLES
      // ----------------------------------------------

      const vehicleData =
        await getDriverVehicles(
          driverProfile.id
        );


      const driverVehicles =
        Array.isArray(vehicleData)
          ? vehicleData
          : vehicleData.vehicles || [];


      setVehicles(driverVehicles);


      // ----------------------------------------------
      // TRIPS
      // ----------------------------------------------

      const tripData =
        await getTrips();


      const allTrips =
        Array.isArray(tripData)
          ? tripData
          : tripData.trips || [];


      setTrips(allTrips);


    } catch (error) {

      setError(
        error.message ||
        "Unable to load your driver dashboard."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    loadDriverData();

  }, [user]);


  // ==================================================
  // AVAILABLE VEHICLES
  // ==================================================

  const availableVehicles =
    vehicles.filter(
      (vehicle) =>
        vehicle.is_available
    );


  const hasAvailableVehicle =
    availableVehicles.length > 0;


  // ==================================================
  // DRIVER TRIPS
  // ==================================================

  const pendingTrips =
    trips.filter(
      (trip) =>
        trip.status === "pending"
    );


  const activeTrips =
    trips.filter(
      (trip) =>
        trip.driver_id === driver?.id &&
        [
          "assigned",
          "picked_up",
          "in_transit",
        ].includes(trip.status)
    );


  const completedTrips =
    trips.filter(
      (trip) =>
        trip.driver_id === driver?.id &&
        trip.status === "delivered"
    );


  // ==================================================
  // DRIVER AVAILABILITY
  // ==================================================

  const handleToggleAvailability = async () => {

    if (!driver) {
      return;
    }


    // Driver cannot go online without
    // an available vehicle.

    if (
      !driver.is_available &&
      !hasAvailableVehicle
    ) {

      setError(
        "You need at least one available vehicle before going online."
      );

      navigate("vehicles");

      return;
    }


    setActionLoading(true);

    setError("");

    setSuccess("");


    try {

      const newAvailability =
        !driver.is_available;


      const data =
        await updateDriverAvailability(
          driver.id,
          newAvailability
        );


      const updatedDriver =
        data.driver ||
        data;


      setDriver(
        updatedDriver
      );


      setSuccess(
        newAvailability
          ? "You are now available for deliveries."
          : "You are now offline."
      );


    } catch (error) {

      setError(
        error.message ||
        "Unable to update your availability."
      );

    } finally {

      setActionLoading(false);

    }
  };


  // ==================================================
  // ACCEPT DELIVERY
  // ==================================================

  const handleAcceptDelivery = async (
    tripId
  ) => {

    if (!driver) {
      return;
    }


    if (!driver.is_available) {

      setError(
        "You must be available before accepting a delivery."
      );

      return;
    }


    if (!hasAvailableVehicle) {

      setError(
        "You need an available vehicle before accepting a delivery."
      );

      navigate("vehicles");

      return;
    }


    setActionLoading(true);

    setError("");

    setSuccess("");


    try {

      await assignDriver(
        tripId,
        driver.id
      );


      setSuccess(
        "Delivery accepted successfully."
      );


      await loadDriverData();


    } catch (error) {

      setError(
        error.message ||
        "Unable to accept this delivery."
      );

    } finally {

      setActionLoading(false);

    }
  };


  // ==================================================
  // UPDATE DELIVERY STATUS
  // ==================================================

  const handleStatusUpdate = async (
    tripId,
    status
  ) => {

    setActionLoading(true);

    setError("");

    setSuccess("");


    try {

      await updateTripStatus(
        tripId,
        status
      );


      setSuccess(
        "Delivery status updated successfully."
      );


      await loadDriverData();


    } catch (error) {

      setError(
        error.message ||
        "Unable to update delivery status."
      );

    } finally {

      setActionLoading(false);

    }
  };


  // ==================================================
  // NEXT STATUS
  // ==================================================

  const getNextStatus = (status) => {

    switch (status) {

      case "assigned":
        return "picked_up";

      case "picked_up":
        return "in_transit";

      case "in_transit":
        return "delivered";

      default:
        return null;
    }
  };


  const getNextStatusLabel = (status) => {

    switch (status) {

      case "assigned":
        return "Mark Picked Up";

      case "picked_up":
        return "Start Delivery";

      case "in_transit":
        return "Mark Delivered";

      default:
        return "";
    }
  };


  // ==================================================
  // STATUS LABEL
  // ==================================================

  const getStatusLabel = (status) => {

    switch (status) {

      case "assigned":
        return "Driver Assigned";

      case "picked_up":
        return "Picked Up";

      case "in_transit":
        return "In Transit";

      case "delivered":
        return "Delivered";

      case "cancelled":
        return "Cancelled";

      default:
        return "Pending";
    }
  };


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {

    return (
      <div className="page-container">

        <div className="loading-container">

          <div className="loading-spinner"></div>

          <p>
            Loading driver dashboard...
          </p>

        </div>

      </div>
    );
  }


  // ==================================================
  // PAGE
  // ==================================================

  return (
    <div className="page-container">

      <div className="driver-dashboard-container">

        {/* =========================================
            HEADER
        ========================================== */}

        <div className="driver-dashboard-header">

          <div>

            <span className="section-label">
              DRIVER PORTAL
            </span>

            <h1>
              Welcome, {user?.name}
            </h1>

            <p>
              Manage your deliveries and keep
              your vehicle fleet ready.
            </p>

          </div>


          <div className="driver-header-actions">

            <button
              className="secondary-button"
              onClick={() =>
                navigate("vehicles")
              }
            >
              Manage Vehicles
            </button>


            <button
              className={
                driver?.is_available
                  ? "availability-button online"
                  : "availability-button offline"
              }
              onClick={
                handleToggleAvailability
              }
              disabled={actionLoading}
            >

              <span className="availability-dot"></span>

              {driver?.is_available
                ? "Online"
                : "Go Online"}

            </button>

          </div>

        </div>


        {/* =========================================
            MESSAGES
        ========================================== */}

        {error && (

          <div className="error-message">
            {error}
          </div>

        )}


        {success && (

          <div className="success-message">
            {success}
          </div>

        )}


        {/* =========================================
            VEHICLE WARNING
        ========================================== */}

        {!hasAvailableVehicle && (

          <div className="driver-vehicle-warning">

            <div className="driver-vehicle-warning-icon">
              !
            </div>


            <div>

              <strong>
                No available vehicle
              </strong>

              <p>
                Add a vehicle or mark an existing
                vehicle as available before you
                can accept deliveries.
              </p>

            </div>


            <button
              className="secondary-button"
              onClick={() =>
                navigate("vehicles")
              }
            >
              Manage Vehicles
            </button>

          </div>

        )}


        {/* =========================================
            SUMMARY
        ========================================== */}

        <div className="driver-stats-grid">

          <div className="driver-stat-card">

            <span>
              AVAILABLE DELIVERIES
            </span>

            <strong>
              {pendingTrips.length}
            </strong>

          </div>


          <div className="driver-stat-card">

            <span>
              ACTIVE DELIVERIES
            </span>

            <strong>
              {activeTrips.length}
            </strong>

          </div>


          <div className="driver-stat-card">

            <span>
              COMPLETED
            </span>

            <strong>
              {completedTrips.length}
            </strong>

          </div>


          <div className="driver-stat-card">

            <span>
              AVAILABLE VEHICLES
            </span>

            <strong>
              {availableVehicles.length}
            </strong>

          </div>

        </div>


        {/* =========================================
            VEHICLE FLEET
        ========================================== */}

        <div className="driver-vehicle-summary">

          <div className="driver-section-header">

            <div>

              <span className="section-label">
                YOUR FLEET
              </span>

              <h2>
                Vehicles
              </h2>

            </div>


            <button
              className="view-all-button"
              onClick={() =>
                navigate("vehicles")
              }
            >
              Manage Fleet →
            </button>

          </div>


          {vehicles.length === 0 ? (

            <div className="empty-driver-vehicles">

              <div>
                🚚
              </div>

              <h3>
                No vehicles added
              </h3>

              <p>
                Add a vehicle to start accepting
                deliveries.
              </p>

              <button
                className="primary-button"
                onClick={() =>
                  navigate("vehicles")
                }
              >
                Add Vehicle
              </button>

            </div>

          ) : (

            <div className="driver-vehicle-list">

              {vehicles.slice(0, 2).map(
                (vehicle) => (

                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onDelete={() =>
                      navigate("vehicles")
                    }
                    onToggleAvailability={() =>
                      navigate("vehicles")
                    }
                    actionLoading={
                      actionLoading
                    }
                  />

                )
              )}

            </div>

          )}

        </div>


        {/* =========================================
            ACTIVE DELIVERIES
        ========================================== */}

        {activeTrips.length > 0 && (

          <div className="driver-delivery-section">

            <div className="driver-section-header">

              <div>

                <span className="section-label">
                  CURRENT WORK
                </span>

                <h2>
                  Active Deliveries
                </h2>

              </div>

            </div>


            <div className="driver-delivery-list">

              {activeTrips.map(
                (trip) => {

                  const nextStatus =
                    getNextStatus(
                      trip.status
                    );


                  return (
                    <div
                      className="driver-delivery-card"
                      key={trip.id}
                    >

                      <div className="driver-delivery-card-header">

                        <div>

                          <span className="delivery-id">
                            DELIVERY #{trip.id}
                          </span>

                          <h3>
                            {trip.package_description}
                          </h3>

                        </div>


                        <span className="delivery-status">
                          {getStatusLabel(
                            trip.status
                          )}
                        </span>

                      </div>


                      <div className="driver-delivery-route">

                        <div>

                          <span>
                            PICKUP
                          </span>

                          <strong>
                            {trip.pickup_location}
                          </strong>

                        </div>


                        <div className="driver-route-arrow">
                          →
                        </div>


                        <div>

                          <span>
                            DELIVERY
                          </span>

                          <strong>
                            {trip.delivery_location}
                          </strong>

                        </div>

                      </div>


                      <div className="driver-delivery-actions">

                        {nextStatus && (

                          <button
                            className="primary-button"
                            onClick={() =>
                              handleStatusUpdate(
                                trip.id,
                                nextStatus
                              )
                            }
                            disabled={
                              actionLoading
                            }
                          >
                            {getNextStatusLabel(
                              trip.status
                            )}
                          </button>

                        )}

                      </div>

                    </div>
                  );

                }
              )}

            </div>

          </div>

        )}


        {/* =========================================
            AVAILABLE DELIVERIES
        ========================================== */}

        <div className="driver-delivery-section">

          <div className="driver-section-header">

            <div>

              <span className="section-label">
                DELIVERY REQUESTS
              </span>

              <h2>
                Available Deliveries
              </h2>

            </div>


            <span className="trip-section-count">
              {pendingTrips.length}
            </span>

          </div>


          {pendingTrips.length === 0 ? (

            <div className="empty-driver-deliveries">

              <div className="empty-driver-deliveries-icon">
                📦
              </div>

              <h3>
                No delivery requests
              </h3>

              <p>
                New delivery requests will appear
                here when customers create them.
              </p>

            </div>

          ) : (

            <div className="driver-delivery-list">

              {pendingTrips.map(
                (trip) => (

                  <div
                    className="driver-delivery-card"
                    key={trip.id}
                  >

                    <div className="driver-delivery-card-header">

                      <div>

                        <span className="delivery-id">
                          DELIVERY #{trip.id}
                        </span>

                        <h3>
                          {trip.package_description}
                        </h3>

                      </div>


                      <span className="delivery-status pending">
                        Pending
                      </span>

                    </div>


                    <div className="driver-delivery-route">

                      <div>

                        <span>
                          PICKUP
                        </span>

                        <strong>
                          {trip.pickup_location}
                        </strong>

                      </div>


                      <div className="driver-route-arrow">
                        →
                      </div>


                      <div>

                        <span>
                          DELIVERY
                        </span>

                        <strong>
                          {trip.delivery_location}
                        </strong>

                      </div>

                    </div>


                    <div className="driver-delivery-package">

                      <span>
                        PACKAGE
                      </span>

                      <p>
                        {trip.package_description}
                      </p>

                    </div>


                    <div className="driver-delivery-actions">

                      <button
                        className="primary-button"
                        onClick={() =>
                          handleAcceptDelivery(
                            trip.id
                          )
                        }
                        disabled={
                          actionLoading ||
                          !driver?.is_available ||
                          !hasAvailableVehicle
                        }
                      >

                        {!driver?.is_available
                          ? "Go Online to Accept"
                          : !hasAvailableVehicle
                            ? "Add Available Vehicle"
                            : "Accept Delivery"}

                      </button>


                      {driver?.is_available &&
                        !hasAvailableVehicle && (

                          <button
                            className="secondary-button"
                            onClick={() =>
                              navigate("vehicles")
                            }
                          >
                            Manage Vehicles
                          </button>

                        )}

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>


        {/* =========================================
            ACCOUNT
        ========================================== */}

        <div className="driver-account-actions">

          <button
            className="secondary-button"
            onClick={() =>
              navigate("vehicles")
            }
          >
            Manage Vehicles
          </button>


          <button
            className="danger-button"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </div>

    </div>
  );
}


export default DriverDashboard;