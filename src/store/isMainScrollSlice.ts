import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type isScroll = {
    isScroll: boolean
}

const initialState: isScroll = {
    isScroll: true
};


const isMainScrollSlice = createSlice({
    name: 'isMainScrollSlice',
    initialState,
    reducers: {
        setChangeScroll(state, action: PayloadAction<boolean>){
            state.isScroll = action.payload;
            if(state.isScroll){
                document.body.style.overflow = 'auto'
            }
            else{
                document.body.style.overflow = 'hidden'
            }
        }
    }
})

export const {setChangeScroll} = isMainScrollSlice.actions;

export default isMainScrollSlice.reducer;