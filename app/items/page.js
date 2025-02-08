"use client";
//import CreateItem from "../../components/create-item";
//import ItemForm from "../../components/item-form";
/*import FetchImg from "../../components/fetchImg";
import DisplayImages from "../../components/displayImages";
import DisplayDetails from "../../components/displayDetails";*/
import { Provider } from "react-redux";
import store from "../../redux/store";

export default function ItemsList() {
  return (
    <Provider store={store}>
      {/*<FetchImg />
        <DisplayImages />
        <DisplayDetails itemId={1} />*/}
    </Provider>
  );
}
