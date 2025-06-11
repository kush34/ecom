import axios from "axios";

axios.interceptors.response.use(async function (response) {
    if(response.status === 403){
        const request = await axios.post(`${import.meta.env.VITE_Backend_URL}/user/refresh-token`);
        console.log(request);
    }
    return response;
  }, function (error) {
    console.log(`refreshtoken error`)
    return Promise.reject(error);
  });