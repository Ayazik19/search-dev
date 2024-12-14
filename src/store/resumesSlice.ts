import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResumeState, Resume, BasicInfo, Education, Positions, Date, Post, ProfileLinks, Projects, skills } from "../types/typesResume";
const resumesSlice = createSlice({
    name: "resume",
    initialState,
    reducers: {
        setNameResume(state, action: PayloadAction<string>) {
            if (state.resumesState.length > 0) {
                state.resumesState[0].nameResume = action.payload;
            }
            else {
                const { resumesState } = state;
                const lengthArr = resumesState?.length || 0;

                const validResumesState = Array.isArray(resumesState) ? resumesState : [];

                const newResume = {
                    idResume: lengthArr + 1,
                    nameResume: action.payload,
                    isResumeCompleted: false,
                };
                state.resumesState = [...validResumesState, newResume];
            }
        },
        setBasicInfo(state, action: PayloadAction<BasicInfo>) {
            state.resumesState.forEach((item: Resume) => {
                item.basicInfo = {
                    ...item.basicInfo,
                    ...action.payload,
                };
            })
        },
        setEducationClass(state, action: PayloadAction<string>) {
            state.resumesState.forEach((item: Resume) => {

                const education: Education = {
                    educationClass: action.payload
                }

                item.education = education;
            })
        },
        deleteResume(state) {
            state.resumesState = [];
        },
    },
});

export const { setEducationClass, setEducation, deleteResume } = resumesSlice.actions;
export default resumesSlice.reducer;