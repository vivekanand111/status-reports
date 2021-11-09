import {client} from '../../api/client'
import {createSlice, createAsyncThunk, createEntityAdapter, createSelector} from '@reduxjs/toolkit'
import {setTabMode} from '../tasks/tasksSlice'

const starsAdapter = createEntityAdapter()
export const StarStatus = Object.freeze({
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCEEDED: 'suceeded',
  FAILED: 'failed',
  SUBMITTED: 'submitted'
})

const dateformat1=(date)=>{
  var d = new Date(date)
  return d.toUTCString().substring(5, 16)
}
const dateformat2 = (date) => {
  var d = new Date(date)
  return d.toISOString().split('T')[0]
}


const initialState = starsAdapter.getInitialState({status: StarStatus.IDLE, error: ''})

export const fetchStars = createAsyncThunk('stars/fetchStars', async (userId) => {
  console.log('Fetching reports for user ' + userId)
  // userId=1
  let url = '/api/stars/' + userId
  const response = await client.get(`https://softforceapps.com:3000/api/reports/${userId}`)
  //const response = await client.get(`http://localhost:8080/api/reports/${userId}`)
  // console.log(response)

  response.map(star => {
    star.weekStart = dateformat1(star.weekStart)
    star.tasks.map(task => {
      task.task_date =dateformat2(task.task_date)
      task.user_id=userId
    })
  })
  return response
})

export const submitStar = createAsyncThunk('stars/submitStar', async (id) => {
  const response = await client.put('https://softforceapps.com:3000/api/submit', {id: id})

  // console.log(response)
  return response
})

export const addTask = createAsyncThunk('tasks/addTask', async obj => {
  // console.log("POST operation Handling")
  // console.log(obj)
  const response = await client.post('https://softforceapps.com:3000/api/Tasks', obj)
  //const response = await client.post('http://localhost:8080/api/Tasks', obj)
  response.map(task => {
    task.task_date = dateformat2(task.task_date)
  })
  /* if(response==="Success"){
    console.log(obj)
  } */
  // state.stars.entities[starId].tasks.push(response.task)
  return response[0]
})

export const updateTask = createAsyncThunk('tasks/updateTask', async updatedTask => { // console.log("Put operation Handling")
  console.log(updatedTask)
  const response = await client.put(`https://softforceapps.com:3000/api/Tasks/${
    updatedTask.id
  }`, updatedTask)
  // console.log(response[0])
  response.map(task => {
    task.task_date = dateformat2(task.task_date)
  })
  // state.stars.entities[starId].tasks.push(response.task)

  return response[0]
})

export const deleteTask = createAsyncThunk('tasks/deleteTask', async task => {
  const response = await client.delete('https://softforceapps.com:3000/api/Tasks/' + task.id)

  console.log(response)
  response.star_id = task.star_id
  return response
})

export const starSlice = createSlice({
  name: 'stars',
  initialState,
  reducers: {
    starSubmitted(state, action) {
      const id = action.payload
      let star = state.entities[id]
      star.status = StarStatus.SUBMITTED
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchStars.pending, (state, action) => {
      state.status = StarStatus.LOADING
    }).addCase(fetchStars.fulfilled, (state, action) => {
      starsAdapter.setAll(state, action.payload)
      console.log(action.payload)
      state.status = StarStatus.SUCCEEDED
    }).addCase(fetchStars.rejected, (state, action) => {
      console.log(action.payload)
      state.status = StarStatus.FAILED
      state.error = action.payload
    }).addCase(addTask.fulfilled, (state, action) => {
      console.log(state.entities[action.payload.star_id].tasks.push(action.payload))
      // starsAdapter.upsertOne(state,action.payload)
      // state.tasks.push(action.payload)
    }).addCase(updateTask.fulfilled, (state, action) => {
      alert("Updated Successfully")
      console.log(action.payload)
      const taskId = action.payload.id
      const j = state.entities[action.payload.star_id].tasks.findIndex(i => i.id === taskId)
      console.log(j)
      state.entities[action.payload.star_id].tasks[j] = action.payload
      // console.log(starsAdapter)
      // starsAdapter.updateOne(state,action.payload['task'])
      // state.tasks.push(action.payload)
    }).addCase(submitStar.fulfilled, (state, action) => { // console.log(action.payload.status)
      state.entities[action.payload.id].status = action.payload.status
    }).addCase(deleteTask.fulfilled, (state, action) => {
      const taskId = parseInt(action.payload.Task_id)
      const j = state.entities[action.payload.star_id].tasks.findIndex(i => i.id === taskId)
      state.entities[action.payload.star_id].tasks.splice(j, 1)
      // console.log(j)
      // state.entities[action.payload.star_id].tasks.splice(
    })
  }
})

export const {selectAll: selectStars, selectById: selectStarById} = starsAdapter.getSelectors(state => state.stars)
export const selectStarIds = createSelector(selectStars, stars => stars.map(star => star.id))
export const selectCurrentTask = createSelector(selectStars, state => state.tasks, (stars, tasks) => {
  stars.forEach(star => {
    star.tasks.forEach(task => {
      if (task.id == tasks.curTaskId) {
        return task
      }
    })
  })
})
export const selectTask = (state, starId, taskId) => {
  state.stars.entities[starId].tasks.find(task => task.id === taskId)
}
export default starSlice.reducer
