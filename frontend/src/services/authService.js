// ==================================================
// AUTH SERVICE
// ==================================================
//
// Handles:
// - Login
// - Registration
// - Logout
// - JWT token storage
// - Logged-in user storage
// - Authentication checks
//
// ==================================================


import {
  loginUser,
  registerUser,
} from "./api";


// ==================================================
// STORAGE KEYS
// ==================================================

const TOKEN_KEY =
  "moveitToken";

const USER_KEY =
  "moveitUser";


// ==================================================
// LOGIN
// ==================================================

export const login = async (
  email,
  password
) => {

  const data =
    await loginUser({

      email:
        email.trim(),

      password,

    });


  // Save JWT token
  localStorage.setItem(
    TOKEN_KEY,
    data.access_token
  );


  // Save authenticated user
  localStorage.setItem(
    USER_KEY,
    JSON.stringify(
      data.user
    )
  );


  return data;
};


// ==================================================
// REGISTER
// ==================================================

export const register = async (
  userData
) => {

  const data =
    await registerUser(
      userData
    );


  // Save JWT token
  localStorage.setItem(
    TOKEN_KEY,
    data.access_token
  );


  // Save authenticated user
  localStorage.setItem(
    USER_KEY,
    JSON.stringify(
      data.user
    )
  );


  return data;
};


// ==================================================
// LOGOUT
// ==================================================

export const logout = () => {

  localStorage.removeItem(
    TOKEN_KEY
  );


  localStorage.removeItem(
    USER_KEY
  );
};


// ==================================================
// GET TOKEN
// ==================================================

export const getToken = () => {

  return localStorage.getItem(
    TOKEN_KEY
  );
};


// ==================================================
// GET CURRENT USER
// ==================================================

export const getCurrentUser = () => {

  const savedUser =
    localStorage.getItem(
      USER_KEY
    );


  if (!savedUser) {

    return null;
  }


  try {

    return JSON.parse(
      savedUser
    );

  } catch (error) {

    // Remove corrupted user data

    localStorage.removeItem(
      USER_KEY
    );

    localStorage.removeItem(
      TOKEN_KEY
    );

    return null;
  }
};


// ==================================================
// CHECK AUTHENTICATION
// ==================================================

export const isAuthenticated = () => {

  const token =
    getToken();

  const user =
    getCurrentUser();


  return Boolean(
    token && user
  );
};


// ==================================================
// GET USER ROLE
// ==================================================

export const getUserRole = () => {

  const user =
    getCurrentUser();


  if (!user) {

    return null;
  }


  return user.role;
};


// ==================================================
// CHECK CUSTOMER
// ==================================================

export const isCustomer = () => {

  return (
    getUserRole() ===
    "customer"
  );
};


// ==================================================
// CHECK DRIVER
// ==================================================

export const isDriver = () => {

  return (
    getUserRole() ===
    "driver"
  );
};


// ==================================================
// CLEAR AUTH DATA
// ==================================================

export const clearAuth = () => {

  localStorage.removeItem(
    TOKEN_KEY
  );


  localStorage.removeItem(
    USER_KEY
  );
};