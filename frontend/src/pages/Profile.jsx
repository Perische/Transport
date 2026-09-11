// ==================================================
// PROFILE PAGE
// ==================================================

import { useEffect, useState } from "react";

import {
  getUser,
  updateUser,
} from "../services/api";

import {
  getCurrentUser,
} from "../Services/authService";

import {
  getErrorMessage,
} from "../utils/helpers";


function Profile({
  user,
  setUser,
  navigate,
}) {

  const [currentUser, setCurrentUser] =
    useState(
      user || getCurrentUser()
    );


  const [formData, setFormData] =
    useState({
      name:
        user?.name ||
        getCurrentUser()?.name ||
        "",

      email:
        user?.email ||
        getCurrentUser()?.email ||
        "",
    });


  const [loading, setLoading] =
    useState(true);


  const [saving, setSaving] =
    useState(false);


  const [message, setMessage] =
    useState("");


  const [error, setError] =
    useState("");


  // ==================================================
  // LOAD PROFILE
  // ==================================================

  useEffect(() => {

    const loadProfile = async () => {

      const savedUser =
        user || getCurrentUser();


      if (!savedUser?.id) {

        setLoading(false);

        return;
      }


      try {

        const response =
          await getUser(
            savedUser.id
          );


        const profile =
          response.user ||
          response;


        const updatedUser = {
          ...savedUser,
          ...profile,
        };


        setCurrentUser(
          updatedUser
        );


        setFormData({
          name:
            updatedUser.name ||
            "",

          email:
            updatedUser.email ||
            "",
        });


        // Update App state only
        // if setUser was provided.

        if (
          typeof setUser ===
          "function"
        ) {

          setUser(
            updatedUser
          );
        }


        localStorage.setItem(
          "moveitUser",
          JSON.stringify(
            updatedUser
          )
        );

      } catch (err) {

        setError(
          getErrorMessage(
            err,
            "Unable to load your profile."
          )
        );

      } finally {

        setLoading(false);

      }
    };


    loadProfile();

  }, [user, setUser]);


  // ==================================================
  // HANDLE INPUT
  // ==================================================

  const handleChange = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target;


    setFormData(
      (previous) => ({
        ...previous,

        [name]: value,
      })
    );


    setMessage("");
    setError("");
  };


  // ==================================================
  // SAVE PROFILE
  // ==================================================

  const handleSubmit =
    async (event) => {

      event.preventDefault();

      setMessage("");
      setError("");


      if (!formData.name.trim()) {

        setError(
          "Name is required."
        );

        return;
      }


      if (!currentUser?.id) {

        setError(
          "User account could not be found."
        );

        return;
      }


      setSaving(true);


      try {

        const response =
          await updateUser(
            currentUser.id,
            {
              name:
                formData.name.trim(),
            }
          );


        const updatedProfile =
          response.user ||
          response;


        const updatedUser = {
          ...currentUser,
          ...updatedProfile,

          name:
            updatedProfile.name ||
            formData.name.trim(),
        };


        setCurrentUser(
          updatedUser
        );


        if (
          typeof setUser ===
          "function"
        ) {

          setUser(
            updatedUser
          );
        }


        localStorage.setItem(
          "moveitUser",
          JSON.stringify(
            updatedUser
          )
        );


        setFormData(
          (previous) => ({
            ...previous,

            name:
              updatedUser.name,
          })
        );


        setMessage(
          "Profile updated successfully."
        );

      } catch (err) {

        setError(
          getErrorMessage(
            err,
            "Unable to update your profile."
          )
        );

      } finally {

        setSaving(false);

      }
    };


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {

    return (
      <div className="page-container">

        <div className="loading-state">

          Loading profile...

        </div>

      </div>
    );
  }


  // ==================================================
  // NO USER
  // ==================================================

  if (!currentUser) {

    return (
      <div className="page-container">

        <div className="empty-state">

          <h2>
            Please log in
          </h2>


          <p>
            You need to be logged in
            to view your profile.
          </p>


          <button
            type="button"
            onClick={() =>
              navigate("login")
            }
            className="primary-button"
          >
            Go to Login
          </button>

        </div>

      </div>
    );
  }


  // ==================================================
  // PROFILE
  // ==================================================

  return (
    <div className="page-container">

      <div className="profile-page">

        {/* PROFILE HEADER */}

        <div className="profile-header">

          <div>

            <p className="page-eyebrow">
              Account
            </p>


            <h1>
              My Profile
            </h1>


            <p>
              Manage your MoveIt
              account information.
            </p>

          </div>

        </div>


        {/* PROFILE CONTENT */}

        <div className="profile-content">

          {/* PROFILE SUMMARY */}

          <div className="profile-card">

            <div className="profile-avatar">

              {formData.name
                ? formData.name
                    .charAt(0)
                    .toUpperCase()
                : "U"}

            </div>


            <h2>

              {formData.name ||
                "MoveIt User"}

            </h2>


            <p>
              {formData.email}
            </p>


            <span className="profile-role">

              {currentUser.role ===
              "driver"
                ? "Driver"
                : "Customer"}

            </span>

          </div>


          {/* PROFILE FORM */}

          <div className="profile-form-card">

            <h2>
              Personal Information
            </h2>


            <p className="form-description">

              Update the information
              associated with your
              MoveIt account.

            </p>


            {/* SUCCESS MESSAGE */}

            {message && (

              <div className="success-message">

                {message}

              </div>

            )}


            {/* ERROR MESSAGE */}

            {error && (

              <div className="error-message">

                {error}

              </div>

            )}


            <form
              onSubmit={
                handleSubmit
              }
            >

              {/* NAME */}

              <div className="form-group">

                <label htmlFor="name">
                  Full Name
                </label>


                <input
                  id="name"
                  name="name"
                  type="text"
                  value={
                    formData.name
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter your name"
                  required
                />

              </div>


              {/* EMAIL */}

              <div className="form-group">

                <label htmlFor="email">
                  Email Address
                </label>


                <input
                  id="email"
                  name="email"
                  type="email"
                  value={
                    formData.email
                  }
                  disabled
                />


                <small>

                  Your email address
                  cannot be changed
                  from your profile.

                </small>

              </div>


              {/* ROLE */}

              <div className="form-group">

                <label htmlFor="role">
                  Account Type
                </label>


                <input
                  id="role"
                  type="text"
                  value={
                    currentUser.role ===
                    "driver"
                      ? "Driver"
                      : "Customer"
                  }
                  disabled
                />

              </div>


              {/* ACTIONS */}

              <div className="profile-actions">

                <button
                  type="submit"
                  className="primary-button"
                  disabled={saving}
                >

                  {saving
                    ? "Saving..."
                    : "Save Changes"}

                </button>


                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {

                    if (
                      currentUser.role ===
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

                  }}
                >

                  Cancel

                </button>

              </div>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}


export default Profile;