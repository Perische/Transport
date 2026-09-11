function Navbar({ navigate, user }) {
  return (
    <nav className="navbar">

      <div
        className="navbar-logo"
        onClick={() => navigate("home")}
      >
        MoveIt
      </div>


      <div className="navbar-links">

        <button
          onClick={() => navigate("home")}
        >
          Home
        </button>


        {user &&
          user.role === "customer" && (
            <>
              <button
                onClick={() =>
                  navigate("dashboard")
                }
              >
                Dashboard
              </button>

              <button
                onClick={() =>
                  navigate("create-trip")
                }
              >
                Create Delivery
              </button>

              <button
                onClick={() =>
                  navigate("my-trips")
                }
              >
                My Trips
              </button>
            </>
          )}


        {user &&
          user.role === "driver" && (
            <>
              <button
                onClick={() =>
                  navigate("driver-dashboard")
                }
              >
                Driver Dashboard
              </button>

              <button
                onClick={() =>
                  navigate("vehicles")
                }
              >
                Vehicles
              </button>
            </>
          )}


        {!user && (
          <>
            <button
              onClick={() =>
                navigate("login")
              }
            >
              Login
            </button>

            <button
              onClick={() =>
                navigate("register")
              }
            >
              Register
            </button>
          </>
        )}

      </div>

    </nav>
  );
}


export default Navbar;