import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

const initialState = {
    tasksList:[],
    selectedTask:{},
    isLoading:false,
    error:''
}

const BASE_URL = 'http://localhost:8000/tasks'

export const getTasksFromServer = createAsyncThunk(
    "tasks/getTasksFromServer",
     async(_,{rejectWithValue}) => {
      return  axios.get(BASE_URL)
        .then(res => res.data)
        .catch(() => rejectWithValue({error:'No Tasks Found'}))    
           }
)

//POST 
export const addTaskToServer = createAsyncThunk(
    "tasks/addTaskToServer",
    async (task,{rejectWithValue}) => {
        return axios.post(BASE_URL,task)
               .then(res => res.data)
               .catch(() => rejectWithValue({error:'No Tasks added'}))  
    }
)

//PATCH 
export const updateTaskInServer = createAsyncThunk(
    "tasks/updateTaskInServer",
    async (task,{rejectWithValue}) => {
        return axios.patch(`${BASE_URL}/${task.id}`,task)
               .then(res => res.data)
               .catch(()=> rejectWithValue({error:'No Tasks updated'}))
    }
)

const tasksSlice = createSlice({
    name:'tasksSlice',
    initialState,
    reducers: {
        addTaskToList:(state,action) => {
            const id = Math.random() * 100
            let task = {...action.payload,id}
            state.tasksList.push(task)
        },
        removeTaskFromList:(state,action) => {
            state.tasksList = state.tasksList.filter((task) => task.id !== action.payload.id)
        },
        updateTaskInList:(state,action) => {
            state.tasksList = state.tasksList.map((task) => task.id === action.payload.id ? action.payload : task )
        },
        setSelectedTask:(state,action) => {
            state.selectedTask = action.payload
        }

    },
    extraReducers:(builder) => {
        builder
            .addCase(getTasksFromServer.pending,(state) => {
                state.isLoading = true
            })
            .addCase(getTasksFromServer.fulfilled,(state,action) => {
                state.isLoading = false
                state.error = ''
                state.tasksList = action.payload
            })
            .addCase(getTasksFromServer.rejected,(state,action) => {
                state.error = action.payload.error
                state.isLoading = false
                state.tasksList = []
            })
            .addCase(addTaskToServer.pending,(state) => {
                state.isLoading = true
            })
            .addCase(addTaskToServer.fulfilled,(state,action) => {
                state.isLoading = false
                state.error = ''
                state.tasksList.push(action.payload)
            })
            .addCase(addTaskToServer.rejected,(state,action) => {
                state.error = action.payload.error
                state.isLoading = false
            })
            .addCase(updateTaskInServer.pending,(state) => {
                state.isLoading = true
            })
            .addCase(updateTaskInServer.fulfilled,(state,action) => {
                state.isLoading = false
                state.error = ''
                state.tasksList = state.tasksList.map((task) => task.id === action.payload.id ? action.payload : task )
            })
            .addCase(updateTaskInServer.rejected,(state,action) => {
                state.error = action.payload.error
                state.isLoading = false
            })
    }

})

export const {addTaskToList,removeTaskFromList,updateTaskInList,setSelectedTask} = tasksSlice.actions

export default tasksSlice.reducer