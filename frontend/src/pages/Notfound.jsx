// ==================================================
// NOT FOUND PAGE
// ==================================================

function NotFound({
  navigate,
}) {

  const handleGoHome = () => {
    navigate("home");
  };


  return (
    <div className="not-found-page">

      <div className="not-found-container">

        <div className="not-found-code">
          404
        </div>


        <h1>
          Page Not Found
        </h1>


        <p>
          Sorry, the page you are looking
          for does not exist or may have
          been moved.
        </p>


        <button
          type="button"
          onClick={handleGoHome}
          className="primary-button"
        >
          Go Home
        </button>

      </div>

    </div>
  );
}


export default NotFound;