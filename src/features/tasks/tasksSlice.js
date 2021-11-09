import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {client} from '../../api/client'

const initialState = {
  status: 'idle',
  tabViewModes: {},
  curTaskId: 0,
  curStarId: 0,
  project:[],
  taskType:[]
}

export const initViewModes = createAsyncThunk('tasks/initViewModes', async (starIds) => {
  const viewModes = {}
  console.log('Initializeing modes')
  const editModeList = starIds.map(starId => {
    viewModes[starId] = 'view'
  })
  return viewModes
})
export const getProjectData = createAsyncThunk('tasks/getProjectData',async()  => {
  const response = await client.post('https://softforceapps.com:3000/api/projectList',{})
  console.log(response)
  return response
})

export const getTaskType = createAsyncThunk('tasks/getTaskType',async()  => {
  const response = await client.get('https://softforceapps.com:3000/api/commonCodes')
  console.log(response)
  var res=[]
  response.map(i=>{
    res.push(i.task_type)
  })
  return res
})

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState: initialState,
  reducers: {
    setCurStarId(state, action) {
      state.curStarId = action.payload
      // console.log(state.curStarId)
    },
    setTabMode(state, action) {
      console.log('in setTabMode to:' + action.payload.mode + ',for:' + action.payload.starId)
      state.tabViewModes[action.payload.starId] = action.payload.mode
    },
    setTaskViewMode(state, action) {
      state.cusTaskId = action.payload.taskId
      state.tabViewModes[state.custTaskId] = 'view'
    },
    setTaskMode(state, action) { // console.log('in setTaskEditMode action, payload=' + action.payload)
      state.custTaskId = action.payload.taskId
      state.tabViewModes[action.payload.starId] = action.payload.mode
    }
  },
  extraReducers: {
    [initViewModes.fulfilled]: (state, action) => {
      state.tabViewModes = action.payload
      // console.log("in initViewModes.fulfilled")
      // console.log(action.payload)
      state.status = 'succeeded'
    },
    [getProjectData.fulfilled]:(state,action)=>{
      state.project=action.payload
      state.status='idle'
    },
    [getTaskType.fulfilled]:(state,action)=>{
      state.taskType=action.payload
      state.status='idle'
    }
  }
})

export default tasksSlice.reducer
export const selectViewMode = (state, starId) => state.tasks.tabViewModes[starId]
export const selectProjects =(state)=>state.tasks.project.map(i=>{
  return Object.keys(i)[0]
})
export const selectModules=(state,proj)=>{
  var m=[]
  state.tasks.project.map(i=>{
    for (var key in i) {
      if(key==proj){
        i[key].map(i=>{
          m.push(i.module_code)
      })}
    }
  })
  return m;
}
export const selectTaskTypes=(state)=>state.tasks.taskType
export const selectTasksStatus = state => state.tasks.status
export const {setCurStarId, setTaskViewMode, setTaskMode: setTaskEditMode, setTabMode} = tasksSlice.actions
