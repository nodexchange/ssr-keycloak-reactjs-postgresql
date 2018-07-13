import isDev from 'isdev';
import isNode from 'detect-node';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { serviceAlert } from '@middlewares/redux';
import todos from '@pages/todos/reducers';

const isClient = (state = false, action) => (state = isNode !== true);

const isFetching = (state = false, action) =>
  (state =
    action.type === 'INIT_FULFILLED' &&
    action.meta &&
    action.meta.isFetching !== false);

export const rootReducer = combineReducers({
  isClient,
  isFetching,
  todos
});

export default function storeFactory(preloadedState) {
  const middlewares = [thunk, serviceAlert()];

  if (isDev) {
    middlewares.push(
      createLogger({
        duration: true
      })
    );
  }

  const store = createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(...middlewares)
  );

  if (module.hot) {
    module.hot.accept('./store', () => {
      const { nextRootReducer } = require('./store');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
