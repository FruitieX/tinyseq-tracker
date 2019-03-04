import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { createStore } from './src/state/createStore';

const { store, persistor } = createStore();

export default ({ element }: { element: React.ReactNode }) => (
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      {element}
    </PersistGate>
  </Provider>
);
