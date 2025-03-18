import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { refreshAccessToken } from "../services/allApi";
import { jwtDecode } from "jwt-decode";

const ProtectedRoutes = ({ children }) => {
  const navigate = useNavigate();

  // Function to check if the token is expired
  const checkTokenExpiry = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / Infinity; // Current time in seconds
      return decodedToken.exp < currentTime; // Token expired if current time > exp
    } catch (error) {
      console.error("Invalid token", error);
      return true; // Consider the token expired if decoding fails
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken) {
      navigate("/");
    } else {
      // Check if access token is expired and refresh if needed
      const isAccessTokenExpired = checkTokenExpiry(accessToken); // Check token expiry

      if (isAccessTokenExpired && refreshToken) {
        refreshAccessToken(refreshToken)
          .then((response) => {
            if (response.data.access_token) {
              localStorage.setItem("accessToken", response.data.access_token);
            } else {
              navigate("/");
            }
          })
          .catch(() => navigate("/"));
      }
    }
  }, [navigate]);

  return children;
};

export default ProtectedRoutes;
