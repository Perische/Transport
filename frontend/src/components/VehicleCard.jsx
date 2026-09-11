function VehicleCard({
  vehicle,
  onDelete,
  onToggleAvailability,
  actionLoading,
}) {
  return (
    <div className="vehicle-card">

      <div className="vehicle-card-header">

        <div className="vehicle-icon">
          🚚
        </div>

        <div className="vehicle-title">

          <span>
            {vehicle.vehicle_type}
          </span>

          <h3>
            {vehicle.model || "Vehicle"}
          </h3>

        </div>

        <span
          className={
            vehicle.is_available
              ? "vehicle-availability available"
              : "vehicle-availability unavailable"
          }
        >
          {vehicle.is_available
            ? "Available"
            : "Unavailable"}
        </span>

      </div>


      <div className="vehicle-details">

        <div className="vehicle-detail">

          <span>
            Registration
          </span>

          <strong>
            {vehicle.registration_number}
          </strong>

        </div>


        <div className="vehicle-detail">

          <span>
            Capacity
          </span>

          <strong>
            {vehicle.capacity
              ? `${vehicle.capacity} kg`
              : "Not specified"}
          </strong>

        </div>

      </div>


      <div className="vehicle-actions">

        <button
          className="secondary-button"
          onClick={() =>
            onToggleAvailability(vehicle)
          }
          disabled={actionLoading}
        >
          {vehicle.is_available
            ? "Mark Unavailable"
            : "Mark Available"}
        </button>


        <button
          className="danger-button"
          onClick={() =>
            onDelete(vehicle.id)
          }
          disabled={actionLoading}
        >
          Delete
        </button>

      </div>

    </div>
  );
}


export default VehicleCard;