import thunk from 'redux-thunk';
import { compose, createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { isDev } from '@config';
import { serviceAlert } from './middlewares';
import { requestActions } from './ducks/request';
import rootReducer from './ducks';

export default function configureStore(history, preloadedState = {}) {
  const middlewares = [
    // register request actions for dispatch
    // so that it's accessible in respective thunk wrappers
    thunk.withExtraArgument({ ...requestActions }),
    routerMiddleware(history),
    serviceAlert()
  ];

  // check if redux devtools extension compose available
  // apply for development environment only
  const withReduxDevtools =
    isDev &&
    typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

  // make compose enhancers
  const composeEnhancers = withReduxDevtools
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        /* specify extension’s options, if any */
      })
    : compose;

  const enhancer = composeEnhancers(applyMiddleware(...middlewares));
  const store = createStore(rootReducer(history), preloadedState, enhancer);

  if (module.hot) {
    module.hot.accept('./ducks', () => {
      const { nextRootReducer } = require('./ducks').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}