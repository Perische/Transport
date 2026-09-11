import { useEffect, useState } from "react";

import { getTrip } from "../services/api";


function TripDetails({
  navigate,
  user,
  tripId,
}) {

  const [trip, setTrip] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [lastUpdated, setLastUpdated] =
    useState(null);


  // ==================================================
  // FETCH TRIP
  // ==================================================

  const fetchTrip = async (
    showLoading = false
  ) => {

    if (!tripId) {

      setError(
        "No delivery was selected."
      );

      setLoading(false);

      return;
    }


    if (showLoading) {
      setLoading(true);
    }


    try {

      const data =
        await getTrip(tripId);


      const tripData =
        data.trip || data;


      setTrip(tripData);

      setLastUpdated(
        new Date()
      );

      setError("");


    } catch (error) {

      setError(
        error.message ||
        "Unable to load delivery."
      );


    } finally {

      if (showLoading) {
        setLoading(false);
      }

    }
  };


  // ==================================================
  // INITIAL LOAD + LIVE REFRESH
  // ==================================================

  useEffect(() => {

    fetchTrip(true);


    const interval =
      setInterval(() => {

        fetchTrip(false);

      }, 5000);


    return () => {

      clearInterval(interval);

    };

  }, [tripId]);


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {

    return (
      <div className="page-container">

        <div className="loading-container">

          <div className="loading-spinner"></div>

          <p>
            Loading delivery...
          </p>

        </div>

      </div>
    );
  }


  // ==================================================
  // ERROR
  // ==================================================

  if (error && !trip) {

    return (
      <div className="page-container">

        <div className="error-container">

          <div className="error-message">
            {error}
          </div>


          <button
            className="primary-button"
            onClick={() =>
              navigate("my-trips")
            }
          >
            Back to My Deliveries
          </button>

        </div>

      </div>
    );
  }


  if (!trip) {
    return null;
  }


  // ==================================================
  // DELIVERY STATUS
  // ==================================================

  const statuses = [
    {
      key: "pending",
      label: "Pending",
      description:
        "Your delivery request has been received.",
    },
    {
      key: "assigned",
      label: "Driver Assigned",
      description:
        "A driver has accepted your delivery.",
    },
    {
      key: "picked_up",
      label: "Picked Up",
      description:
        "Your package has been picked up.",
    },
    {
      key: "in_transit",
      label: "In Transit",
      description:
        "Your package is on its way.",
    },
    {
      key: "delivered",
      label: "Delivered",
      description:
        "Your package has been delivered.",
    },
  ];


  const statusIndex =
    statuses.findIndex(
      (item) =>
        item.key === trip.status
    );


  const isCancelled =
    trip.status === "cancelled";


  // ==================================================
  // STATUS LABEL
  // ==================================================

  const getStatusLabel = () => {

    switch (trip.status) {

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
  // STATUS CLASS
  // ==================================================

  const getStatusClass = () => {

    switch (trip.status) {

      case "delivered":
        return "status-delivered";

      case "cancelled":
        return "status-cancelled";

      case "in_transit":
      case "picked_up":
        return "status-progress";

      case "assigned":
        return "status-assigned";

      default:
        return "status-pending";
    }
  };


  // ==================================================
  // FORMAT DATE
  // ==================================================

  const formatDate = (date) => {

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
  // PAGE
  // ==================================================

  return (
    <div className="page-container">

      <div className="trip-details-container">

        {/* =========================================
            BACK
        ========================================== */}

        <button
          className="back-button"
          onClick={() =>
            navigate("my-trips")
          }
        >
          ← Back to My Deliveries
        </button>


        {/* =========================================
            HEADER
        ========================================== */}

        <div className="trip-details-header">

          <div>

            <span className="section-label">
              DELIVERY #{trip.id}
            </span>

            <h1>
              Delivery Details
            </h1>

            <p>
              Track your package from pickup
              to delivery.
            </p>

          </div>


          <div
            className={
              `trip-status-badge ${getStatusClass()}`
            }
          >
            {getStatusLabel()}
          </div>

        </div>


        {/* =========================================
            LIVE TRACKING
        ========================================== */}

        <div className="live-tracking-card">

          <div className="live-tracking-header">

            <div>

              <span className="section-label">
                LIVE TRACKING
              </span>

              <h2>
                Delivery Progress
              </h2>

            </div>


            <div className="live-indicator">

              <span className="live-dot"></span>

              Live

            </div>

          </div>


          {isCancelled ? (

            <div className="cancelled-delivery">

              <div className="cancelled-icon">
                ×
              </div>


              <div>

                <h3>
                  Delivery Cancelled
                </h3>

                <p>
                  This delivery has been
                  cancelled.
                </p>

              </div>

            </div>

          ) : (

            <div className="status-timeline">

              {statuses.map(
                (status, index) => {

                  const isCompleted =
                    statusIndex >= index;

                  const isCurrent =
                    trip.status ===
                    status.key;


                  return (
                    <div
                      className={
                        `status-step ${
                          isCompleted
                            ? "completed"
                            : ""
                        } ${
                          isCurrent
                            ? "current"
                            : ""
                        }`
                      }
                      key={status.key}
                    >

                      <div className="status-step-indicator">

                        {isCompleted
                          ? "✓"
                          : index + 1}

                      </div>


                      <div className="status-step-content">

                        <strong>
                          {status.label}
                        </strong>

                        <span>
                          {status.description}
                        </span>

                      </div>

                    </div>
                  );

                }
              )}

            </div>

          )}


          {/* =======================================
              LAST UPDATED
          ======================================== */}

          {lastUpdated && (

            <div className="last-updated">

              <span>
                ●
              </span>

              Last updated{" "}

              {lastUpdated.toLocaleTimeString(
                "en-KE",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                }
              )}


              <span className="refresh-note">
                Updates automatically
              </span>

            </div>

          )}

        </div>


        {/* =========================================
            ROUTE
        ========================================== */}

        <div className="trip-route-card">

          <div className="trip-route-header">

            <span className="section-label">
              DELIVERY ROUTE
            </span>

            <h2>
              Pickup & Delivery
            </h2>

          </div>


          <div className="route-location">

            <div className="route-icon pickup">
              A
            </div>


            <div className="route-location-content">

              <span>
                PICKUP LOCATION
              </span>

              <strong>
                {trip.pickup_location}
              </strong>

            </div>

          </div>


          <div className="route-line"></div>


          <div className="route-location">

            <div className="route-icon delivery">
              B
            </div>


            <div className="route-location-content">

              <span>
                DELIVERY LOCATION
              </span>

              <strong>
                {trip.delivery_location}
              </strong>

            </div>

          </div>

        </div>


        {/* =========================================
            PACKAGE INFORMATION
        ========================================== */}

        <div className="trip-information-grid">

          <div className="trip-information-card">

            <span>
              PACKAGE
            </span>

            <h3>
              {trip.package_description}
            </h3>

          </div>


          <div className="trip-information-card">

            <span>
              REQUESTED
            </span>

            <h3>
              {formatDate(
                trip.created_at
              )}
            </h3>

          </div>


          <div className="trip-information-card">

            <span>
              DRIVER
            </span>

            <h3>
              {trip.driver_id
                ? `Driver #${trip.driver_id}`
                : "Waiting for driver"}
            </h3>

          </div>

        </div>


        {/* =========================================
            ACTIONS
        ========================================== */}

        <div className="trip-details-actions">

          <button
            className="secondary-button"
            onClick={() =>
              fetchTrip(true)
            }
          >
            ↻ Refresh Now
          </button>


          <button
            className="primary-button"
            onClick={() =>
              navigate("my-trips")
            }
          >
            My Deliveries
          </button>

        </div>

      </div>

    </div>
  );
}


export default TripDetails;