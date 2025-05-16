//store.d.ts
import { Store } from "@reduxjs/toolkit";
import { Persistor } from "redux-persist";
import { makeStore } from "./makeStore";

// Infer the types of the store and state
export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;

declare const store: AppStore;
declare const persistor: Persistor;

export { store, persistor };