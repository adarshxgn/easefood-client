// import axios from "axios";
// // httprequest type means type of http call (GET,POST,Put,Delete)
// export const commonApi = async (httpRequestType, url, reqBody, reqHeader) => {
//     const reqConfig = {
//         method: httpRequestType,
//         url: url,
//         data: reqBody,
//         headers: reqHeader ? reqHeader : {'Content-Type':'application/json'}
//     }
//     return await axios(reqConfig).then((result) => {
//         return result;
//     }).catch((err) => {
//         return err;
//     })
// }



import axios from 'axios';
import { BASE_URL } from './baseUrl';


// Create an instance of axios
const apiInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the access token to every request
apiInstance.interceptors.request.use(
  async (config) => {
    // Get the access token from localStorage
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle expired token
apiInstance.interceptors.response.use(
  response => response,
  async (error) => {
    // Check if the error is due to an expired token (HTTP 401)
    if (error.response && error.response.status === 401) {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          // Try to refresh the token using the refresh token
          const refreshResponse = await axios.post(`${BASE_URL}/api/refresh-token`, { refresh_token: refreshToken });

          if (refreshResponse.status === 200) {
            const { access_token } = refreshResponse.data;

            // Save the new access token in localStorage
            localStorage.setItem("accessToken", access_token);

            // Retry the failed request with the new access token
            error.config.headers['Authorization'] = `Bearer ${access_token}`;
            return axios(error.config);
          }
        } catch (refreshError) {
          // If refresh fails, log out the user
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          window.location.href = "/"; // Redirect to login page
        }
      }
    }

    return Promise.reject(error);
  }
);

export const commonApi = async (httpRequestType, url, reqBody, reqHeader) => {
  const reqConfig = {
    method: httpRequestType,
    url: url,
    data: reqBody,
    headers: reqHeader ? reqHeader : { 'Content-Type': 'application/json' },
  };

  return await apiInstance(reqConfig)
    .then((result) => result)
    .catch((err) => err);
};
