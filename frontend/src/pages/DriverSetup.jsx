import { useState } from "react";

import {
  createDriver
} from "../services/api";


function DriverSetup({ navigate, user }) {

  const [phone, setPhone] = useState("");

  const [licenseNumber, setLicenseNumber] =
    useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);


  // ==================================================
  // HANDLE SUBMIT
  // ==================================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");


    if (!user) {

      navigate("login");

      return;
    }


    if (!phone.trim()) {

      setError(
        "Please enter your phone number."
      );

      return;
    }


    if (!licenseNumber.trim()) {

      setError(
        "Please enter your driver's licence number."
      );

      return;
    }


    setLoading(true);


    try {

      await createDriver({

        user_id: user.id,

        phone: phone.trim(),

        license_number:
          licenseNumber.trim(),

      });


      navigate("driver-dashboard");


    } catch (error) {

      setError(
        error.message ||
        "Unable to create your driver profile."
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="page-container">

      <div className="driver-setup-container">

        {/* BACK BUTTON */}

        <button
          className="back-button"
          onClick={() =>
            navigate("home")
          }
        >
          ← Home
        </button>


        {/* HEADER */}

        <div className="driver-setup-header">

          <span>
            DRIVER ONBOARDING
          </span>

          <h1>
            Complete Your Driver Profile
          </h1>

          <p>
            Before you start accepting deliveries,
            we need a few details about you.
          </p>

        </div>


        {/* CARD */}

        <div className="driver-setup-card">

          {error && (

            <div className="error-message">
              {error}
            </div>

          )}


          {/* USER INFORMATION */}

          <div className="driver-setup-user">

            <div className="driver-avatar">

              {user?.name
                ? user.name
                    .charAt(0)
                    .toUpperCase()
                : "D"}

            </div>


            <div>

              <strong>
                {user?.name}
              </strong>

              <span>
                {user?.email}
              </span>

            </div>

          </div>


          {/* FORM */}

          <form onSubmit={handleSubmit}>

            {/* PHONE */}

            <div className="form-group">

              <label htmlFor="phone">
                Phone Number
              </label>

              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(event) =>
                  setPhone(
                    event.target.value
                  )
                }
                placeholder="e.g. 0712 345 678"
                autoComplete="tel"
                required
              />

              <small>
                Customers may need to contact you
                regarding a delivery.
              </small>

            </div>


            {/* LICENCE */}

            <div className="form-group">

              <label htmlFor="licenseNumber">
                Driver's Licence Number
              </label>

              <input
                id="licenseNumber"
                type="text"
                value={licenseNumber}
                onChange={(event) =>
                  setLicenseNumber(
                    event.target.value
                  )
                }
                placeholder="Enter your licence number"
                required
              />

              <small>
                Enter your valid driver's licence
                number.
              </small>

            </div>


            {/* INFORMATION */}

            <div className="driver-setup-info">

              <div className="driver-setup-info-icon">
                ✓
              </div>


              <div>

                <strong>
                  You're almost ready!
                </strong>

                <p>
                  After creating your driver profile,
                  you'll be able to add your vehicle
                  and start accepting deliveries.
                </p>

              </div>

            </div>


            {/* SUBMIT */}

            <button
              type="submit"
              className="primary-button driver-setup-button"
              disabled={loading}
            >

              {loading
                ? "Creating Profile..."
                : "Continue to Driver Dashboard"}

            </button>

          </form>

        </div>

      </div>

    </div>
  );
}


export default DriverSetup;