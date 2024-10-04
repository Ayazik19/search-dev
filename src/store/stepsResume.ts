import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useReducer } from "react";

interface StepResume{
    stepOne: boolean,
    stepTwo: boolean,
    stepThree: boolean,
    stepFour: boolean,
    stepFive: boolean
}

type stepResume = {
    stepsResume : StepResume
}

type stateStepsResume = {
    stateStepsResume: stepResume
}

const initialState: stateStepsResume = {
    stateStepsResume:{
        stepsResume: {
            stepOne: true,
            stepTwo: false,
            stepThree: false,
            stepFour: false,
            stepFive: false
        }
    }
}

const stepsResumeSlice = createSlice({
    name: 'stepsResume',
    initialState,
    reducers: {
        setNextStep(state){
            const {stepOne, stepTwo, stepThree, stepFour, stepFive} = state.stateStepsResume.stepsResume;
            if(stepOne && !stepTwo && !stepThree && !stepFour&& !stepFive){
                state.stateStepsResume.stepsResume.stepOne = false;
                state.stateStepsResume.stepsResume.stepTwo = true;
            }
            else if(!stepOne && stepTwo && !stepThree && !stepFour&& !stepFive){
                state.stateStepsResume.stepsResume.stepTwo = false;
                state.stateStepsResume.stepsResume.stepThree = true;
            }
            else if(!stepOne && !stepTwo && stepThree && !stepFour&& !stepFive){
                state.stateStepsResume.stepsResume.stepThree = false;
                state.stateStepsResume.stepsResume.stepFour = true;
            }
            else if(!stepOne && !stepTwo && !stepThree && stepFour && !stepFive){
                state.stateStepsResume.stepsResume.stepFour = false;
                state.stateStepsResume.stepsResume.stepFive = true;
            }
            else{
                return state;
            }
        },
        setBackStep(state){
            const {stepOne, stepTwo, stepThree, stepFour, stepFive} = state.stateStepsResume.stepsResume;
            if(stepTwo && !stepThree && !stepFour && !stepFive){
                state.stateStepsResume.stepsResume.stepTwo = false;
                state.stateStepsResume.stepsResume.stepOne= true;
            }
            else if(!stepTwo && stepThree && !stepFour && !stepFive){
                console.log('aaaa')
                state.stateStepsResume.stepsResume.stepThree = false;
                state.stateStepsResume.stepsResume.stepTwo= true;
            }
            else if(!stepTwo && !stepThree && stepFour && !stepFive){
                state.stateStepsResume.stepsResume.stepFour = false;
                state.stateStepsResume.stepsResume.stepThree = true;
            }
            else if(!stepTwo && !stepThree && !stepFour && stepFive){
                state.stateStepsResume.stepsResume.stepFive = false;
                state.stateStepsResume.stepsResume.stepFour = true;
            }
            else{
                return state;
            }
        }
    }
})

export const {setNextStep, setBackStep} = stepsResumeSlice.actions;

export default stepsResumeSlice.reducer;