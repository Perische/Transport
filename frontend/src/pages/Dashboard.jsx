// ==================================================
// CUSTOMER DASHBOARD
// ==================================================

import { useEffect, useState } from "react";

import {
  getCustomerDeliveries,
} from "../services/api";

import {
  getStatusLabel,
  getStatusDescription,
} from "../services/tripService";

import {
  getErrorMessage,
  formatDateTime,
} from "../utils/helpers";


// ==================================================
// DASHBOARD
// ==================================================

function Dashboard({
  user,
  navigate,
}) {

  const [deliveries, setDeliveries] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==================================================
  // LOAD CUSTOMER DELIVERIES
  // ==================================================

  useEffect(() => {

    const loadDeliveries =
      async () => {

        if (!user?.id) {

          setLoading(false);

          return;
        }

        try {

          setError("");

          const response =
            await getCustomerDeliveries(
              user.id
            );

          const customerDeliveries =
            Array.isArray(response)
              ? response
              : response.deliveries || [];

          setDeliveries(
            customerDeliveries
          );

        } catch (err) {

          setError(
            getErrorMessage(
              err,
              "Unable to load your deliveries."
            )
          );

        } finally {

          setLoading(false);

        }
      };


    loadDeliveries();

  }, [user]);


  // ==================================================
  // STATISTICS
  // ==================================================

  const totalDeliveries =
    deliveries.length;


  const pendingDeliveries =
    deliveries.filter(
      (delivery) =>
        delivery.status ===
        "pending"
    ).length;


  const activeDeliveries =
    deliveries.filter(
      (delivery) =>
        [
          "assigned",
          "picked_up",
          "in_transit",
        ].includes(
          delivery.status
        )
    ).length;


  const completedDeliveries =
    deliveries.filter(
      (delivery) =>
        delivery.status ===
        "delivered"
    ).length;


  // ==================================================
  // RECENT DELIVERIES
  // ==================================================

  const recentDeliveries =
    [...deliveries]
      .sort(
        (a, b) =>
          new Date(
            b.created_at
          ) -
          new Date(
            a.created_at
          )
      )
      .slice(0, 5);


  // ==================================================
  // NAVIGATION
  // ==================================================

  const handleCreateDelivery = () => {

    navigate(
      "create-trip"
    );

  };


  const handleViewTrips = () => {

    navigate(
      "my-trips"
    );

  };


  const handleViewTrip = (
    tripId
  ) => {

    navigate(
      `trip-details/${tripId}`
    );

  };


  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div className="page-container">

      <div className="dashboard-page">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="dashboard-header">

          <div>

            <p className="page-eyebrow">
              Customer Dashboard
            </p>

            <h1>
              Welcome, {user?.name || "Customer"}!
            </h1>

            <p>
              Manage your deliveries
              and track your packages
              from one place.
            </p>

          </div>


          <div className="dashboard-header-actions">

            <button
              type="button"
              className="primary-button"
              onClick={
                handleCreateDelivery
              }
            >
              + Request Delivery
            </button>

          </div>

        </div>


        {/* ==========================================
            ERROR
        ========================================== */}

        {error && (

          <div className="error-message">

            {error}

          </div>

        )}


        {/* ==========================================
            STATISTICS
        ========================================== */}

        <div className="dashboard-stats">

          {/* TOTAL */}

          <div className="stat-card">

            <div className="stat-icon">
              📦
            </div>

            <div>

              <span className="stat-label">
                Total Deliveries
              </span>

              <strong className="stat-value">
                {totalDeliveries}
              </strong>

            </div>

          </div>


          {/* PENDING */}

          <div className="stat-card">

            <div className="stat-icon">
              ⏳
            </div>

            <div>

              <span className="stat-label">
                Pending
              </span>

              <strong className="stat-value">
                {pendingDeliveries}
              </strong>

            </div>

          </div>


          {/* ACTIVE */}

          <div className="stat-card">

            <div className="stat-icon">
              🚚
            </div>

            <div>

              <span className="stat-label">
                Active
              </span>

              <strong className="stat-value">
                {activeDeliveries}
              </strong>

            </div>

          </div>


          {/* COMPLETED */}

          <div className="stat-card">

            <div className="stat-icon">
              ✓
            </div>

            <div>

              <span className="stat-label">
                Delivered
              </span>

              <strong className="stat-value">
                {completedDeliveries}
              </strong>

            </div>

          </div>

        </div>


        {/* ==========================================
            QUICK ACTIONS
        ========================================== */}

        <div className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>
                Quick Actions
              </h2>

              <p>
                What would you like to do?
              </p>

            </div>

          </div>


          <div className="quick-actions">

            <button
              type="button"
              className="action-card"
              onClick={
                handleCreateDelivery
              }
            >

              <span className="action-icon">
                📦
              </span>

              <span className="action-title">
                Request a Delivery
              </span>

              <span className="action-description">
                Create a new package
                pickup and delivery request.
              </span>

            </button>


            <button
              type="button"
              className="action-card"
              onClick={
                handleViewTrips
              }
            >

              <span className="action-icon">
                📋
              </span>

              <span className="action-title">
                View My Deliveries
              </span>

              <span className="action-description">
                View and track all
                your delivery requests.
              </span>

            </button>

          </div>

        </div>


        {/* ==========================================
            RECENT DELIVERIES
        ========================================== */}

        <div className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>
                Recent Deliveries
              </h2>

              <p>
                Your latest delivery requests.
              </p>

            </div>


            {deliveries.length > 0 && (

              <button
                type="button"
                className="text-button"
                onClick={
                  handleViewTrips
                }
              >
                View All
              </button>

            )}

          </div>


          {/* LOADING */}

          {loading && (

            <div className="loading-state">

              Loading your deliveries...

            </div>

          )}


          {/* EMPTY */}

          {!loading &&
            deliveries.length === 0 && (

              <div className="empty-state">

                <div className="empty-state-icon">
                  📦
                </div>

                <h3>
                  No deliveries yet
                </h3>

                <p>
                  You haven't requested
                  any deliveries yet.
                </p>

                <button
                  type="button"
                  className="primary-button"
                  onClick={
                    handleCreateDelivery
                  }
                >
                  Request Your First Delivery
                </button>

              </div>

            )}


          {/* DELIVERY LIST */}

          {!loading &&
            recentDeliveries.length > 0 && (

              <div className="delivery-list">

                {recentDeliveries.map(
                  (delivery) => (

                    <div
                      key={
                        delivery.id
                      }
                      className="delivery-card"
                    >

                      {/* DELIVERY TOP */}

                      <div className="delivery-card-header">

                        <div>

                          <span className="delivery-id">
                            Delivery #
                            {delivery.id}
                          </span>

                          <h3>
                            {
                              delivery.package_description
                            }
                          </h3>

                        </div>


                        <span
                          className={
                            `status-badge status-${delivery.status}`
                          }
                        >
                          {
                            getStatusLabel(
                              delivery.status
                            )
                          }
                        </span>

                      </div>


                      {/* ROUTE */}

                      <div className="delivery-route">

                        <div className="route-point">

                          <span className="route-marker pickup-marker">
                            ●
                          </span>

                          <div>

                            <span className="route-label">
                              Pickup
                            </span>

                            <strong>
                              {
                                delivery.pickup_location
                              }
                            </strong>

                          </div>

                        </div>


                        <div className="route-line" />


                        <div className="route-point">

                          <span className="route-marker delivery-marker">
                            ●
                          </span>

                          <div>

                            <span className="route-label">
                              Delivery
                            </span>

                            <strong>
                              {
                                delivery.delivery_location
                              }
                            </strong>

                          </div>

                        </div>

                      </div>


                      {/* DESCRIPTION */}

                      <p className="delivery-status-description">

                        {
                          getStatusDescription(
                            delivery.status
                          )
                        }

                      </p>


                      {/* FOOTER */}

                      <div className="delivery-card-footer">

                        <span>
                          {formatDateTime(
                            delivery.created_at
                          )}
                        </span>


                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() =>
                            handleViewTrip(
                              delivery.id
                            )
                          }
                        >
                          View Details
                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

        </div>


        {/* ==========================================
            ACCOUNT INFORMATION
        ========================================== */}

        <div className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>
                Account
              </h2>

              <p>
                Your MoveIt account information.
              </p>

            </div>

          </div>


          <div className="account-summary">

            <div className="account-avatar">

              {user?.name
                ? user.name
                    .charAt(0)
                    .toUpperCase()
                : "U"}

            </div>


            <div className="account-info">

              <h3>
                {user?.name ||
                  "MoveIt User"}
              </h3>

              <p>
                {user?.email}
              </p>

              <span className="profile-role">
                Customer
              </span>

            </div>


            <button
              type="button"
              className="secondary-button"
              onClick={() =>
                navigate(
                  "profile"
                )
              }
            >
              Edit Profile
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}


// ==================================================
// DEFAULT EXPORT
// ==================================================

export default Dashboard;