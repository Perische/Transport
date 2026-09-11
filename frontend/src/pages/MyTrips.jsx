import { useEffect, useState } from "react";

import TripCard from "../components/TripCard";

import {
  getCustomerDeliveries,
} from "../services/api";


function MyTrips({ navigate, user }) {

  const [trips, setTrips] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] = useState("");


  // ==================================================
  // LOAD CUSTOMER DELIVERIES
  // ==================================================

  const loadTrips = async (
    showRefreshing = false
  ) => {

    if (!user) {

      navigate("login");

      return;
    }


    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }


    setError("");


    try {

      const data =
        await getCustomerDeliveries(
          user.id
        );


      const customerTrips =
        Array.isArray(data)
          ? data
          : data.deliveries ||
            data.trips ||
            [];


      // Newest deliveries first

      const sortedTrips =
        [...customerTrips].sort(
          (a, b) => {

            const dateA =
              new Date(
                a.created_at || 0
              ).getTime();

            const dateB =
              new Date(
                b.created_at || 0
              ).getTime();

            return dateB - dateA;
          }
        );


      setTrips(sortedTrips);


    } catch (error) {

      setError(
        error.message ||
        "Unable to load your deliveries."
      );

    } finally {

      setLoading(false);

      setRefreshing(false);

    }
  };


  // ==================================================
  // INITIAL LOAD
  // ==================================================

  useEffect(() => {

    loadTrips();

  }, [user]);


  // ==================================================
  // STATUS HELPERS
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
  // COUNTS
  // ==================================================

  const activeTrips =
    trips.filter(
      (trip) =>
        ![
          "delivered",
          "cancelled",
        ].includes(trip.status)
    );


  const completedTrips =
    trips.filter(
      (trip) =>
        trip.status === "delivered"
    );


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {

    return (
      <div className="page-container">

        <div className="loading-container">

          <div className="loading-spinner"></div>

          <p>
            Loading your deliveries...
          </p>

        </div>

      </div>
    );
  }


  return (
    <div className="page-container">

      <div className="my-trips-container">

        {/* HEADER */}

        <div className="my-trips-header">

          <div>

            <span className="section-label">
              CUSTOMER ACCOUNT
            </span>

            <h1>
              My Deliveries
            </h1>

            <p>
              Track and manage all your MoveIt
              delivery requests.
            </p>

          </div>


          <div className="my-trips-header-actions">

            <button
              className="secondary-button"
              onClick={() =>
                loadTrips(true)
              }
              disabled={refreshing}
            >
              {refreshing
                ? "Refreshing..."
                : "↻ Refresh"}
            </button>


            <button
              className="primary-button"
              onClick={() =>
                navigate("create-trip")
              }
            >
              + New Delivery
            </button>

          </div>

        </div>


        {/* ERROR */}

        {error && (

          <div className="error-message">
            {error}
          </div>

        )}


        {/* SUMMARY */}

        <div className="trips-summary">

          <div className="trips-summary-card">

            <span>
              TOTAL DELIVERIES
            </span>

            <strong>
              {trips.length}
            </strong>

          </div>


          <div className="trips-summary-card">

            <span>
              ACTIVE
            </span>

            <strong>
              {activeTrips.length}
            </strong>

          </div>


          <div className="trips-summary-card">

            <span>
              COMPLETED
            </span>

            <strong>
              {completedTrips.length}
            </strong>

          </div>

        </div>


        {/* EMPTY STATE */}

        {trips.length === 0 ? (

          <div className="empty-trips">

            <div className="empty-trips-icon">
              📦
            </div>

            <h2>
              No deliveries yet
            </h2>

            <p>
              Create your first delivery request
              and we'll help get your package
              where it needs to go.
            </p>

            <button
              className="primary-button"
              onClick={() =>
                navigate("create-trip")
              }
            >
              Create Your First Delivery
            </button>

          </div>

        ) : (

          <div className="my-trips-list">

            {/* ACTIVE DELIVERIES */}

            {activeTrips.length > 0 && (

              <div className="trip-section">

                <div className="trip-section-header">

                  <div>

                    <span className="section-label">
                      IN PROGRESS
                    </span>

                    <h2>
                      Active Deliveries
                    </h2>

                  </div>

                  <span className="trip-section-count">
                    {activeTrips.length}
                  </span>

                </div>


                <div className="trip-cards-list">

                  {activeTrips.map(
                    (trip) => (

                      <TripCard
                        key={trip.id}
                        trip={trip}
                        navigate={navigate}
                      />

                    )
                  )}

                </div>

              </div>

            )}


            {/* COMPLETED DELIVERIES */}

            {completedTrips.length > 0 && (

              <div className="trip-section">

                <div className="trip-section-header">

                  <div>

                    <span className="section-label">
                      HISTORY
                    </span>

                    <h2>
                      Completed Deliveries
                    </h2>

                  </div>

                  <span className="trip-section-count">
                    {completedTrips.length}
                  </span>

                </div>


                <div className="trip-cards-list">

                  {completedTrips.map(
                    (trip) => (

                      <TripCard
                        key={trip.id}
                        trip={trip}
                        navigate={navigate}
                      />

                    )
                  )}

                </div>

              </div>

            )}


            {/* CANCELLED DELIVERIES */}

            {trips.some(
              (trip) =>
                trip.status === "cancelled"
            ) && (

              <div className="trip-section">

                <div className="trip-section-header">

                  <div>

                    <span className="section-label">
                      CANCELLED
                    </span>

                    <h2>
                      Cancelled Deliveries
                    </h2>

                  </div>

                </div>


                <div className="trip-cards-list">

                  {trips
                    .filter(
                      (trip) =>
                        trip.status ===
                        "cancelled"
                    )
                    .map(
                      (trip) => (

                        <TripCard
                          key={trip.id}
                          trip={trip}
                          navigate={navigate}
                        />

                      )
                    )}

                </div>

              </div>

            )}

          </div>

        )}

      </div>

    </div>
  );
}


export default MyTrips;