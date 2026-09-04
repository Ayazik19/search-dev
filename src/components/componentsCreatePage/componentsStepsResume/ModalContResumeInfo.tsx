import React, { ComponentType, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hookRedux';
import './ModalContResumeInfo.css';
import iconCloseModalContResumeInfo from '../../../../dist/icons/iconCloseRecomSlils.png';
import { setValueModalCont } from '../../../store/resumesSlice';
import { StepResume } from '../../../store/stepsResume';
import { TypesComponents } from '../createResumePage';
import StepResume1 from './stepResumeOne';
import { arrLevelsGradeResume, arrStatusSearchResume } from '../../../dataArrays/listsResumeOptions';
import type { levelIsResume, statusSearchResume } from '../../../types/typesResume';

interface Props {
    showsModalConts: (statusShowsModal: string) => void;
    showModalContSearchStatus: boolean;
    showModalContLevelIs: boolean
}

const ModalContResumeInfo: React.FC<Props> = ({
    showsModalConts,
    showModalContSearchStatus,
    showModalContLevelIs
}) => {
    //variables
    const dispatch = useAppDispatch();
    const { resumesState } = useAppSelector(state => state.resumes);
    const { stateStepsResume } = useAppSelector(state => state.stepsResume)
    const stateArrStepsResume = stateStepsResume.stepsResume;
    const statusSearchResume = resumesState.statusSearchResume;
    const stateTypeWorkResume = resumesState.typeWorkResume;

    const arrDataModalCont = showModalContSearchStatus ? arrStatusSearchResume : arrLevelsGradeResume;

    const findCurrentStep = stateArrStepsResume.find(item => item.status === 'beginning');
    let styleModalStepFive = '';

    type CheckesStatus = Record<statusSearchResume, boolean>;
    type CheckesLevel = Record<levelIsResume, boolean>;

    const initialCheckesStatus: CheckesStatus = {
        'Actively looking for a job': false,
        'Considering offers': false,
        'Offered a job, still deciding': false,
        'Starting a new job soon': false,
        'Not looking for a job': false
    };

    const initialCheckedLevelIs: CheckesLevel = {
        'Intern': false,
        'Junior': false,
        'Middle': false,
        'Senior': false
    };

    const [checkedStatus, setCheckedStatus] = useState<CheckesStatus>(initialCheckesStatus);
    const [checkedLevel, setCheckedLevel] = useState<CheckesLevel>(initialCheckedLevelIs);

    const hasAnyCheckedStatus = Object.values(checkedStatus).some(Boolean);
    const hasAnyCheckedLevel = Object.values(checkedLevel).some(Boolean);

    const handleToggleStatus = (el: statusSearchResume) => {
        if (checkedStatus[el]) {
            setCheckedStatus(initialCheckesStatus);
            return;
        }

        setCheckedStatus(hasAnyCheckedStatus ? { ...initialCheckesStatus, [el]: true } : { ...checkedStatus, [el]: true });
    };

    const handleToggleLevel = (el: levelIsResume) => {
        if (checkedLevel[el]) {
            setCheckedLevel(initialCheckedLevelIs);
            return;
        }

        setCheckedLevel(hasAnyCheckedLevel ? { ...initialCheckedLevelIs, [el]: true } : { ...checkedLevel, [el]: true });
    };

    const itemsModalCont = arrDataModalCont.map((el, index) => {
        const isCurrentModalStatus = showModalContSearchStatus
            ? checkedStatus[el as statusSearchResume]
            : checkedLevel[el as levelIsResume];

        return (
            <div
                key={el}
                className={isCurrentModalStatus ? 'items-modal selected' : 'items-modal not-selected'}
                style={{
                    marginTop: index === 0 ? '0px' : '10px'
                }}
            >
                <input
                    type="checkbox"
                    id={`modal-${el}-${index}`}
                    checked={isCurrentModalStatus || false}
                    className="input-modal-cont"
                    onChange={() =>
                        showModalContSearchStatus
                            ? handleToggleStatus(el as statusSearchResume)
                            : handleToggleLevel(el as levelIsResume)
                    }
                />
                <label htmlFor={`modal-${el}-${index}`} className="custom-label-modal">
                    <span className="name-item-modal"></span>
                </label>
                <span className='item-text-modal'>
                    {el}
                </span>
            </div>
        );
    });

    const handleSubmitStatusSearchResume = () => {
        const selected = (Object.entries(checkedStatus).find(([, v]) => v)?.[0] ?? undefined) as
            | statusSearchResume
            | undefined;

        if (!selected) return;

        dispatch(setValueModalCont({
            typeField: 'status search',
            value: selected
        }));
        showsModalConts('completed');
    };

    const handleSubmitLevelIsResume = () => {
        const selected = (Object.entries(checkedLevel).find(([, v]) => v)?.[0] ?? undefined) as
            | levelIsResume
            | undefined;

        if (!selected) return;

        dispatch(setValueModalCont({
            typeField: 'level search',
            value: selected
        }));
        showsModalConts('completed');
    };

    if (findCurrentStep?.currentStep === 5) {
        if (stateTypeWorkResume) {
            if (stateTypeWorkResume === 'a') {
                styleModalStepFive = 'type-a'
            }
            else if (stateTypeWorkResume === 'b') {
                styleModalStepFive = 'type-b'
            }
        }
        else {
            styleModalStepFive = 'undefined-type-work' //тут доделать
        }
    }

    return (showModalContSearchStatus || showModalContLevelIs) ? (
        <>
            {showModalContSearchStatus ? (
                <div
                    className={`modal-status-search-resume current-step-${findCurrentStep?.currentStep} ${styleModalStepFive}`}
                    style={{ height: '350px' }}
                >
                    <div className='status-resume'>
                        <div className='line-cont-modal-resume'>
                            <div className='line-cont-modal el-line-status-cont'></div>
                            <div className='line-cont-modal el-line-status-cont'></div>
                            <div className='line-cont-modal el-line-status-cont'></div>
                            <div className='line-cont-modal last-el-status-cont'></div>
                        </div>
                        <main className='main-status-resume'>
                            <div className='info-status-resume'>
                                <span className='main-text-status'>
                                    Which status search?
                                </span>
                                <div className='items-status'>
                                    {itemsModalCont}
                                </div>
                                <div className='btn-submit-modal'>
                                    <button
                                        onClick={handleSubmitStatusSearchResume}
                                        className='btn-subm-status-search-resume'
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </main>
                        <div className='close-status-resume'>
                            <img
                                src={iconCloseModalContResumeInfo}
                                className='icon-close-modal-resume-cont'
                                onClick={() => showsModalConts('hidden')}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    className={`modal-level-IS-resume current-step-${findCurrentStep?.currentStep} ${styleModalStepFive}`}
                    style={{ height: '300px' }}
                >
                    <div className='level-IS-resume'>
                        <div className='line-cont-modal-resume'>
                            <div className='line-cont-modal el-line-level-cont'></div>
                            <div className='line-cont-modal el-line-level-cont'></div>
                            <div className='line-cont-modal el-line-level-cont'></div>
                            <div className='line-cont-modal last-el-line'></div>
                        </div>
                        <main className='main-level-resume'>
                            <div className='info-level-resume'>
                                <span className='main-text-level'>
                                    Which level is resume?
                                </span>
                                <div className='items-level'>
                                    {itemsModalCont}
                                </div>
                                <div className='btn-submit-modal'>
                                    <button
                                        onClick={handleSubmitLevelIsResume}
                                        className='btn-subm-status-search-resume'
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </main>
                        <div className='close-level-resume'>
                            <img
                                src={iconCloseModalContResumeInfo}
                                className='icon-close-modal-resume-cont'
                                onClick={() => showsModalConts('hidden')}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    ) : null;
}

export default ModalContResumeInfo;