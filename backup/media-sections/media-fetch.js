import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchApiData } from "../redux/thunks";

const FetchImg = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchApiData());
  }, [dispatch]);

  return <p>Fetching images...</p>;
};

export default FetchImg;
