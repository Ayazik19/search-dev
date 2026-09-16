import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserAgreements{
    isFindDev: boolean,
    isFindWork: boolean
}

interface UserQualitySite{
    date: string | null,
    quality: number | null
}

type User = {
    userAgreements: UserAgreements,
    userQualitySite: UserQualitySite
}

type userState = {
    userState: User
}

const initialState: userState = {
    userState: {
        userAgreements: {
            isFindDev: true,
            isFindWork: false
        },
        userQualitySite:{
            date: null,
            quality: null
        } 
    }
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserQuality(state, action: PayloadAction<number>){
            state.userState.userQualitySite.date = new Date().toISOString();;
            state.userState.userQualitySite.quality = action.payload;
        },
        setChangeIsFindDev(state, action: PayloadAction<boolean>){
            state.userState.userAgreements.isFindDev = action.payload;
            state.userState.userAgreements.isFindWork = false;
        },
        setChangeIsFindWork(state, action: PayloadAction<boolean>){
            state.userState.userAgreements.isFindWork = action.payload;
            state.userState.userAgreements.isFindDev = false;
        },
    },
});

export const {setChangeIsFindDev, setChangeIsFindWork, setUserQuality} = userSlice.actions;

export default userSlice.reducer;