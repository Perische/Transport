import { useState } from "react";

import {
  loginUser
} from "../services/api";


function Login({
  navigate,
  setUser,
}) {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const handleSubmit =
    async (event) => {

      event.preventDefault();

      setError("");


      if (!email.trim()) {

        setError(
          "Please enter your email address."
        );

        return;
      }


      if (!password) {

        setError(
          "Please enter your password."
        );

        return;
      }


      setLoading(true);


      try {

        const data =
          await loginUser({
            email:
              email.trim(),

            password,
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
            "driver-dashboard"
          );

        } else {

          navigate(
            "dashboard"
          );

        }


      } catch (error) {

        setError(
          error.message ||
          "Unable to login. Please try again."
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
            WELCOME BACK
          </span>

          <h1>
            Login to MoveIt
          </h1>

          <p>
            Access your deliveries and
            manage your MoveIt account.
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
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />

            </div>


            <button
              type="submit"
              className="primary-button auth-button"
              disabled={loading}
            >

              {loading
                ? "Logging in..."
                : "Login"}

            </button>

          </form>


          <div className="auth-footer">

            <span>
              Don't have a MoveIt account?
            </span>

            <button
              onClick={() =>
                navigate("register")
              }
            >
              Create an account
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}


export default Login;