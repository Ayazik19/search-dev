import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
            const stateStepResume = state.stateStepsResume.stepsResume ?? [];
            const existingIndex = stateStepResume.findIndex(item => item.currentStep === nextStep);

            if (existingIndex !== -1) {
                state.stateStepsResume.stepsResume = stateStepResume
                    .slice(0, existingIndex + 1)
                    .map((item, index, array) => ({
                        ...item,
                        status: index === array.length - 1 ? 'beginning' : 'completed'
                    }));
                return;
            }

            if (stateStepResume.length === 0) {
                state.stateStepsResume.stepsResume = [{
                    currentStep: nextStep,
                    status: 'beginning'
                }];
                return;
            }

            state.stateStepsResume.stepsResume = stateStepResume.map((item, index, array) => ({
                ...item,
                status: index === array.length - 1 ? 'completed' : item.status
            }));

            state.stateStepsResume.stepsResume.push({
                currentStep: nextStep,
                status: 'beginning'
            });
        },
        setBackStep(state, action: PayloadAction<number>) {
            const backStep = action.payload;
            const stateStepResume = state.stateStepsResume.stepsResume ?? [];
            const existingIndex = stateStepResume.findIndex(item => item.currentStep === backStep);

            if (stateStepResume.length === 0) {
                state.stateStepsResume.stepsResume = [{
                    currentStep: backStep,
                    status: 'beginning'
                }];
                return;
            }

            if (existingIndex === -1) {
                state.stateStepsResume.stepsResume = stateStepResume.map((item) => ({
                    ...item,
                    status: 'completed'
                }));

                state.stateStepsResume.stepsResume[state.stateStepsResume.stepsResume.length - 1] = {
                    currentStep: backStep,
                    status: 'beginning'
                };

                return;
            }

            state.stateStepsResume.stepsResume = stateStepResume
                .slice(0, existingIndex + 1)
                .map((item, index, array) => ({
                    ...item,
                    status: index === array.length - 1 ? 'beginning' : 'completed'
                }));
        },
        setFilterStep(state, action: PayloadAction<number>) {
            const filterStep = state.stateStepsResume.stepsResume.filter(step => step.currentStep !== action.payload)
            state.stateStepsResume.stepsResume = filterStep;
        },
        setCheckIsCorrectsSteps(state) {
            const stateStepsResume = state.stateStepsResume.stepsResume;

            if (!stateStepsResume || stateStepsResume.length === 0) {
                state.stateStepsResume.stepsResume = [{
                    currentStep: 1,
                    status: 'beginning'
                }];
                return;
            }

            state.stateStepsResume.stepsResume = stateStepsResume.map((item, index, array) => ({
                ...item,
                status: index === array.length - 1 ? 'beginning' : 'completed'
            }));

        }
    }
})

export const { setCheckIsCorrectsSteps, setFilterStep, setFalseSteps, setFirstStep, setNextStep, setBackStep } = stepsResumeSlice.actions;

export default stepsResumeSlice.reducer;