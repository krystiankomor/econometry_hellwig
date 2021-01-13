import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
// eslint-disable-next-line import/no-cycle
import matrixBoilerSlice from './utils/matrixBoilerSlice';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    matrix: matrixBoilerSlice,
  });
}
