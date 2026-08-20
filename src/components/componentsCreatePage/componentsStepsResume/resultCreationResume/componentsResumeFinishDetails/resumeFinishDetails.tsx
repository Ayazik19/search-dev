import React, { useState } from "react";
import './resumeFinishDetails.css'
import { useAppDispatch, useAppSelector } from "../../../../../hookRedux";
import TitleContsResult from "../componentsResultCreationResume/titleContsResult";
import { useForm } from "react-hook-form";
import { Salary } from "../../../../../types/typesResume";
import iconDownDropdownOpen from '../../../../../../dist/icons/iconDownDropdownOpen.png';
import iconUpDropdownHide from '../../../../../../dist/icons/iconUpDropdownHide.png';

import {
    arrBusynessResume,
    arrCurrencyResume,
    arrStatusSearchResume,
    arrWorkFormatResume,
} from "../../../../../dataArrays/listsResumeOptions";
import { setBusyness, setSalary, setStatusSearchResume, setWorkFormat } from "../../../../../store/resumesSlice";

interface Props {
    setIsVisibleTitleCont: (value: boolean) => void;
    isVisibleTitleCont: boolean;
    setIsFinishedResumeDetails: (value: boolean) => void;
}

interface FormResumeFinishDetailsValues {
    statusSearchResume: string,
    busyness: string[],
    workFormat: string[],
    salary: Salary
}

const ResumeFinishDetails: React.FC<Props> = ({ setIsVisibleTitleCont, isVisibleTitleCont, setIsFinishedResumeDetails }) => {
    const dispatch = useAppDispatch();
    const { resumesState } = useAppSelector(state => state.resumes)

    const [selectedStatus, setSelectedStatus] = useState<string>(resumesState.statusSearchResume ?? arrStatusSearchResume[0])
    const [selectedBusyness, setSelectedBusyness] = useState<string[]>(resumesState.busyness ?? [])
    const [selectedWorkFormat, setSelectedWorkFormat] = useState<string[]>(resumesState.workFormat ?? [])
    const [selectedCurrency, setSelectedCurrency] = useState<string>(resumesState.salary?.currency ?? 'USD')
    const [salaryValue, setSalaryValue] = useState<string>(resumesState.salary?.amount ?? '')

    const [errorInpStatus, setErrorInpStatus] = useState<string>('');
    const [errorInpBusyness, setErrorInpBusyness] = useState<string>('');
    const [errorWorkFormat, setErrorWorkFormat] = useState<string>('');
    const [errorInpSalaryValue, setErrorInpSalaryValue] = useState<string>('');



    const [isStatusOpen, setIsStatusOpen] = useState<boolean>(false)
    const [isBusynessOpen, setIsBusynessOpen] = useState<boolean>(false)
    const [isCurrencyOpen, setIsCurrencyOpen] = useState<boolean>(false)
    const [isWorkFormatOpen, setIsWorkFormatOpen] = useState<boolean>(false)
    const [isOpenSelectStatus, setIsOpenSelectStatus] = useState<boolean>(false);


    const handleCheckboxToggle = (
        value: string,
        setValues: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        setValues((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        )
    }

    const handleSubmitDataFinishDetailsValue = () => {
        if (selectedStatus === '') {
        }
        else {
            dispatch(setStatusSearchResume(selectedStatus))
        }

        if (selectedBusyness.length > 0 || (selectedBusyness.length === 0 && (resumesState.busyness?.length ?? 0) > 0)) {
            dispatch(setBusyness(selectedBusyness));
        }


        // Для workFormat
        if (selectedWorkFormat.length > 0 || (selectedWorkFormat.length === 0 && (resumesState.workFormat?.length ?? 0) > 0)) {
            dispatch(setWorkFormat(selectedWorkFormat));
        }

        // Для salary
        if (salaryValue !== '' || (salaryValue === '' && resumesState.salary?.amount !== '')) {
            dispatch(setSalary({ currency: selectedCurrency, amount: salaryValue }));
        }


        setIsVisibleTitleCont(true)
        setIsFinishedResumeDetails(true);
    }

    const renderDropdownValue = (values: string[], placeholder: string): string => {
        const filteredValues = values.filter(v => v && v.trim() !== '');

        if (filteredValues.length === 0) {
            return placeholder;
        }

        if (filteredValues.length === 1) {
            return filteredValues[0];
        }

        return filteredValues.join(', ');
    };

    const handleToggleSelectEmplType = () => {
        setIsBusynessOpen((prev) => !prev)
        setIsStatusOpen(false)
        setIsWorkFormatOpen(false)
    }

    const handleToggleSelectWorkFormat = () => {
        setIsWorkFormatOpen((prev) => !prev)
        setIsStatusOpen(false)
        setIsBusynessOpen(false)
    }


    return isVisibleTitleCont ?
        <TitleContsResult
            textTitle={'Just a few details left'}
            setIsVisibleTitleCont={setIsVisibleTitleCont}
        />
        :
        (
            <div className="resume-finish-details">
                <header className="header-resume-finish-details">
                    <span className="header-text-resume-finish-details">Let’s finalize your resume</span>
                </header>
                <main className="main-resume-finish-details">
                    <span className="desc-resume-finish-details">
                        You’ve filled most of your resume. Add the missing details below to finish it.
                    </span>
                    <form className="form-resume-finish-details">
                        <div className="info-select-resume-finish-details">
                            <span className="main-text-info-resume-finish-details">
                                Job search status
                            </span>
                            <select
                                value={selectedStatus}
                                onClick={() => setIsOpenSelectStatus(prev => !prev)}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="select-resume-finish-details"
                            >
                                {arrStatusSearchResume.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                            <img
                                src={isOpenSelectStatus ? iconUpDropdownHide : iconDownDropdownOpen}
                                className="icon-dropdown-toggle"
                                onClick={() => setIsOpenSelectStatus(prev => !prev)}
                            />
                        </div>

                        <div className="info-select-resume-finish-details">
                            <span className="main-text-info-resume-finish-details">
                                Employment type
                            </span>
                            <button
                                type="button"
                                className="select-resume-finish-details"
                                onClick={handleToggleSelectEmplType}
                            >
                                {renderDropdownValue(selectedBusyness, 'Select employment type')}
                            </button>
                            <img
                                src={isBusynessOpen ? iconUpDropdownHide : iconDownDropdownOpen}
                                className="icon-dropdown-toggle"
                                onClick={handleToggleSelectEmplType}
                            />
                            {isBusynessOpen && (
                                <div className="dropdown-resume-finish-details">
                                    {arrBusynessResume.map((busyness) => (
                                        <label key={busyness} className="dropdown-option-resume-finish-details">
                                            <input
                                                type="checkbox"
                                                checked={selectedBusyness.includes(busyness)}
                                                onChange={() => handleCheckboxToggle(busyness, setSelectedBusyness)}
                                            />
                                            <span>{busyness}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="info-select-resume-finish-details">
                            <span className="main-text-info-resume-finish-details">
                                Work format
                            </span>
                            <button
                                type="button"
                                className="select-resume-finish-details"
                                onClick={handleToggleSelectWorkFormat}
                            >
                                {renderDropdownValue(selectedWorkFormat, 'Select work format')}
                            </button>
                            <img
                                src={isWorkFormatOpen ? iconUpDropdownHide : iconDownDropdownOpen}
                                className="icon-dropdown-toggle"
                                onClick={handleToggleSelectWorkFormat}
                            />
                            {isWorkFormatOpen && (
                                <div className="dropdown-resume-finish-details">
                                    {arrWorkFormatResume.map((workFormat) => (
                                        <label key={workFormat} className="dropdown-option-resume-finish-details">
                                            <input
                                                type="checkbox"
                                                checked={selectedWorkFormat.includes(workFormat)} onChange={() => handleCheckboxToggle(workFormat, setSelectedWorkFormat)}
                                            />
                                            <span>{workFormat}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="info-select-resume-finish-details">
                            <span className="main-text-info-resume-finish-details">
                                Salary
                            </span>
                            <div className="selects-salary-resume-finish-details">
                                <select
                                    className="select-resume-finish-details"
                                    value={selectedCurrency}
                                    onClick={() => setIsCurrencyOpen(prev => !prev)}
                                    onChange={(e) => setSelectedCurrency(e.target.value)}
                                >
                                    {arrCurrencyResume.map((currency) => (
                                        <option key={currency} value={currency}>{currency}</option>
                                    ))}
                                </select>
                                <img
                                    onClick={() => setIsCurrencyOpen(prev => !prev)}
                                    src={isCurrencyOpen ? iconUpDropdownHide : iconDownDropdownOpen}
                                    className="icon-dropdown-toggle_select-currency"
                                />
                                <input
                                    type="number"
                                    className="select-resume-finish-details"
                                    value={salaryValue}
                                    onChange={(e) => setSalaryValue(e.target.value)}
                                    placeholder="Amount"
                                />
                            </div>
                        </div>
                    </form>
                    <footer className="footer-resume-finish-details">
                        <button className="btn-resume-finish-details" onClick={handleSubmitDataFinishDetailsValue}>Next</button>
                    </footer>
                </main>
            </div>
        )
}

export default ResumeFinishDetails