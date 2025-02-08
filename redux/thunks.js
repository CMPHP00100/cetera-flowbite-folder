import axios from "axios";
import { fetchStart, fetchSuccess, fetchFailure } from "./store";

export const fetchApiData = () => async (dispatch) => {
  dispatch(fetchStart());

  try {
    const response = await axios.get("/api/imgfetch");
    //"https://jsonplaceholder.typicode.com/posts",

    /*`https://api.cloudinary.com/v1_1/${cloudName}/resources/image`,
      {
        auth: {
          username: apiKey,
          password: apiSecret,
        },
      },*/

    //console.log(response.data);
    dispatch(fetchSuccess(response.data.resources));
  } catch (error) {
    dispatch(fetchFailure(error.message));
  }
};
