import {configureStore} from '@reduxjs/toolkit'
import starsReducer from './features/stars/starsSlice'
import tasksReducer from './features/tasks/tasksSlice'


const store = configureStore({
  reducer: {
    stars: starsReducer,
    tasks: tasksReducer
  }
})

export default store
