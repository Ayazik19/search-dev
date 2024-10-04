import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResumeState, Resume, BasicInfo, Education } from "../types/typesResume";
import { FormValues } from "../components/componentsCreatePage/componentsStepsResume/stepResumeFour";


const initialState: ResumeState = {
    resumesState: []
};

const resumesSlice = createSlice({
    name: "resume",
    initialState,
    reducers: {
        setNameResume(state, action: PayloadAction<string>) {
            if (state.resumesState.length > 0) {
                state.resumesState.some((item: Resume) => {
                    const isResumeCompleted = item.isResumeCompleted;

                    if (isResumeCompleted) {
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
                    else {
                        return state;
                    }
                })
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
                const isResumeCompleted = item.isResumeCompleted;

                const { resumesState } = state;

                item.basicInfo = {
                    ...item.basicInfo,
                    ...action.payload,
                };
            })
        },
        setEducationClass(state, action: PayloadAction<string>){
            state.resumesState.forEach((item: Resume) => {

                const education: Education = {
                    educationClass: action.payload
                }
        
                item.education = education;
            })
        },
        setEducation(state, action: PayloadAction<FormValues>){
            const payloadObject = action.payload;


            if (state.resumesState[0] && state.resumesState[0].education) {
                state.resumesState[0].education.nameInstituation = payloadObject.nameInstituation;
                state.resumesState[0].education.faculty = payloadObject.faculty;
                state.resumesState[0].education.yearGraduation = payloadObject.yearGradiation; 
            }
        },
        deleteResume(state) {
            state.resumesState = [];
        },
    },
});

export const { setNameResume, setBasicInfo, setEducationClass, setEducation, deleteResume } = resumesSlice.actions;
export default resumesSlice.reducer;