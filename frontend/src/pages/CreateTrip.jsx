import { useState } from "react";

import {
  createTrip
} from "../services/api";


function CreateTrip({
  navigate,
  user,
}) {

  const [pickupLocation, setPickupLocation] =
    useState("");

  const [deliveryLocation, setDeliveryLocation] =
    useState("");

  const [packageDescription, setPackageDescription] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // ==================================================
  // CREATE DELIVERY
  // ==================================================

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();

    setError("");


    if (!user) {

      navigate("login");

      return;
    }


    if (!pickupLocation.trim()) {

      setError(
        "Please enter the pickup location."
      );

      return;
    }


    if (!deliveryLocation.trim()) {

      setError(
        "Please enter the delivery location."
      );

      return;
    }


    if (!packageDescription.trim()) {

      setError(
        "Please describe the package."
      );

      return;
    }


    setLoading(true);


    try {

      // ==========================================
      // IMPORTANT:
      // customer_id is NOT sent anymore.
      //
      // The backend gets the customer identity
      // directly from the JWT.
      // ==========================================

      const data = await createTrip({

        pickup_location:
          pickupLocation.trim(),

        delivery_location:
          deliveryLocation.trim(),

        package_description:
          packageDescription.trim(),

      });


      const createdTrip =
        data.trip || data;


      if (createdTrip?.id) {

        navigate(
          "trip-details",
          createdTrip.id
        );

      } else {

        navigate(
          "my-trips"
        );

      }


    } catch (error) {

      setError(
        error.message ||
        "Unable to create your delivery."
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="page-container">

      <div className="create-trip-container">

        {/* =========================================
            BACK
        ========================================== */}

        <button
          className="back-button"
          onClick={() =>
            navigate("dashboard")
          }
        >
          ← Dashboard
        </button>


        {/* =========================================
            HEADER
        ========================================== */}

        <div className="create-trip-header">

          <span className="section-label">
            NEW DELIVERY
          </span>

          <h1>
            Create a Delivery
          </h1>

          <p>
            Tell us where your package needs
            to be picked up and delivered.
          </p>

        </div>


        {/* =========================================
            FORM CARD
        ========================================== */}

        <div className="create-trip-card">

          {error && (

            <div className="error-message">
              {error}
            </div>

          )}


          <form
            onSubmit={handleSubmit}
          >

            {/* =====================================
                PICKUP
            ====================================== */}

            <div className="form-group">

              <label htmlFor="pickupLocation">
                Pickup Location
              </label>

              <input
                id="pickupLocation"
                type="text"
                value={pickupLocation}
                onChange={(event) =>
                  setPickupLocation(
                    event.target.value
                  )
                }
                placeholder="Where should we collect the package?"
                required
              />

              <small>
                Enter the location where the
                driver should collect your package.
              </small>

            </div>


            {/* =====================================
                DELIVERY
            ====================================== */}

            <div className="form-group">

              <label htmlFor="deliveryLocation">
                Delivery Location
              </label>

              <input
                id="deliveryLocation"
                type="text"
                value={deliveryLocation}
                onChange={(event) =>
                  setDeliveryLocation(
                    event.target.value
                  )
                }
                placeholder="Where should we deliver the package?"
                required
              />

              <small>
                Enter the destination for your
                package.
              </small>

            </div>


            {/* =====================================
                PACKAGE
            ====================================== */}

            <div className="form-group">

              <label htmlFor="packageDescription">
                Package Description
              </label>

              <textarea
                id="packageDescription"
                value={packageDescription}
                onChange={(event) =>
                  setPackageDescription(
                    event.target.value
                  )
                }
                placeholder="What are you sending?"
                rows="5"
                required
              />

              <small>
                Include useful details such as
                the type, size or special handling
                needed.
              </small>

            </div>


            {/* =====================================
                DELIVERY FLOW
            ====================================== */}

            <div className="delivery-flow">

              <div className="delivery-flow-step">

                <div className="delivery-flow-icon">
                  A
                </div>

                <span>
                  Pickup
                </span>

              </div>


              <div className="delivery-flow-line"></div>


              <div className="delivery-flow-step">

                <div className="delivery-flow-icon">
                  B
                </div>

                <span>
                  Delivery
                </span>

              </div>

            </div>


            {/* =====================================
                INFO
            ====================================== */}

            <div className="create-trip-info">

              <div className="create-trip-info-icon">
                ✓
              </div>


              <div>

                <strong>
                  How MoveIt works
                </strong>

                <p>
                  Once your request is created,
                  available drivers can accept it.
                  You can then track your delivery
                  as it moves toward its destination.
                </p>

              </div>

            </div>


            {/* =====================================
                SUBMIT
            ====================================== */}

            <button
              type="submit"
              className="primary-button create-trip-button"
              disabled={loading}
            >

              {loading
                ? "Creating Delivery..."
                : "Create Delivery"}

            </button>

          </form>

        </div>

      </div>

    </div>
  );
}


export default CreateTrip;