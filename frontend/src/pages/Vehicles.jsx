import { useEffect, useState } from "react";

import VehicleCard from "../components/VehicleCard";


function Vehicles({ navigate, user }) {
  const [driver, setDriver] = useState(null);
  const [vehicles, setVehicles] = useState([]);

  const [vehicleType, setVehicleType] = useState("");
  const [registrationNumber, setRegistrationNumber] =
    useState("");
  const [model, setModel] = useState("");
  const [capacity, setCapacity] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // ==========================================
  // LOAD DRIVER AND VEHICLES
  // ==========================================

  const loadVehicles = async () => {

    if (!user) {
      navigate("login");
      return;
    }

    setLoading(true);
    setError("");

    try {

      const driverResponse = await fetch(
        `http://127.0.0.1:5000/api/drivers/user/${user.id}`
      );

      const driverData =
        await driverResponse.json();


      if (!driverResponse.ok) {

        setError(
          driverData.error ||
          "Unable to load driver profile."
        );

        return;
      }


      setDriver(driverData);


      const vehicleResponse = await fetch(
        `http://127.0.0.1:5000/api/vehicles/driver/${driverData.id}`
      );

      const vehicleData =
        await vehicleResponse.json();


      if (!vehicleResponse.ok) {

        setError(
          vehicleData.error ||
          "Unable to load vehicles."
        );

        return;
      }


      setVehicles(vehicleData);

    } catch (error) {

      setError(
        "Unable to connect to the MoveIt server."
      );

    } finally {

      setLoading(false);
    }
  };


  useEffect(() => {
    loadVehicles();
  }, [user]);


  // ==========================================
  // ADD VEHICLE
  // ==========================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");
    setSuccess("");


    if (!vehicleType.trim()) {
      setError("Please enter the vehicle type.");
      return;
    }


    if (!registrationNumber.trim()) {
      setError(
        "Please enter the registration number."
      );
      return;
    }


    if (!capacity || Number(capacity) <= 0) {
      setError(
        "Please enter a valid vehicle capacity."
      );
      return;
    }


    if (!driver) {
      setError(
        "Driver profile could not be found."
      );
      return;
    }


    setActionLoading(true);


    try {

      const response = await fetch(
        "http://127.0.0.1:5000/api/vehicles/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            driver_id: driver.id,
            vehicle_type: vehicleType.trim(),
            registration_number:
              registrationNumber
                .trim()
                .toUpperCase(),
            model: model.trim(),
            capacity: Number(capacity),
          }),
        }
      );


      const data = await response.json();


      if (!response.ok) {

        setError(
          data.error ||
          "Unable to add vehicle."
        );

        return;
      }


      setSuccess(
        "Vehicle added successfully!"
      );


      setVehicleType("");
      setRegistrationNumber("");
      setModel("");
      setCapacity("");


      await loadVehicles();

    } catch (error) {

      setError(
        "Unable to connect to the MoveIt server."
      );

    } finally {

      setActionLoading(false);
    }
  };


  // ==========================================
  // DELETE VEHICLE
  // ==========================================

  const handleDelete = async (vehicleId) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this vehicle?"
    );


    if (!confirmed) {
      return;
    }


    setActionLoading(true);
    setError("");
    setSuccess("");


    try {

      const response = await fetch(
        `http://127.0.0.1:5000/api/vehicles/${vehicleId}`,
        {
          method: "DELETE",
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        setError(
          data.error ||
          "Unable to delete vehicle."
        );

        return;
      }


      setSuccess(
        "Vehicle deleted successfully."
      );


      await loadVehicles();

    } catch (error) {

      setError(
        "Unable to connect to the MoveIt server."
      );

    } finally {

      setActionLoading(false);
    }
  };


  // ==========================================
  // TOGGLE VEHICLE AVAILABILITY
  // ==========================================

  const handleToggleAvailability = async (
    vehicle
  ) => {

    setActionLoading(true);
    setError("");
    setSuccess("");


    try {

      const response = await fetch(
        `http://127.0.0.1:5000/api/vehicles/${vehicle.id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            is_available:
              !vehicle.is_available,
          }),
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        setError(
          data.error ||
          "Unable to update vehicle."
        );

        return;
      }


      setSuccess(
        data.is_available
          ? "Vehicle is now available."
          : "Vehicle is now unavailable."
      );


      await loadVehicles();

    } catch (error) {

      setError(
        "Unable to connect to the MoveIt server."
      );

    } finally {

      setActionLoading(false);
    }
  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div className="page-container">

        <div className="loading-state">
          Loading your vehicles...
        </div>

      </div>
    );
  }


  return (
    <div className="page-container">

      <div className="vehicles-container">


        {/* HEADER */}

        <button
          className="back-button"
          onClick={() =>
            navigate("driver-dashboard")
          }
        >
          ← Driver Dashboard
        </button>


        <div className="vehicles-header">

          <div>

            <span>
              DRIVER VEHICLES
            </span>

            <h1>
              Manage Your Vehicles
            </h1>

            <p>
              Add and manage the vehicles you use
              for MoveIt deliveries.
            </p>

          </div>

        </div>


        {/* MESSAGES */}

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


        {/* ADD VEHICLE */}

        <div className="add-vehicle-card">

          <div className="section-heading-small">

            <span>
              ADD VEHICLE
            </span>

            <h2>
              Register a Vehicle
            </h2>

          </div>


          <form onSubmit={handleSubmit}>

            <div className="vehicle-form-grid">


              <div className="form-group">

                <label htmlFor="vehicleType">
                  Vehicle Type
                </label>

                <select
                  id="vehicleType"
                  value={vehicleType}
                  onChange={(event) =>
                    setVehicleType(
                      event.target.value
                    )
                  }
                  required
                >

                  <option value="">
                    Select vehicle type
                  </option>

                  <option value="Motorcycle">
                    Motorcycle
                  </option>

                  <option value="Car">
                    Car
                  </option>

                  <option value="Van">
                    Van
                  </option>

                  <option value="Pickup">
                    Pickup
                  </option>

                  <option value="Truck">
                    Truck
                  </option>

                </select>

              </div>


              <div className="form-group">

                <label htmlFor="registrationNumber">
                  Registration Number
                </label>

                <input
                  id="registrationNumber"
                  type="text"
                  value={registrationNumber}
                  onChange={(event) =>
                    setRegistrationNumber(
                      event.target.value
                    )
                  }
                  placeholder="e.g. KDA 123A"
                  required
                />

              </div>


              <div className="form-group">

                <label htmlFor="model">
                  Vehicle Model
                </label>

                <input
                  id="model"
                  type="text"
                  value={model}
                  onChange={(event) =>
                    setModel(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Toyota Probox"
                />

              </div>


              <div className="form-group">

                <label htmlFor="capacity">
                  Capacity (kg)
                </label>

                <input
                  id="capacity"
                  type="number"
                  min="1"
                  step="0.1"
                  value={capacity}
                  onChange={(event) =>
                    setCapacity(
                      event.target.value
                    )
                  }
                  placeholder="e.g. 500"
                  required
                />

              </div>

            </div>


            <button
              type="submit"
              className="primary-button"
              disabled={actionLoading}
            >
              {actionLoading
                ? "Adding Vehicle..."
                : "Add Vehicle"}
            </button>

          </form>

        </div>


        {/* VEHICLE LIST */}

        <section className="vehicles-section">

          <div className="vehicles-section-header">

            <div>

              <span>
                YOUR FLEET
              </span>

              <h2>
                My Vehicles
              </h2>

            </div>

            <strong>
              {vehicles.length}
              {" "}
              {vehicles.length === 1
                ? "vehicle"
                : "vehicles"}
            </strong>

          </div>


          {vehicles.length === 0 ? (

            <div className="vehicle-empty-state">

              <div className="vehicle-empty-icon">
                🚚
              </div>

              <h3>
                No vehicles registered
              </h3>

              <p>
                Add your first vehicle above to
                start accepting deliveries.
              </p>

            </div>

          ) : (

            <div className="vehicle-list">

              {vehicles.map((vehicle) => (

                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onDelete={handleDelete}
                  onToggleAvailability={
                    handleToggleAvailability
                  }
                  actionLoading={
                    actionLoading
                  }
                />

              ))}

            </div>

          )}

        </section>

      </div>

    </div>
  );
}


export default Vehicles;