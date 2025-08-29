import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      {" "}
      {/* Darker background */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-50">404</h1>{" "}
        {/* Lighter text for heading */}
        <p className="text-xl text-gray-400 mb-4">Oops! Page not found</p>{" "}
        {/* Lighter text for paragraph */}
        <a href="/" className="text-blue-400 hover:text-blue-300 underline">
          {" "}
          {/* Slightly lighter blue for links */}
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
