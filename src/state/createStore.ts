import { createStore as reduxCreateStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { rootReducer } from './rootReducer';

const devTools =
  process.env.NODE_ENV === 'development' &&
  (<any>process).browser &&
  (<any>window).__REDUX_DEVTOOLS_EXTENSION__
    ? (<any>window).__REDUX_DEVTOOLS_EXTENSION__()
    : (f: any) => f;

const persistedReducer = persistReducer(
  {
    key: 'root',
    storage,
  },
  rootReducer,
);

export const createStore = () => {
  const store = reduxCreateStore(persistedReducer, devTools);
  const persistor = persistStore(store);

  return { store, persistor };
};
