import axios from "axios";

export const axiosInstace = axios.create({
  baseURL:import.meta.env.VITE_Backend_URL,
  withCredentials:true
})

axiosInstace.interceptors.request.use(
  async function (config) {
    const token = localStorage.getItem("accessToken");
    if (token) {
      console.log(token)
      const parsedToken = JSON.parse(token);
      config.headers.Authorization = `Bearer ${parsedToken}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

  axiosInstace.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        // Refresh the token
        const res = await axios.post(
          `${import.meta.env.VITE_Backend_URL}/user/refresh-token`,
          null,
          { withCredentials: true }
        );

        const newToken = res.data.accessToken;
        localStorage.setItem("accessToken", JSON.stringify(newToken));

        // Retry the failed request with the new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstace(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);