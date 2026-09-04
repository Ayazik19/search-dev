import React, { useEffect, useRef, useState } from "react";
import './resumeFinishDetails.css'
import { useAppDispatch, useAppSelector } from "../../../../../hookRedux";
import TitleContsResult from "../componentsResultCreationResume/titleContsResult";
import { useForm } from "react-hook-form";
import { currenySalary, levelIsResume, Salary, statusSearchResume } from "../../../../../types/typesResume";
import iconDownDropdownOpen from '../../../../../../dist/icons/iconDownDropdownOpen.png';
import iconUpDropdownHide from '../../../../../../dist/icons/iconUpDropdownHide.png';

import {
    arrBusynessResume,
    arrCurrencyResume,
    arrLevelsGradeResume,
    arrStatusSearchResume,
    arrWorkFormatResume,
} from "../../../../../dataArrays/listsResumeOptions";
import { setBusyness, setDescriptionResume, setLevelIsResume, setSalary, setStatusSearchResume, setWorkFormat } from "../../../../../store/resumesSlice";

interface Props {
    setIsVisibleTitleCont: (value: boolean) => void;
    isVisibleTitleCont: boolean;
    setIsFinishedResumeDetails: (value: boolean) => void;
    isScrollFormResumeFinishDetailsToBottom: boolean;
    setIsScrollFormResumeFinishDetailsToBottom: (value: boolean) => void;
}

const ResumeFinishDetails: React.FC<Props> = ({
    isScrollFormResumeFinishDetailsToBottom, setIsScrollFormResumeFinishDetailsToBottom,
    setIsVisibleTitleCont, isVisibleTitleCont, setIsFinishedResumeDetails
}) => {
    const dispatch = useAppDispatch();
    const { resumesState } = useAppSelector(state => state.resumes)

    const formRef = useRef<HTMLFormElement | null>(null)
    const [formScroll, setFormScroll] = useState<number>(0);

    const [selectedStatus, setSelectedStatus] = useState<statusSearchResume | undefined>(
        resumesState.statusSearchResume
    )
    const [selectedSkillGrade, setSelectedSkillGrade] = useState<levelIsResume | undefined>(resumesState.levelIsResume ?? undefined)
    const [selectedBusyness, setSelectedBusyness] = useState<string[]>(resumesState.busyness ?? [])
    const [selectedWorkFormat, setSelectedWorkFormat] = useState<string[]>(resumesState.workFormat ?? [])
    const [selectedCurrency, setSelectedCurrency] = useState<currenySalary>(resumesState.salary?.currency !== undefined ? resumesState.salary?.currency : 'USD')
    const [salaryValue, setSalaryValue] = useState<string>(resumesState.salary?.amount !== undefined ? resumesState.salary.amount : '')
    const [aboutDev, setAboutDev] = useState<string>(resumesState.descriptionResume ?? '')

    const [isStatusOpen, setIsStatusOpen] = useState<boolean>(false)
    const [isBusynessOpen, setIsBusynessOpen] = useState<boolean>(false)
    const [isCurrencyOpen, setIsCurrencyOpen] = useState<boolean>(false)
    const [isWorkFormatOpen, setIsWorkFormatOpen] = useState<boolean>(false)
    const [isOpenSelectStatus, setIsOpenSelectStatus] = useState<boolean>(false);
    const [isOpenSelectSkillGrade, setIsOpenSelectSkillGrade] = useState<boolean>(false);

    if (isScrollFormResumeFinishDetailsToBottom) {
        const scrollFormToBottom = () => {
            requestAnimationFrame(() => {
                if (!formRef.current) return

                setTimeout(() => {
                    formRef.current?.scrollTo({
                        top: formRef.current.scrollHeight,
                        behavior: 'smooth',
                    });
                }, 150);
            })
        }

        scrollFormToBottom()

        setIsScrollFormResumeFinishDetailsToBottom(false)
    }

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
        if (selectedStatus) {
            dispatch(setStatusSearchResume(selectedStatus));
        }

        if (selectedBusyness.length > 0 || (selectedBusyness.length === 0 && (resumesState.busyness?.length ?? 0) > 0)) {
            dispatch(setBusyness(selectedBusyness));
        }

        if (selectedWorkFormat.length > 0 || (selectedWorkFormat.length === 0 && (resumesState.workFormat?.length ?? 0) > 0)) {
            dispatch(setWorkFormat(selectedWorkFormat));
        }

        if (salaryValue !== '' || (salaryValue === '' && resumesState.salary?.amount !== '')) {
            dispatch(setSalary({ currency: selectedCurrency, amount: salaryValue }));
        }

        if (aboutDev !== '' || (aboutDev === '' && resumesState.descriptionResume !== '')) {
            dispatch(setDescriptionResume(aboutDev));
        }

        if (selectedSkillGrade !== undefined || (selectedSkillGrade === undefined && resumesState.levelIsResume !== undefined)) {
            if(selectedSkillGrade !== undefined) dispatch(setLevelIsResume(selectedSkillGrade));
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

    const handleScroll = () => {
        if (!formRef.current) return
        setFormScroll(formRef.current.scrollTop)
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
                    <form className="form-resume-finish-details" ref={formRef} onScroll={handleScroll}>
                        <div className="info-select-resume-finish-details">
                            <span className="main-text-info-resume-finish-details">
                                Job search status
                            </span>
                            <select
                                value={selectedStatus ?? ''}
                                onClick={() => setIsOpenSelectStatus(prev => !prev)}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSelectedStatus(value ? (value as statusSearchResume) : undefined);
                                }}
                                className="select-resume-finish-details"
                            >
                                <option value="" disabled selected>Select status search</option>
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
                                    onChange={(e) => setSelectedCurrency(e.target.value as currenySalary)}
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

                        <div className="info-select-resume-finish-details">
                            <span className="main-text-info-resume-finish-details">
                                Skill grade
                            </span>
                            <select
                                value={selectedSkillGrade ?? ''}
                                onClick={() => setIsOpenSelectSkillGrade(prev => !prev)}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSelectedSkillGrade(value ? (value as levelIsResume) : undefined);
                                }}
                                className="select-resume-finish-details"
                            >
                                <option value="" disabled selected>Select skill grade</option>
                                {arrLevelsGradeResume.map((level) => (
                                    <option key={level} value={level}>
                                        {level}
                                    </option>
                                ))}
                            </select>
                            <img
                                src={isOpenSelectSkillGrade ? iconUpDropdownHide : iconDownDropdownOpen}
                                className="icon-dropdown-toggle"
                                onClick={() => setIsOpenSelectSkillGrade(prev => !prev)}
                            />
                        </div>

                        <div className="info-select-resume-finish-details">
                            <span className="main-text-info-resume-finish-details">
                                About you
                            </span>
                            <div className="selects-salary-resume-finish-details">
                                <textarea
                                    className="text-area-resume-finish-details"
                                    value={aboutDev}
                                    placeholder="Tell about yourself"
                                    onChange={(e) => setAboutDev(e.target.value)}
                                >
                                    {aboutDev}
                                </textarea>
                            </div>
                        </div>
                    </form>
                </main>
                <footer className="footer-resume-finish-details">
                    <button className="btn-resume-finish-details" onClick={handleSubmitDataFinishDetailsValue}>Next</button>
                </footer>
            </div>
        )
}

export default ResumeFinishDetails