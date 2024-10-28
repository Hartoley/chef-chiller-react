import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value:[],
    issaving: false,
    errormsg: null,
    
}

const adminlogins = createSlice({
    name:"admins",
    initialState,

    reducers:{
        saving:(state)=>{
            state.value= []
            state.issaving = true
            state.errormsg = null
        },
        successful:(state, actions)=>{
            state.value= actions.payload
            state.issaving = false
            state.errormsg = null
        },

        failed:(state, actions)=>{
            state.value= []
            state.issaving = true
            state.errormsg = actions.payload
            
        }
    }
})

export default adminlogins.reducer
export const {saving, successful, failed} = adminlogins.actions