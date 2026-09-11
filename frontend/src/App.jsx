import { useState } from "react";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateTrip from "./pages/CreateTrip";
import MyTrips from "./pages/MyTrips";
import TripDetails from "./pages/TripDetails";
import DriverDashboard from "./pages/DriverDashboard";
import DriverSetup from "./pages/DriverSetup";
import Vehicles from "./pages/Vehicles";


function App() {

  const [currentPage, setCurrentPage] =
    useState("home");


  const [selectedTripId, setSelectedTripId] =
    useState(null);


  const [user, setUser] = useState(() => {

    const savedUser =
      localStorage.getItem(
        "moveitUser"
      );


    try {

      return savedUser
        ? JSON.parse(savedUser)
        : null;

    } catch (error) {

      localStorage.removeItem(
        "moveitUser"
      );

      localStorage.removeItem(
        "moveitToken"
      );

      return null;
    }

  });


  // ==================================================
  // NAVIGATION
  // ==================================================

  const navigate = (
    page,
    data = null
  ) => {

    if (
      page ===
      "trip-details"
    ) {

      setSelectedTripId(
        data
      );

    }


    setCurrentPage(
      page
    );
  };


  // ==================================================
  // LOGOUT
  // ==================================================

  const logout = () => {

    localStorage.removeItem(
      "moveitUser"
    );


    localStorage.removeItem(
      "moveitToken"
    );


    setUser(null);

    setSelectedTripId(
      null
    );

    setCurrentPage(
      "home"
    );
  };


  // ==================================================
  // CUSTOMER PROTECTION
  // ==================================================

  const customerPage = (
    page
  ) => {

    return (
      <ProtectedRoute
        user={user}
        navigate={navigate}
        allowedRoles={[
          "customer"
        ]}
      >
        {page}
      </ProtectedRoute>
    );
  };


  // ==================================================
  // DRIVER PROTECTION
  // ==================================================

  const driverPage = (
    page
  ) => {

    return (
      <ProtectedRoute
        user={user}
        navigate={navigate}
        allowedRoles={[
          "driver"
        ]}
      >
        {page}
      </ProtectedRoute>
    );
  };


  // ==================================================
  // RENDER PAGE
  // ==================================================

  const renderPage = () => {

    switch (
      currentPage
    ) {


      // ==============================================
      // PUBLIC
      // ==============================================

      case "home":

        return (
          <Home
            navigate={navigate}
            user={user}
          />
        );


      case "login":

        if (user) {

          if (
            user.role ===
            "driver"
          ) {

            navigate(
              "driver-dashboard"
            );

          } else {

            navigate(
              "dashboard"
            );

          }

          return null;
        }


        return (
          <Login
            navigate={navigate}
            setUser={setUser}
          />
        );


      case "register":

        if (user) {

          if (
            user.role ===
            "driver"
          ) {

            navigate(
              "driver-dashboard"
            );

          } else {

            navigate(
              "dashboard"
            );

          }

          return null;
        }


        return (
          <Register
            navigate={navigate}
            setUser={setUser}
          />
        );


      // ==============================================
      // CUSTOMER
      // ==============================================

      case "dashboard":

        return customerPage(
          <Dashboard
            navigate={navigate}
            user={user}
            logout={logout}
          />
        );


      case "create-trip":

        return customerPage(
          <CreateTrip
            navigate={navigate}
            user={user}
          />
        );


      case "my-trips":

        return customerPage(
          <MyTrips
            navigate={navigate}
            user={user}
          />
        );


      case "trip-details":

        return customerPage(
          <TripDetails
            navigate={navigate}
            user={user}
            tripId={
              selectedTripId
            }
          />
        );


      // ==============================================
      // DRIVER
      // ==============================================

      case "driver-setup":

        return driverPage(
          <DriverSetup
            navigate={navigate}
            user={user}
          />
        );


      case "driver-dashboard":

        return driverPage(
          <DriverDashboard
            navigate={navigate}
            user={user}
            logout={logout}
          />
        );


      case "vehicles":

        return driverPage(
          <Vehicles
            navigate={navigate}
            user={user}
          />
        );


      // ==============================================
      // DEFAULT
      // ==============================================

      default:

        return (
          <Home
            navigate={navigate}
            user={user}
          />
        );

    }
  };


  return (
    <>
      <Navbar
        navigate={navigate}
        user={user}
      />

      {renderPage()}
    </>
  );
}


export default App;