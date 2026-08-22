import React, { ComponentType, useCallback, useEffect, useMemo, useState } from "react";
import StepResume1 from "./componentsStepsResume/stepResumeOne";
import StepResume2 from "./componentsStepsResume/stepResumeTwo";
import StepResume3 from "./componentsStepsResume/stepResumeThree";
import StepResume4 from "./componentsStepsResume/stepResumeFour";
import { useAppDispatch, useAppSelector } from "../../hookRedux";
import { setBackStep, setCheckIsCorrectsSteps, setNextStep, StepResume } from "../../store/stepsResume";
import './createResuemPage.css';
import { setEducationClass, setNameResume } from "../../store/resumesSlice";
import StepResume5 from "./componentsStepsResume/stepsResumeFive";
import StepResume6 from "./componentsStepsResume/stepResumeSix";
import StepSuccess from "./componentsStepsResume/stepsSucces";
import ModalContResumeInfo from "./componentsStepsResume/ModalContResumeInfo";


type Funcs = {
    getCurrentStep: (typeOperationStep: string, stateSteps: number) => number;
    funcShowMainFooter: (
        findCurrentStep: StepResume | undefined,
        stepComponent: React.ComponentType<any> | undefined,
        setShowMainFooter: React.Dispatch<React.SetStateAction<boolean>>,
    ) => void;
};
interface Steps {
    handleStepOne: (data: string) => void;
    handleStepTwo: (data: { [key: string]: string }) => void;
    handleStepThree: (data: string) => void;
}
export interface TypesComponents {
    onStepOneData: (value: string) => void;
    handleStepOne: (data: string) => void;
    stepOneData: string;
    handleNextStep: (educClass?: string | undefined) => void;
    handleBackStep: () => void;
    showCurrentStep: (stateArrStepsResume: Array<{ status: string }>) => React.ReactElement[] | null;
    stepsComponents: ComponentType<TypesComponents>[]
}

const getCurrentStep: Funcs['getCurrentStep'] = (typeOperationStep: string, stateSteps: number) => {
    return typeOperationStep === 'next step' ? stateSteps + 1 : stateSteps - 1;
}

const funcShowMainFooter: Funcs['funcShowMainFooter'] = (
    findCurrentStep,
    stepComponent,
    setShowMainFooter,
) => {
    const isUniqueFooterCurrentComp = stepComponent === StepResume1 || stepComponent === StepResume3;

    if (findCurrentStep && isUniqueFooterCurrentComp) {
        setShowMainFooter(true)
    }
    else {
        setShowMainFooter(false)
    }
}

const CreateResumePage: React.FC = () => {
    const dispatch = useAppDispatch();

    const [stepOneData, setStepOneData] = useState<TypesComponents['stepOneData']>('');
    const [isLoadedNextStep, setIsLoadedNextStep] = useState<boolean>(false);
    const [showModalContSearchStatus, setShowModalContSearchStatus] = useState<boolean>(false);
    const [showModalContLevelIs, setShowModalContLevelIs] = useState<boolean>(false);

    const { stateStepsResume } = useAppSelector(state => state.stepsResume)

    const { resumesState } = useAppSelector(state => state.resumes);
    const nameResume = resumesState.nameResume;
    const stateEducClass = resumesState.education?.educationClass;
    const stateTypeWorkResume = resumesState.typeWorkResume;
    const stateStatusSearchResume = resumesState.statusSearchResume;
    const stateLevelIsResume = resumesState.levelIsResume;

    const stateArrStepsResume = stateStepsResume.stepsResume;

    const findCurrentStep = stateArrStepsResume?.find(item => item.status === 'beginning');
    const currentStep = findCurrentStep?.currentStep;

    const stepComponentByNumber: Record<number, React.ComponentType<any>> = {
        1: StepResume1,
        2: StepResume2,
        3: StepResume3,
        4: StepResume4,
        5: StepResume5,
        6: StepResume6,
    };

    const getVisibleStepNumbers = useCallback((): number[] => {
        const visibleSteps = [1, 2, 3, 4, 5, 6];

        if (stateEducClass === 'There is no education in IS') {
            return visibleSteps.filter(step => step !== 4).filter(step => stateTypeWorkResume === 'c' ? step !== 5 : true);
        }

        if (stateTypeWorkResume === 'c') {
            return visibleSteps.filter(step => step !== 5);
        }

        return visibleSteps;
    }, [stateEducClass, stateTypeWorkResume]);

    const visibleStepNumbers = useMemo(() => getVisibleStepNumbers(), [getVisibleStepNumbers]);
    const visibleStepsComponents = useMemo(
        () => visibleStepNumbers.map(stepNumber => stepComponentByNumber[stepNumber]).filter(Boolean),
        [visibleStepNumbers],
    );

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    };

    useEffect(() => {
        funcShowMainFooter(
            findCurrentStep,
            stepComponentByNumber[currentStep ?? 0],
            setShowMainFooter,
        )
    }, [findCurrentStep, currentStep]);

    const showsModalConts = (statusShowsModal: string) => {
        let timer: ReturnType<typeof setTimeout> | null = null;

        if (statusShowsModal === 'show') {
            const randomNumber = Math.floor(Math.random() * 2) + 1;

            if (randomNumber === 1) {
                if (stateLevelIsResume === undefined || stateLevelIsResume === '') {
                    setShowModalContSearchStatus(false);
                    setShowModalContLevelIs(true);
                }
            }
            else {
                if (stateStatusSearchResume === undefined || stateStatusSearchResume === '') {
                    setShowModalContLevelIs(false);
                    setShowModalContSearchStatus(true);
                }
            }
        }
        else if (statusShowsModal === 'completed') {
            if (showModalContSearchStatus) {
                setShowModalContSearchStatus(false);
                if (stateLevelIsResume === undefined || stateLevelIsResume === '') {

                    timer = setTimeout(() => {
                        setShowModalContLevelIs(true);
                    }, 15000)
                }
            }
            else {
                setShowModalContLevelIs(false);
                if (stateStatusSearchResume === undefined || stateStatusSearchResume === '') {

                    timer = setTimeout(() => {
                        setShowModalContSearchStatus(true);
                    }, 15000)
                }
            }
        }
        else if (statusShowsModal === 'hidden') {
            if (showModalContSearchStatus) {
                setShowModalContSearchStatus(false)

                timer = setTimeout(() => {
                    showsModalConts('show');
                }, 25000)
            }
            else {
                setShowModalContLevelIs(false)

                timer = setTimeout(() => {
                    showsModalConts('show');
                }, 25000)
            }
        }
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }


    const getRelativeVisibleStep = (direction: 'next' | 'back') => {
        const currentVisibleStepNumbers = visibleStepNumbers;
        const currentVisibleStep = currentStep ?? currentVisibleStepNumbers[0];
        const currentIndex = currentVisibleStepNumbers.indexOf(currentVisibleStep);
        const safeIndex = currentIndex === -1 ? (direction === 'next' ? -1 : currentVisibleStepNumbers.length) : currentIndex;
        const targetIndex = direction === 'next' ? safeIndex + 1 : safeIndex - 1;

        if (targetIndex < 0) {
            return currentVisibleStepNumbers[0];
        }

        if (targetIndex >= currentVisibleStepNumbers.length) {
            return currentVisibleStepNumbers[currentVisibleStepNumbers.length - 1];
        }

        return currentVisibleStepNumbers[targetIndex];
    };

    const calculateNextStep: TypesComponents['handleNextStep'] = () => {
        if (findCurrentStep?.currentStep !== 6) {
            dispatch(setNextStep(getRelativeVisibleStep('next')));
        }
    }

    const handleNextStep: TypesComponents['handleNextStep'] = (educClass) => {
        calculateNextStep(educClass);
        dispatch(setCheckIsCorrectsSteps());
        setIsLoadedNextStep(true);
        showsModalConts('show')
    };

    useEffect(() => {
        showsModalConts('show')


        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };

    }, [])

    const calculateBackStep: TypesComponents['handleBackStep'] = () => {
        if (findCurrentStep?.currentStep !== 1) {
            dispatch(setBackStep(getRelativeVisibleStep('back')));
        }
    };

    const handleBackStep: TypesComponents['handleBackStep'] = () => {
        calculateBackStep();
        dispatch(setCheckIsCorrectsSteps());
    };

    const handleStepOne: Steps['handleStepOne'] = (data) => {
        if (nameResume) {
            if (nameResume !== data) {
                dispatch(setNameResume(data));
            }
        }
        else {
            dispatch(setNameResume(data));
            dispatch(setEducationClass('There is no education in IS'))
        }
        const stepNumb = getCurrentStep('next step', findCurrentStep?.currentStep || 0);
        dispatch(setNextStep(stepNumb))
    };

    // const handleStepThree = () => {
    //     const stepNumb = getCurrentStep('next step', findCurrentStep?.currentStep || 0);
    //     dispatch(setNextStep(stepNumb))
    //     dispatch(setEducationClass('There is no education in IS'));
    // }


    const showCurrentStep = useCallback(() => {
        if (!currentStep) return null;

        const StepComponent = stepComponentByNumber[currentStep];

        if (!StepComponent) return null;

        return [
            <div key={currentStep}>
                <StepComponent
                    onStepOneData={setStepOneData}
                    handleStepOne={handleStepOne}
                    stepsComponents={visibleStepsComponents}
                    stepOneData={stepOneData}
                    showCurrentStep={showCurrentStep}
                    handleBackStep={handleBackStep}
                    handleNextStep={handleNextStep}
                />
            </div>
        ];
    }, [currentStep, setStepOneData, handleStepOne, stepOneData, handleBackStep, handleNextStep, visibleStepsComponents]);

    const [showMainFooter, setShowMainFooter] = useState<boolean>(true);

    return (
        <div className="create-resume-page">
            <div className="steps-operation-creation">
                {showCurrentStep()}
            </div>
            <ModalContResumeInfo
                showsModalConts={showsModalConts}
                showModalContSearchStatus={showModalContSearchStatus}
                showModalContLevelIs={showModalContLevelIs}
            />
            {showMainFooter ?
                <div className="footer-create-page main">
                    <StepSuccess visibleStepNumbers={visibleStepNumbers} />
                    <div className={currentStep !== 1 ? "footer-main-create-page" : "footer-main-create-page_step-one-true"}>
                        {currentStep !== 1 && <button className="b-back-step" onClick={() => handleBackStep()}>
                            Back
                        </button>}
                        <button className="b-next-step step-three_true" onClick={() => handleNextStep()}>
                            Save and continue
                        </button>
                    </div>
                </div> : null}
        </div>
    );
}

export default CreateResumePage;