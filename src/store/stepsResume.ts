import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";



export interface StepResume {
    currentStep: number,
    status: 'beginning' | 'completed';
}
//status have 2 types: 
// - beginning - step resume
// - completed - passed resume complete

export type stepResume = {
    stepsResume: StepResume[]
}

export type stateStepsResume = {
    stateStepsResume: stepResume
}

const initialState: stateStepsResume = {
    stateStepsResume: {
        stepsResume: [{
            currentStep: 1,
            status: 'beginning'
        }],
    }
}

interface Handles {
    getStateEducationClass: () => string;
}

const stepsResumeSlice = createSlice({
    name: 'stepsResume',
    initialState,
    reducers: {
        setFalseSteps(state) {
            state.stateStepsResume.stepsResume = []; 
        },
        setFirstStep(state) {
            const arr: StepResume[] = [{
                currentStep: 1,
                status: 'beginning'
            }];
            state.stateStepsResume.stepsResume = arr;
        },
        setNextStep(state, action: PayloadAction<number>) {
            const nextStep = action.payload;
            const newStep: StepResume = {
                currentStep: nextStep,
                status: 'beginning'
            };

            let updArr: StepResume[] = [];
            const stateStepResume = state.stateStepsResume.stepsResume;

            if (stateStepResume) {
                if (stateStepResume.length > 1 ) {
                    updArr = stateStepResume?.map((item, index) => {
                        const isPrefinalItem = index === stateStepResume.length - 1;
                        if (isPrefinalItem) {
                            return {
                                ...item,
                                status: 'completed'
                            }
                        }
                        return item;
                    })
                } else {
                    updArr = stateStepResume.map(item => {
                        if (item.currentStep === nextStep - 1) {
                            return {
                                ...item,
                                status: 'completed'
                            };
                        }
                        return item;
                    });
                }
            }

            updArr.push(newStep);
            state.stateStepsResume.stepsResume = updArr;
        },
        setBackStep(state, action: PayloadAction<number>) {
            const backStep = action.payload;

            const stateStepResume = state.stateStepsResume.stepsResume;
            let updArr: StepResume[] = [];
            if (stateStepResume) {
                const lastElCurrentStep = stateStepResume[stateStepResume.length - 1]
                updArr = stateStepResume.filter(item => item.currentStep !== lastElCurrentStep.currentStep)
                updArr = updArr.map((item) => {
                    if (item.currentStep === backStep) {
                        
                        return {
                            ...item,
                            status: 'beginning'
                        }
                    }
                    return item;
                })
            }

            state.stateStepsResume.stepsResume = updArr;
        },
        setFilterStep(state, action: PayloadAction<number>){
            const filterStep = state.stateStepsResume.stepsResume.filter(step => step.currentStep !== action.payload)
            state.stateStepsResume.stepsResume = filterStep;
        },
        setCheckIsCorrectsSteps(state){
            let hasIncorrectsSteps = false;

            const stateStepsResume = state.stateStepsResume.stepsResume;
            //is unique or normal numbers steps
            if(stateStepsResume && stateStepsResume.length > 0 && stateStepsResume.length <= 6){
                let arrUniqueSteps: number[] = [];

                stateStepsResume.forEach(steps => {
                    const currentStep = steps.currentStep;

                    const findStep = arrUniqueSteps.find(el => el === currentStep);
                    const isNormalNumber = currentStep >= 0 && currentStep <= 6;
                    if(findStep || !isNormalNumber){
                        hasIncorrectsSteps = true;
                    }
                    else{
                        arrUniqueSteps.push(currentStep);
                    }
                })
            }


            if(hasIncorrectsSteps){
                state.stateStepsResume.stepsResume = [{
                    currentStep: 1,
                    status: 'beginning'
                }];
            }
            
        }
    }
})

export const { setCheckIsCorrectsSteps, setFilterStep, setFalseSteps, setFirstStep, setNextStep, setBackStep } = stepsResumeSlice.actions;

export default stepsResumeSlice.reducer;