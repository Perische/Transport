function ProtectedRoute({
  user,
  navigate,
  allowedRoles = [],
  children,
}) {

  // ================================================
  // NOT LOGGED IN
  // ================================================

  if (!user) {

    navigate("login");

    return null;
  }


  // ================================================
  // ROLE CHECK
  // ================================================

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {

    if (user.role === "driver") {

      navigate("driver-dashboard");

    } else {

      navigate("dashboard");

    }

    return null;
  }


  // ================================================
  // AUTHORIZED
  // ================================================

  return children;
}


export default ProtectedRoute;