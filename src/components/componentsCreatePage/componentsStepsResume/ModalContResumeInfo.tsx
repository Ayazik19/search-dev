import React, { ComponentType, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hookRedux';
import './ModalContResumeInfo.css';
import iconCloseModalContResumeInfo from '../../../../dist/icons/iconCloseRecomSlils.png';
import { setValueModalCont } from '../../../store/resumesSlice';
import { StepResume } from '../../../store/stepsResume';
import { TypesComponents } from '../createResumePage';
import StepResume1 from './stepResumeOne';
import { arrStatusSearchResume } from '../../../dataArrays/listsResumeOptions';

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

    //data statuses search
    const arrDataModalCont = showModalContSearchStatus ? arrStatusSearchResume :
        ['Intern',
            'Junior',
            'Mid-level',
            'Senior'
        ] as const;

    type Status = typeof arrDataModalCont[number];
    type Checkes = { [key in Status]: boolean };
    const initialCheckes: Checkes = {
        'Actively looking for a job': false,
        'Considering offers': false,
        'Offered a job, still deciding': false,
        'Starting a new job soon': false,
        'Not looking for a job': false
    };

    const initialCheckedLevelIs: Checkes = {
        'Intern': false,
        'Junior': false,
        'Mid-level': false,
        'Senior': false
    }
    const findCurrentStep = stateArrStepsResume.find(item => item.status === 'beginning')
    let styleModalStepFive = '';
    //hooks
    const [checkedStatus, setCheckedStatus] = useState<Checkes>(initialCheckes);
    const [checkedLevel, setCheckedLevel] = useState<Checkes>(initialCheckedLevelIs)

    const updChecked = (newStatusesSearch: Checkes, el: string): Checkes => {
        return {
            ...newStatusesSearch,
            [el]: true,
        };
    }

    const updRemoveCheck = (checkes: Checkes): Checkes => {
        const updatedChecked = Object.entries(checkes).reduce((acc, [key]) => {
            acc[key] = false;
            return acc;
        }, {} as Checkes);

        return updatedChecked;
    };

    const handleChangeStatus = (el: string) => {
        const isHasValue = showModalContSearchStatus ?
            Object.values(checkedStatus).some(value => value === true) :
            Object.values(checkedLevel).some(value => value === true);

        let newStatusesSearch: Checkes = showModalContSearchStatus ? checkedStatus : checkedLevel;

        if (isHasValue) {
            newStatusesSearch = showModalContSearchStatus ? initialCheckes : initialCheckedLevelIs;
        }

        newStatusesSearch = updChecked(newStatusesSearch, el);

        if (showModalContSearchStatus) {
            setCheckedStatus(newStatusesSearch);
            return;
        }
        setCheckedLevel(newStatusesSearch);
    }

    const handleRemove = () => {
        if (showModalContSearchStatus) {
            const updCheckes = updRemoveCheck(checkedStatus);
            setCheckedStatus(updCheckes);
        } else {
            const updCheckedLevel = updRemoveCheck(checkedLevel); setCheckedLevel(updCheckedLevel);
        }
    }

    const checkTypeChange = (el: string, arrChecked: Checkes): boolean => {
        return el in arrChecked && arrChecked[el] === true;
    };

    const handleChangeCheck = (el: string, arrChecked: Checkes) => {
        const isRemove: boolean = checkTypeChange(el, arrChecked);

        if (isRemove) {
            handleRemove();
        }
        else {
            handleChangeStatus(el);
        }
    }

    const itemsModalCont = arrDataModalCont.map((el, index) => {
        const isCurrentModalStatus = showModalContSearchStatus ? checkedStatus[el] : checkedLevel[el];

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
                    onChange={() => handleChangeCheck(el, showModalContLevelIs ? checkedLevel : checkedStatus)}
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

    const handleSubmitModalContResume = (checkes: Checkes, typeCheck: string) => {
        const isCheckes = Object.values(checkes).some(value => value === true);
        if (!isCheckes) {
            return;
        }

        let statusHasValue = '';
        for (const key in checkes) {
            if (checkes[key as Status] === true) {
                statusHasValue = key;
            }
        }

        dispatch(setValueModalCont({
            typeField: typeCheck,
            value: statusHasValue
        }))
        showsModalConts('completed')
    }

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
                                        onClick={() => handleSubmitModalContResume(checkedStatus, 'status search')}
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
                                        onClick={() => handleSubmitModalContResume(checkedLevel, 'level IS')}
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