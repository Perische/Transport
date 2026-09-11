function Home({ navigate, user }) {
  return (
    <div className="home-page">

      {/* Hero Section */}
      <section className="hero-section">

        <div className="hero-content">

          <span className="hero-badge">
            🚚 Fast. Reliable. Simple.
          </span>

          <h1>
            Move Anything.
            <br />
            <span>Anywhere.</span>
          </h1>

          <p>
            MoveIt connects you with reliable drivers
            for fast and convenient package pickup
            and delivery.
          </p>

          <div className="hero-buttons">

            {user ? (
              user.role === "driver" ? (
                <button
                  className="primary-button"
                  onClick={() =>
                    navigate("driver-dashboard")
                  }
                >
                  Driver Dashboard
                </button>
              ) : (
                <button
                  className="primary-button"
                  onClick={() =>
                    navigate("create-trip")
                  }
                >
                  Send a Package
                </button>
              )
            ) : (
              <>
                <button
                  className="primary-button"
                  onClick={() =>
                    navigate("register")
                  }
                >
                  Get Started
                </button>

                <button
                  className="secondary-button"
                  onClick={() =>
                    navigate("login")
                  }
                >
                  Login
                </button>
              </>
            )}

          </div>

        </div>


        <div className="hero-visual">

          <div className="delivery-card">

            <div className="delivery-icon">
              🚚
            </div>

            <div>
              <h3>Package on the move</h3>

              <p>
                Your delivery is being handled
                with care.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* How It Works */}
      <section className="how-it-works">

        <div className="section-heading">

          <span>HOW IT WORKS</span>

          <h2>
            Delivery made simple
          </h2>

          <p>
            From pickup to delivery, MoveIt makes
            the entire process easy.
          </p>

        </div>


        <div className="steps">

          <div className="step-card">

            <div className="step-number">
              1
            </div>

            <h3>
              Request a Delivery
            </h3>

            <p>
              Enter where your package should be
              picked up and where it needs to go.
            </p>

          </div>


          <div className="step-card">

            <div className="step-number">
              2
            </div>

            <h3>
              Get a Driver
            </h3>

            <p>
              Available drivers can view and accept
              delivery requests.
            </p>

          </div>


          <div className="step-card">

            <div className="step-number">
              3
            </div>

            <h3>
              Track Your Delivery
            </h3>

            <p>
              Follow your delivery as it moves from
              pickup to its destination.
            </p>

          </div>

        </div>

      </section>


      {/* Features */}
      <section className="features-section">

        <div className="section-heading">

          <span>WHY MOVEIT?</span>

          <h2>
            Built for convenient deliveries
          </h2>

        </div>


        <div className="features-grid">

          <div className="feature-card">

            <div className="feature-icon">
              ⚡
            </div>

            <h3>
              Fast
            </h3>

            <p>
              Connect with available drivers and
              get your packages moving quickly.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              🔒
            </div>

            <h3>
              Reliable
            </h3>

            <p>
              Keep track of your delivery status
              throughout the entire journey.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              📦
            </div>

            <h3>
              Convenient
            </h3>

            <p>
              Request and manage deliveries from
              one simple platform.
            </p>

          </div>

        </div>

      </section>


      {/* Call To Action */}
      {!user && (
        <section className="cta-section">

          <h2>
            Ready to move it?
          </h2>

          <p>
            Create your MoveIt account and get
            started today.
          </p>

          <button
            className="primary-button"
            onClick={() =>
              navigate("register")
            }
          >
            Create Your Account
          </button>

        </section>
      )}

    </div>
  );
}

export default Home;