import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import store, {persistor} from './store/storeIndex';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);