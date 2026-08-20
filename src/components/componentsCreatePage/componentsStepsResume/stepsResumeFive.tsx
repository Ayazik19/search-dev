import React, { ComponentType, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hookRedux";
import { useForm } from "react-hook-form";
import { setFilterStep, setNextStep } from "../../../store/stepsResume";
import { setChangeTypeWork } from "../../../store/resumesSlice";
import ResumePetProjects from "./componentsStepFive/resumePetProjects";
import ResumeWorkExpirience from "./componentsStepFive/resumeWorkExpirience";
import iconIsRequiredFalse from '../../../../dist/icons/iconIsRequiredFalse.png'
import iconIsRequiredTrue from '../../../../dist/icons/iconIsRequiredTrue.png'
import FpContModalWarning from "./componentsStepFive/fpConts/contModalWarning";
import useStepsStyle from "./stylesStepsSucces";
import { TypesComponents } from "../createResumePage";
import submitDataStepFive from "./componentsStepFive/submitDataStepFive";
import StepSuccess from "./stepsSucces";

interface Props {
    handleBackStep: () => void;
    handleNextStep: () => void;
    stepsComponents: ComponentType<TypesComponents>[]
}

export interface ErrorModalData {
    isShowModalWarningData: boolean,
    textErrorModal: string,
    typeError: string
}

const StepResume5: React.FC<Props> = ({ stepsComponents, handleBackStep, handleNextStep }) => {

    const dispatch = useAppDispatch();

    const { resumesState } = useAppSelector(state => state.resumes);
    const nameResume = resumesState.nameResume;

    const stateTypeWorkResume = resumesState && resumesState.typeWorkResume;

    const styleSuccesSteps = useStepsStyle();



    useEffect(() => {
        if (stateTypeWorkResume === 'a') {
            setValueTypeWorkInp('Yes, i have commercial experience')
            console.log(valueTypeWorkInp)
        }
        else if (stateTypeWorkResume === 'b') {
            setValueTypeWorkInp('No, but I have pet projects')
            console.log(valueTypeWorkInp)
        }
        else if (stateTypeWorkResume === 'c') {
            setValueTypeWorkInp('I have no pet projects and commercial experience')
            console.log(valueTypeWorkInp)
        }
    }, [stateTypeWorkResume])

    const removeDataModal: ErrorModalData = {
        isShowModalWarningData: false,
        textErrorModal: '',
        typeError: ''
    }

    const [valueTypeWorkInp, setValueTypeWorkInp] = useState<string>('');
    const [errorsTypeWorkInp, setErrorsTypeWorkInp] = useState<string>('');

    const [isChangedTypeWorkResume, setIsChangedTypeWorkResume] = useState<boolean>(false);

    const handleInpValueTypeWork = (event: React.ChangeEvent<HTMLSelectElement>, isChangedTypeWorkResume: boolean) => {
        const value = event.target.value;
        if (isChangedTypeWorkResume) { setValueTypeWorkInp(event.target.value) }
        if (value === 'Yes, i have commercial experience') {
            // boolean state, which setting type user dont have commercial expirence, but he have pet projects
            dispatch(setChangeTypeWork('a'))
        }
        else if (value === 'No, but I have pet projects') {
            dispatch(setChangeTypeWork('b'))
        }
        else if (value === 'I have no pet projects and commercial experience') {
            const statePetProjects = resumesState.petProjects?.length;
            const statePositions = resumesState.positions?.length;
            const isDataStepFive = statePetProjects && statePetProjects > 0 || statePositions && statePositions > 0;
            if (isDataStepFive && !isChangedTypeWorkResume) {
                setDataErrorModal({
                    isShowModalWarningData: true,
                    textErrorModal: `You already have the created ${statePositions && statePositions > 0 ? 'positions' : 'pet projects'}. Are you sure you want to get out?`,
                    typeError: 'CHANGED_TYPE_WORK_RESUME'
                })
            }
            else {
                dispatch(setChangeTypeWork('c'))
                handleNextStep();
                dispatch(setFilterStep(5));
            }
        }
    }



    useEffect(() => {
        isDisplayWorkResume();
    }, [stateTypeWorkResume])

    const isDisplayWorkResume = () => {
        if (stateTypeWorkResume === 'a') {
            return (
                <ResumeWorkExpirience
                    valueTypeWorkInp={valueTypeWorkInp}
                    errorsTypeWorkInp={errorsTypeWorkInp}
                    setValueTypeWorkInp={setValueTypeWorkInp}
                    setErrorsTypeWorkInp={setErrorsTypeWorkInp}
                />
            );
        }
        else if (stateTypeWorkResume === 'b') {
            return (
                <ResumePetProjects />
            );
        }
        else if (stateTypeWorkResume === 'c') {
            handleNextStep();
        }
    }

    const [dataErrorModal, setDataErrorModal] = useState<ErrorModalData>(removeDataModal)



    const checkResumesData = () => {
        const stateTypeWorkResume = resumesState.typeWorkResume;
        const findPositionsState = resumesState.positions;
        const findProjectsState = resumesState.petProjects;

        if (dataErrorModal.isShowModalWarningData) {
            return; // Если модалка уже открыта, ничего не делаем
        }

        console.log(findPositionsState && findPositionsState.length > 0)

        if (stateTypeWorkResume === 'a' && !(findPositionsState && findPositionsState.length > 0)) {
            setDataErrorModal({
                isShowModalWarningData: true,
                textErrorModal: 'Enter your position works data',
                typeError: 'NO-DATA-SUBMIT',
            });
        } else if (stateTypeWorkResume === 'b' && !(findProjectsState && findProjectsState.length > 0)) {
            setDataErrorModal({
                isShowModalWarningData: true,
                textErrorModal: 'Enter your pet projects data',
                typeError: 'NO-DATA-SUBMIT',
            });
        }
        else {
            handleNextStep();
        }
    };

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | null = null;

        if (dataErrorModal.isShowModalWarningData) {
            timer = setTimeout(() => {
                setDataErrorModal(prev => ({ ...prev, isShowModalWarningData: false }));
            }, 40000);
        }

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [dataErrorModal.isShowModalWarningData]);

    return (
        <div className="step-resume-creation">
            <div className="resume-creation">
                <span className="main-text-step">
                    Describe your develop expirience
                </span>
                <span className="description-text-step">
                    Resume {nameResume}
                </span>
                <div className="position-info selected-type-work">
                    <span className="name-position-info">Do you have commercial experience?</span>
                    <div className="user-work-select_watch">
                        <select
                            className='select-type-work'
                            value={valueTypeWorkInp}
                            onChange={(e) => handleInpValueTypeWork(e, false)}
                        >
                            {stateTypeWorkResume !== '' ?
                                <>
                                    <option value={valueTypeWorkInp}>{valueTypeWorkInp}</option>
                                    {stateTypeWorkResume !== 'a' && <option value='Yes, i have commercial experience'>Yes, i have commercial experience</option>}
                                    {stateTypeWorkResume !== 'b' && <option value='No, but I have pet projects'>No, but I have pet projects</option>}
                                    <option value='I have no pet projects and commercial experience'>I have no pet projects and commercial experience</option>
                                </>
                                :
                                <>
                                    <option value=''></option>
                                    <option value='Yes, i have commercial experience'>Yes, i have commercial experience</option>
                                    <option value='No, but I have pet projects'>No, but I have pet projects</option>
                                    <option value='I have no pet projects and commercial experience'>I have no pet projects and commercial experience</option>
                                </>
                            }
                        </select>
                        <div className="type-selected">
                            <img src={valueTypeWorkInp !== '' ? iconIsRequiredTrue : iconIsRequiredFalse} className="icon-select-type-work_is-required" />
                        </div>
                    </div>
                    {errorsTypeWorkInp !== '' && <p className="erorrs-input-position">{errorsTypeWorkInp}</p>}
                </div>
                {isDisplayWorkResume()}
            </div>
            {stateTypeWorkResume && <div className="footer-create-page">
                <StepSuccess stepsComponents={stepsComponents} />
                <div className="footer-main-create-page">
                    <button className="b-back-step" onClick={() => handleBackStep()}>
                        Back
                    </button>
                    <button
                        type='button'
                        onClick={() => {
                            checkResumesData()
                        }}
                        className="b-next-step step-three_true"
                    >
                        Save and continue
                    </button>
                </div>
            </div>}
            {dataErrorModal.isShowModalWarningData &&
                <FpContModalWarning
                    dataErrorModal={dataErrorModal}
                    setDataErrorModal={setDataErrorModal}
                    removeDataModal={removeDataModal}
                    handleInpValueTypeWork={handleInpValueTypeWork}
                />}

        </div>
    );
}

export default StepResume5;