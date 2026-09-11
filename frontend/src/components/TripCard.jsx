function TripCard({ trip, navigate }) {
  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "status-pending";

      case "assigned":
        return "status-assigned";

      case "picked_up":
        return "status-picked-up";

      case "in_transit":
        return "status-in-transit";

      case "delivered":
        return "status-delivered";

      case "cancelled":
        return "status-cancelled";

      default:
        return "";
    }
  };


  const formatStatus = (status) => {
    return status
      .replace("_", " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };


  return (
    <div className="trip-card">

      <div className="trip-card-header">

        <div>
          <span className="trip-label">
            Delivery #{trip.id}
          </span>

          <h3>
            {trip.package_description}
          </h3>
        </div>

        <span
          className={`trip-status ${getStatusClass(
            trip.status
          )}`}
        >
          {formatStatus(trip.status)}
        </span>

      </div>


      <div className="trip-route">

        <div className="location-item">

          <div className="location-dot pickup-dot">
            ●
          </div>

          <div>
            <span>Pickup</span>

            <strong>
              {trip.pickup_location}
            </strong>
          </div>

        </div>


        <div className="route-line"></div>


        <div className="location-item">

          <div className="location-dot delivery-dot">
            ●
          </div>

          <div>
            <span>Delivery</span>

            <strong>
              {trip.delivery_location}
            </strong>
          </div>

        </div>

      </div>


      <div className="trip-card-footer">

        <span>
          {trip.driver_id
            ? "Driver assigned"
            : "Waiting for driver"}
        </span>

        <button
          onClick={() =>
            navigate("trip-details")
          }
        >
          View Details →
        </button>

      </div>

    </div>
  );
}

export default TripCard;