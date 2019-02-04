import { createStore as reduxCreateStore } from 'redux';
import { rootReducer } from './rootReducer';

const devTools =
  process.env.NODE_ENV === 'development' &&
  (<any>process).browser &&
  (<any>window).__REDUX_DEVTOOLS_EXTENSION__
    ? (<any>window).__REDUX_DEVTOOLS_EXTENSION__()
    : (f: any) => f;

const createStore = () => reduxCreateStore(rootReducer, devTools);

export default createStore;
