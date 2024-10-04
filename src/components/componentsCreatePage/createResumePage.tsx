import React, { useEffect, useState } from "react";
import StepResumeOne from "./componentsStepsResume/stepResumeOne";
import StepResumeTwo from "./componentsStepsResume/stepResumeTwo";
import StepResumeThree from "./componentsStepsResume/stepResumeThree";
import StepResumeFour from "./componentsStepsResume/stepResumeFour";
import { useAppDispatch, useAppSelector } from "../../hookRedux";
import stepsResume, { setBackStep, setNextStep } from "../../store/stepsResume";
import './createResuemPage.css';
import { setEducationClass, setNameResume } from "../../store/resumesSlice";
import StepResumeFive from "./componentsStepsResume/stepsResumeFive";



const CreateResumePage: React.FC = () => {
    const dispatch = useAppDispatch();

    const [stepOneData, setStepOneData] = useState<string>('');

    const [stepThreeData, setStepThreeData] = useState<string>('');

    const [stepTwoData, setStepTwoData] = useState<{ [key: string]: string }>({});

    const { stateStepsResume } = useAppSelector(state => state.stepsResume)

    const isStepOne = stateStepsResume.stepsResume.stepOne;
    const isStepTwo = stateStepsResume.stepsResume.stepTwo;
    const isStepThree = stateStepsResume.stepsResume.stepThree;
    const isStepFour = stateStepsResume.stepsResume.stepFour;
    const isStepFive = stateStepsResume.stepsResume.stepFive;


    interface Steps {
        handleBackStep: () => void;
        handleStepOne: (data: string) => void;
        handleStepTwo: (data: { [key: string]: string }) => void;
        handleStepThree: (data: string) => void;
    }

    const handleBackStep = () => {
        dispatch(setBackStep());
    };

    const handleStepOne = (data: string) => {
        // if (isStepTwo) {
        //     dispatch(setNameResume(data));
        //     dispatch(setNextStep());
        // }
        // else {
        //     dispatch(setNextStep());
        // }
        dispatch(setNameResume(data));
        dispatch(setNextStep());
    };

    const handleStepThree = () => {
        dispatch(setNextStep())
        dispatch(setEducationClass('There is no education in IS'));
    }

    return (
        <div className="create-resume-page">
            <div className="steps-operation-creation">
                {isStepOne ? <StepResumeOne onStepOneData={setStepOneData} stepOneData={stepOneData} /> : null}
                {isStepTwo && <StepResumeTwo handleBackStep={handleBackStep} />}
                {isStepThree ? <StepResumeThree /> : null}
                {isStepFour ? <StepResumeFour /> : null}
                {isStepFive ? <StepResumeFive /> : null}
            </div>
            {!isStepTwo && !isStepFour ? <div className="footer-create-page">
                <div className="steps-success-items">
                    <div className='items-steps' style={{
                        backgroundColor: '#007bff'
                    }}></div>
                    <div className='items-steps' style={{
                        backgroundColor:
                            isStepTwo || isStepThree || isStepFour ? '#007bff' : 'rgb(98, 98, 98)'
                    }}></div>
                    <div className='items-steps' style={{
                        backgroundColor:
                            isStepThree || isStepFour ? '#007bff' : 'rgb(98, 98, 98)'
                    }}></div>
                    <div className='items-steps' style={{
                        backgroundColor:
                            isStepFour ? '#007bff' : 'rgb(98, 98, 98)'
                    }}></div>
                    <div className='items-steps' style={{
                        backgroundColor:
                            isStepFive ? '#007bff' : 'rgb(98, 98, 98)'
                    }}></div>
                </div>
                <div className={!isStepOne ? "footer-main-create-page" : "footer-main-create-page_step-one-true"}>
                    {!isStepOne && <button className="b-back-step" onClick={() => handleBackStep()}>
                        Back
                    </button>}
                    {isStepOne && <button className="b-next-step step-one_true" onClick={() => handleStepOne(stepOneData)}>
                        Save and continue
                    </button>}
                    {isStepThree && <button className="b-next-step step-three_true" onClick={() => handleStepThree()}>
                        Save and continue
                    </button>}
                </div>
            </div> : null}
        </div>
    );
}

export default CreateResumePage;