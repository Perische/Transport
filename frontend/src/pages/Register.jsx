import { useState } from "react";

import {
  registerUser
} from "../services/api";


function Register({
  navigate,
  setUser,
}) {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] =
    useState("");

  const [role, setRole] =
    useState("customer");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const handleSubmit =
    async (event) => {

      event.preventDefault();

      setError("");


      if (!name.trim()) {

        setError(
          "Please enter your full name."
        );

        return;
      }


      if (!email.trim()) {

        setError(
          "Please enter your email address."
        );

        return;
      }


      if (!password) {

        setError(
          "Please enter a password."
        );

        return;
      }


      if (password.length < 6) {

        setError(
          "Password must be at least 6 characters."
        );

        return;
      }


      if (
        password !==
        confirmPassword
      ) {

        setError(
          "Passwords do not match."
        );

        return;
      }


      setLoading(true);


      try {

        const data =
          await registerUser({

            name:
              name.trim(),

            email:
              email.trim(),

            password,

            role,

          });


        // ========================================
        // SAVE JWT
        // ========================================

        localStorage.setItem(
          "moveitToken",
          data.access_token
        );


        // ========================================
        // SAVE USER
        // ========================================

        localStorage.setItem(
          "moveitUser",
          JSON.stringify(
            data.user
          )
        );


        setUser(
          data.user
        );


        // ========================================
        // REDIRECT
        // ========================================

        if (
          data.user.role ===
          "driver"
        ) {

          navigate(
            "driver-setup"
          );

        } else {

          navigate(
            "dashboard"
          );

        }


      } catch (error) {

        setError(
          error.message ||
          "Unable to create your account."
        );

      } finally {

        setLoading(false);

      }

    };


  return (
    <div className="page-container">

      <div className="auth-container">

        <button
          className="back-button"
          onClick={() =>
            navigate("home")
          }
        >
          ← Home
        </button>


        <div className="auth-header">

          <span>
            GET STARTED
          </span>

          <h1>
            Create Your MoveIt Account
          </h1>

          <p>
            Join MoveIt and make deliveries
            simpler and more convenient.
          </p>

        </div>


        <div className="auth-card">

          {error && (

            <div className="error-message">
              {error}
            </div>

          )}


          <form
            onSubmit={handleSubmit}
          >

            <div className="form-group">

              <label htmlFor="name">
                Full Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />

            </div>


            <div className="form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                placeholder="Enter your email"
                autoComplete="email"
                required
              />

            </div>


            <div className="form-group">

              <label htmlFor="role">
                I want to
              </label>

              <select
                id="role"
                value={role}
                onChange={(event) =>
                  setRole(
                    event.target.value
                  )
                }
              >

                <option value="customer">
                  Send packages
                </option>

                <option value="driver">
                  Deliver packages
                </option>

              </select>

            </div>


            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="Create a password"
                autoComplete="new-password"
                required
              />

              <small>
                Password must be at least
                6 characters.
              </small>

            </div>


            <div className="form-group">

              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                placeholder="Confirm your password"
                autoComplete="new-password"
                required
              />

            </div>


            <div className="registration-role-info">

              {role === "customer" ? (

                <>
                  <strong>
                    Customer Account
                  </strong>

                  <p>
                    Request deliveries,
                    track your packages and
                    view your delivery history.
                  </p>
                </>

              ) : (

                <>
                  <strong>
                    Driver Account
                  </strong>

                  <p>
                    Create your driver profile,
                    add your vehicle and accept
                    delivery requests.
                  </p>
                </>

              )}

            </div>


            <button
              type="submit"
              className="primary-button auth-button"
              disabled={loading}
            >

              {loading
                ? "Creating Account..."
                : "Create Account"}

            </button>

          </form>


          <div className="auth-footer">

            <span>
              Already have a MoveIt account?
            </span>

            <button
              onClick={() =>
                navigate("login")
              }
            >
              Login
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}


export default Register;