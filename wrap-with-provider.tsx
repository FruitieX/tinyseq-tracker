import React from 'react';
import { Provider } from 'react-redux';

import createStore from './src/state/createStore';

const store = createStore();

export default ({ element }: { element: React.ReactNode }) => (
  <Provider store={store}>{element}</Provider>
);
