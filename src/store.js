import {configureStore} from '@reduxjs/toolkit'
import starsReducer from './features/stars/starsSlice'
import tasksReducer from './features/tasks/tasksSlice'
import { combineReducers } from 'redux'


const appReducer = combineReducers({
  stars: starsReducer,
  tasks: tasksReducer
})

export const rootReducer = (state, action) => {
  if (action.type === 'EMPTY_STORE') {
    return appReducer(undefined, action)
  }

  return appReducer(state, action)
}
const store = configureStore({
  reducer: rootReducer
})

export default store
