import React, { ComponentType, useEffect, useState } from "react";
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
        stepsComponents: ComponentType<TypesComponents>[],
        setShowMainFooter: React.Dispatch<React.SetStateAction<boolean>>,
    ) => void;
};
interface Steps {
    handleStepOne: (data: string) => void;
    handleStepTwo: (data: { [key: string]: string }) => void;
    handleStepThree: (data: string) => void;
}
interface UpdSteps {
    updStepsComponents: (setStepsComponents: React.Dispatch<React.SetStateAction<ComponentType<TypesComponents>[]>>, compOperation: ComponentType<TypesComponents>, stateField: string) => void;
}
export interface TypesComponents {
    onStepOneData: (value: string) => void;
    handleStepOne: (data: string) => void;
    stepOneData: string;
    handleNextStep: (educClass?: string | undefined) => void;
    handleBackStep: () => void;
    stepsComponents: ComponentType<TypesComponents>[]
}

const getCurrentStep: Funcs['getCurrentStep'] = (typeOperationStep: string, stateSteps: number) => {
    return typeOperationStep === 'next step' ? stateSteps + 1 : stateSteps - 1;
}



const funcShowMainFooter: Funcs['funcShowMainFooter'] = (
    findCurrentStep,
    stepsComponents,
    setShowMainFooter,
) => {
    const currentNameComponent: ComponentType<TypesComponents>[] = []
    if (findCurrentStep) {
        const index = findCurrentStep.currentStep - 1;
        const StepComponent = stepsComponents[index];
        if (StepComponent) {
            currentNameComponent.push(StepComponent);
        }
    }
    const compsUniqueFooter = [StepResume1, StepResume3];


    const isUniqueFooterCurrentComp = compsUniqueFooter.find(component => component === currentNameComponent[0]) ? true : false;

    if (isUniqueFooterCurrentComp) {
        setShowMainFooter(true)
    }
    else {
        setShowMainFooter(false)
    }
}


const updStepsComponents: UpdSteps['updStepsComponents'] = (setStepsComponents, compOperation, stateField) => {
    setStepsComponents(prevComponents => {
        let newComponents: ComponentType<TypesComponents>[] = [...prevComponents];

        if (stateField === 'There is no education in IS' || stateField === 'c') {
            newComponents = compOperation === StepResume4
                ? newComponents.filter(el => el !== StepResume4)
                : newComponents.filter(el => el !== StepResume5);
        } else {
            if (!newComponents.includes(compOperation)) {
                if (compOperation === StepResume4) {
                    newComponents.splice(3, 0, StepResume4);
                } else {
                    newComponents.splice(4, 0, StepResume5);
                }
            }
        }


        return newComponents;
    });
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



    const findCurrentStep = stateArrStepsResume?.find(item => item.status === 'beginning')

    const [stepsComponents, setStepsComponents] = useState<ComponentType<TypesComponents>[]>([
        StepResume1,
        StepResume2,
        StepResume3,
        StepResume4,
        StepResume5,
        StepResume6
    ]);

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);


    useEffect(() => {
        funcShowMainFooter(
            findCurrentStep,
            stepsComponents,
            setShowMainFooter,
        )
    }, [stateArrStepsResume, stepsComponents])

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


    useEffect(() => {
        if (stateEducClass) {
            updStepsComponents(setStepsComponents, StepResume4, stateEducClass);
        }
        if (stateTypeWorkResume) {
            updStepsComponents(setStepsComponents, StepResume5, stateTypeWorkResume);
        }
    }, [stateEducClass, stateTypeWorkResume, stateArrStepsResume]);



    const handleIsStepComponent = (stepNumb: number): ComponentType<TypesComponents> | undefined => {
        const ComponentBackStep = stepsComponents[stepNumb]
        const isStepComponent = stepsComponents?.find(el => el === ComponentBackStep)
        return isStepComponent ? isStepComponent : undefined;
    }


    const handleSearchNumbComp = (stepNumb: number, typeOperation: string): number => {
        let isStepComponent = handleIsStepComponent(stepNumb);

        while (isStepComponent === undefined) {
            if (typeOperation === 'back step') {
                stepNumb = stepNumb - 1;
            } else {
                stepNumb = stepNumb + 1;
            }

            if (stepNumb < 0 || stepNumb > 6) {
                break;
            }

            isStepComponent = handleIsStepComponent(stepNumb);

            if (stepNumb === 6) {
                return stepNumb;
            }
        }

        return stepNumb;
    };

    const stepNotThreeNextStep = (typeOperation: string): number => {
        const stepNumb = getCurrentStep(typeOperation, findCurrentStep?.currentStep || 0);
        const checkCurrentStepComp = handleSearchNumbComp(stepNumb, typeOperation)
        return checkCurrentStepComp;
    }

    const calculateNextStep: TypesComponents['handleNextStep'] = (educClass) => {
        let nextStep: number;
        if (findCurrentStep?.currentStep !== 6) {
            if (findCurrentStep?.currentStep === 3) {
                nextStep = stepNotThreeNextStep('next step');
                if (stateTypeWorkResume === 'c') {
                    if (educClass === undefined) {
                        if (stateEducClass === 'There is no education in IS') {
                            nextStep = 6;
                        }
                    }
                    else {
                        if (stateEducClass === 'There is no education in IS' && educClass !== 'There is no education in IS') {
                            nextStep -= 2;
                        } else {
                            nextStep += 2;
                        }
                    }
                }
                else {
                    if (educClass === undefined) {
                        if (stateEducClass === 'There is no education in IS') {
                            if (stepsComponents.length === 5) {
                                nextStep += 1;
                            }
                            else {
                                nextStep = 6;
                            }
                        }
                    }
                    else {
                        if (stateEducClass === 'There is no education in IS'
                            && educClass !== 'There is no education in IS'
                            && stepsComponents.length === 6) {
                            nextStep -= 2;
                        } else {
                            if (stepsComponents.length === 6 && educClass === 'There is no education in IS') {
                                nextStep += 1;
                            }
                        }
                    }
                }
            } else {
                nextStep = stepNotThreeNextStep('next step');
            }

            if (nextStep > 6) {
                nextStep = 6;
            }

            dispatch(setNextStep(nextStep));
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
    }, [])

    const calculateBackStep: TypesComponents['handleBackStep'] = () => {
        let backStep: number;
        if (findCurrentStep?.currentStep === 5 && stepsComponents.length === 5) {
            backStep = stepNotThreeNextStep('back step')

            dispatch(setBackStep(backStep - 1))

        }
        else if (findCurrentStep?.currentStep === 6) {
            backStep = stepNotThreeNextStep('back step')
            if (stateTypeWorkResume !== 'c' && stepsComponents.length === 5) {
                backStep += 1;
            }
            dispatch(setBackStep(backStep))
        }
        else {
            const backStep = stepNotThreeNextStep('back step')
            dispatch(setBackStep(backStep))
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


    const showCurrentStep = (stateArrStepsResume && stepsComponents) ? stateArrStepsResume.map((item, index) => {
        const StepComponent = stepsComponents[index];
        const isBeginningStep = item.status === 'beginning';



        return isBeginningStep && StepComponent ? (
            <div key={index}>
                <StepComponent
                    onStepOneData={setStepOneData}
                    handleStepOne={handleStepOne}
                    stepsComponents={stepsComponents}
                    stepOneData={stepOneData}
                    handleBackStep={handleBackStep}
                    handleNextStep={handleNextStep}
                />
            </div>
        ) : null;
    }) : null;



    const [showMainFooter, setShowMainFooter] = useState<boolean>(true);

    const currentStep = findCurrentStep?.currentStep;

    return (
        <div className="create-resume-page">
            <div className="steps-operation-creation">
                {showCurrentStep}
            </div>
            <ModalContResumeInfo
                showsModalConts={showsModalConts}
                showModalContSearchStatus={showModalContSearchStatus}
                showModalContLevelIs={showModalContLevelIs}
            />
            {showMainFooter ?
                <div className="footer-create-page main">
                    <StepSuccess stepsComponents={stepsComponents} />
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