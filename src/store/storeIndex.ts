import { combineReducers, configureStore } from "@reduxjs/toolkit";
import searchResumesReducer from './resumesSlice';
import stepsResumeReducer from "./stepsResume";

import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from "redux-persist/lib/storage";


const rootReducer = combineReducers({
    resumes: searchResumesReducer,
    stepsResume: stepsResumeReducer
})

const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer) 


export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }
      })
  });

export default store;

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>
export type AddDispatch = typeof store.dispatch;