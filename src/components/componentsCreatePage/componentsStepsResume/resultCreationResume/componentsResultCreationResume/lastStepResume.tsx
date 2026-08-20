import React, { useEffect, useState } from "react";
import TitleContsResult from "./titleContsResult";
import { useForm } from 'react-hook-form'
import { Resume, WorkingConditions } from "../../../../../types/typesResume";
import { useAppDispatch, useAppSelector } from "../../../../../hookRedux";
import { PropagateLoader } from "react-spinners";
import { setBusyness, setDescriptionResume, setIdResumeDb, setResumeCompleted, setSalary, setWorkFormat } from "../../../../../store/resumesSlice";
import { arrBusynessResume } from "../../../../../dataArrays/listsResumeOptions";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../../../firebase";
import { v4 as uuidv4 } from 'uuid';


interface Currencies {
    symbol: string,
    name: string
}

interface CheckedBussynes {
    'Part-time job': boolean,
    'Internship': boolean
}

interface CheckedWorkFormat {
    'On-site': boolean,
    'Remote': boolean,
    'Hybrid': boolean
}

const LastStepResume: React.FC = () => {
    const dispatch = useAppDispatch();
    const [isHoverBtnSubm, setIsHoverBtnSumb] = useState<boolean>(false);
    const [isVisibleTitleCont, setIsVisibleTitleCont] = useState<boolean>(true);
    const [isValuesBussynes, setIsValuesBussynes] = useState<boolean>(false);
    const [isValuesWorkFormat, setIsValuesWorkFormat] = useState<boolean>(false);
    const [isShowOthersCurrency, setIsShowOtherCurrencies] = useState<boolean>(false);
    const [arrValuesOtherCurrencies, setArrOtherCurrencies] = useState<string[]>([]);
    const [isOperatInOtherCurrencies, setIsOperatOtherCurrencies] = useState<boolean>(false);
    const { register, setValue, formState: { errors }, watch, handleSubmit } = useForm<WorkingConditions>({ mode: 'onSubmit' });

    const [isLoadingOtherCurrencies, setIsLoadingOtherCurrencies] = useState<boolean>(false);

    const { resumesState } = useAppSelector(state => state.resumes);
    const arrBussynesTypes = arrBusynessResume;
    const arrWorkFormatsTypes = ['On-site', 'Remote', 'Hybrid'];

    const initialCheckedBussynes = {
        'Part-time job': false,
        'Internship': false
    }
    const initialCheckedWorkFormat = {
        'On-site': false,
        'Remote': false,
        'Hybrid': false
    }

    const [checkedBussynes, setCheckedBussynes] = useState<CheckedBussynes>(initialCheckedBussynes);
    const [checkedWorkFormat, setCheckedWorkFormat] = useState<CheckedWorkFormat>(initialCheckedWorkFormat);

    const handleSetChecked = (el: string) => {
        console.log(el)
        if (el in checkedBussynes) {
            if (checkedBussynes[el as keyof CheckedBussynes]) {
                setCheckedBussynes(prev => ({
                    ...prev,
                    [el as keyof CheckedBussynes]: false
                }));
                return;
            } else {
                setCheckedBussynes(prev => ({
                    ...prev,
                    [el as keyof CheckedBussynes]: true
                }));
            }
        } else {
            if (checkedWorkFormat[el as keyof CheckedWorkFormat]) {
                setCheckedWorkFormat(prev => ({
                    ...prev,
                    [el as keyof CheckedWorkFormat]: false
                }));
                return;
            } else {
                setCheckedWorkFormat(prev => ({
                    ...prev,
                    [el as keyof CheckedWorkFormat]: true
                }));
            }
        }
    }


    const bussynesItems = arrBussynesTypes.map((el, index) => {
        const isCheckedEl = checkedBussynes[el as keyof CheckedBussynes];
        return (
            <div
                key={el}
                className={isCheckedEl ? "list-el-last-step_checked" : "list-el-last-step_not-checked"}
                style={{ marginTop: index !== arrBussynesTypes.length ? '10px' : '0px' }}
            >
                <input
                    type="checkbox"
                    className="checkbox-last-step-resume"
                    onClick={() => handleSetChecked(el)}
                    id={`checkbox-bussynes-${index}`}
                    checked={isCheckedEl}
                />
                <label
                    htmlFor={`checkbox-bussynes-${index}`}
                    className="last-step-lists-label"
                >
                    <span
                        style={{ marginLeft: '15px' }}
                    >
                        {el}
                    </span>
                </label>
            </div>
        );
    })

    const workFormatItems = arrWorkFormatsTypes.map((el, index) => {
        const isCheckedEl = checkedWorkFormat[el as keyof CheckedWorkFormat];

        return (
            <div
                key={el}
                className={isCheckedEl ? "list-el-last-step_checked" : "list-el-last-step_not-checked"}
                style={{ marginTop: index !== arrWorkFormatsTypes.length ? '10px' : '0px' }}
            >
                <input
                    type="checkbox"
                    className="checkbox-last-step-resume"
                    onClick={() => handleSetChecked(el)}
                    id={`checkbox-work-format-${index}`}
                    checked={isCheckedEl || false}
                />
                <label
                    htmlFor={`checkbox-work-format-${index}`}
                    className="last-step-lists-label"
                >
                    <span
                        style={{ marginLeft: '15px' }}
                    >
                        {el}
                    </span>
                </label>
            </div>
        );
    })

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisibleTitleCont(false)
        }, 8000)

        return () => clearTimeout(timer);
    }, [])

    const getConvertedCurrencies = async (salaryToConverted: { amount: string, name: string }, neededConvertedCurrency: Currencies[]) => {
        setIsLoadingOtherCurrencies(true);
        try {
            const convertedCurrencies: string[] = [];
            const numericSalaryAmount = Number(salaryToConverted.amount) || 0;

            for (let i = 0; i < neededConvertedCurrency.length; i++) {
                const currency = neededConvertedCurrency[i];

                const response = await fetch(`https://v6.exchangerate-api.com/v6/da31d5f2cb4ae640a1c3b45f/latest/${currency.name}`);
                const data = await response.json();


                const resConvertedValue = (numericSalaryAmount / data.conversion_rates[salaryToConverted.name]).toFixed(4);

                convertedCurrencies.push(`${resConvertedValue} ${currency.symbol}`);
            }

            setIsLoadingOtherCurrencies(false);
            return convertedCurrencies;
        } catch (error) {
            console.error("Ошибка при получении курсов валют:", error);
            setIsLoadingOtherCurrencies(false);
            return [];
        }
    };

    const salaryAmount = watch('salary.amount');

    useEffect(() => {
        setValue('salary.currency', '₽')
    }, [])

    const salaryCurrency = watch('salary.currency')

    const handleConvertCurrencies = () => {
        const fetchCurrencies = async () => {
            if (salaryAmount !== '') {
                const listCurrencies: Currencies[] = [
                    { symbol: '₽', name: 'RUB' },
                    { symbol: '$', name: 'USD' },
                    { symbol: '€', name: 'EUR' }
                ];

                const filterNeededConvertedCurrencies = listCurrencies.filter(currency => currency.symbol !== salaryCurrency);
                const findNeededConvertedCurrency = listCurrencies.find(currency => currency.symbol === salaryCurrency);

                const salaryToConvertedCurrency = {
                    amount: salaryAmount || '1000',
                    name: findNeededConvertedCurrency?.name || 'USD'
                }

                const convertedCurrencies: string[] = await getConvertedCurrencies(salaryToConvertedCurrency, filterNeededConvertedCurrencies); // ⬅ Ждём результат


                setArrOtherCurrencies(convertedCurrencies);
            }
        };

        fetchCurrencies();
    }

    const handleShowOtherCurrencies = () => {
        handleConvertCurrencies();
        if (isShowOthersCurrency) {
            setIsShowOtherCurrencies(false);
            return;
        }
        setIsShowOtherCurrencies(true);
    }


    const handleReFetchConvertedCurrencies = () => {
        if (isShowOthersCurrency && salaryAmount && !errors.salary?.amount && arrValuesOtherCurrencies.length > 0) {
            handleConvertCurrencies();
        }
    }
    useEffect(() => {
        if (salaryAmount !== '') {
            if (Number(salaryAmount) >= 10 && salaryCurrency !== '₽') {
                setIsOperatOtherCurrencies(true);
            }
            else if (Number(salaryAmount) >= 1000 && salaryCurrency === '₽') {
                setIsOperatOtherCurrencies(true);
            }
            else {
                setIsOperatOtherCurrencies(false);
            }
        }
        else {
            setIsOperatOtherCurrencies(false);
        }
    }, [salaryAmount, salaryCurrency])

    const hasTrueValuesWorkFormat = Object.values(checkedWorkFormat).some(value => value === true);
    const hasTrueValuesBussynes = Object.values(checkedBussynes).some(value => value === true);
    useEffect(() => {
        if (hasTrueValuesBussynes) {
            setIsValuesBussynes(false)
        }
        if (hasTrueValuesWorkFormat) {
            setIsValuesWorkFormat(false)
        }
    }, [checkedBussynes, checkedWorkFormat])



    const submitForm = async (data: WorkingConditions) => {
        if (hasTrueValuesBussynes && hasTrueValuesWorkFormat) {
            dispatch(setSalary({
                amount: data.salary?.amount || '0',
                currency: data.salary?.currency || '0'
            }));
            dispatch(setBusyness(data.busyness || []));
            dispatch(setWorkFormat(data.workFormat || []));
            dispatch(setDescriptionResume(data.descriptionResume));

            //тут эту логику нужно перенести в посл след степа, где будет редактирование

            // try {
            //     const uniqueId = uuidv4();
            //     const docRef = doc(db, 'resumes', uniqueId);

            //     const formattedResumes: Resume = {
            //         nameResume: resumesState.nameResume,
            //         basicInfo: resumesState.basicInfo,
            //         education: resumesState.education,
            //         projectsProfile: resumesState.projectsProfile || [],
            //         petProjects: resumesState.petProjects || [],
            //         positions: resumesState.positions || [],
            //         amountTimeWorked: resumesState.amountTimeWorked || 'No expirience',
            //         skills: resumesState.skills,
            //         statusSearchResume: resumesState.statusSearchResume || 'Default',
            //         levelIsResume: resumesState.levelIsResume || 'Default',
            //         salary: data.salary,
            //         descriptionResume: data.descriptionResume,
            //         busyness: data.busyness,
            //         workFormat: data.workFormat
            //     }

            //     await setDoc(docRef, formattedResumes);

            //     dispatch(setIdResumeDb(uniqueId));
            // } catch (error) {
            //     console.log(error);
            // }
            // dispatch(setResumeCompleted());
            return;
        }
        else {
            if (!hasTrueValuesWorkFormat) {
                setIsValuesBussynes(true);
            }
            if (!hasTrueValuesBussynes) {
                setIsValuesWorkFormat(true);
            }
        }
    }

    return isVisibleTitleCont ? <TitleContsResult setIsVisibleTitleCont={setIsVisibleTitleCont} textTitle={"The last step to creating the perfect resume - is to fill out the job conditions"} /> : (
        <form onSubmit={handleSubmit(submitForm)} className="form-last-step-resume">
            <div className="info-input">
                <span className="name-input">Work format</span>
                <div className="work-formats-types-items">
                    {workFormatItems}
                </div>
                {isValuesWorkFormat && <p className="erorrs-inp-last-step_top-conts" style={{ marginTop: '190px' }}>Set work format</p>}
            </div>
            <div className="info-input bussynes-cont">
                <div className="right-side-modal-cont">
                    <span className="name-input">Employment type</span>
                    <div className="bussynes-types-items">
                        {bussynesItems}
                    </div>
                    {isValuesBussynes && <p className="erorrs-inp-last-step_top-conts" style={{ marginTop: '5px' }}>Set bussynes</p>}
                </div>
            </div>
            <div className="info-input">
                <span className="name-input">About you</span>
                <textarea
                    className="text-area-desc-resume"
                    style={{ border: !errors.descriptionResume ? '1px solid white' : '1px solid red' }}
                    {...register('descriptionResume', {
                        required: 'Tell us about yourself, this will increase the chance of knowing the best about you'
                    })}>
                </textarea>
                {errors.descriptionResume && <p className="erorrs-inp-last-step">{errors.descriptionResume.message}</p>}
            </div>
            <div className="info-input salary-cont">
                <div className="right-side-modal-cont">
                    <span className="name-input">Salary</span>
                    <div className="inputs-salary">
                        <input
                            type='number'
                            className={!errors.salary?.amount ? "input-last-step salary-input" : "input-errors-last-step salary-input"}
                            {...register('salary.amount', {
                                required: 'Set your expected salary'
                            })}
                        />
                        <select
                            {...register('salary.currency', {
                            })}
                            onClick={handleReFetchConvertedCurrencies}
                            className={!errors.salary?.amount ? "select-currency-salary" : "select-errors-currency-salary"}
                        >
                            <option value="₽">
                                ₽
                            </option>
                            <option value="$">
                                $
                            </option>
                            <option value="€">
                                €
                            </option>
                        </select>
                    </div>
                    {errors?.salary?.amount && <p className="erorrs-inp-last-step">{errors.salary.amount.message}</p>}
                    {salaryAmount && !errors.salary?.amount && isOperatInOtherCurrencies &&
                        <div className="other-currencies-salary">
                            <span className={!isLoadingOtherCurrencies ? "text-is-show-other-currencies" : "text-is-show-other-currencies_is-loading"} onClick={handleShowOtherCurrencies}>
                                {arrValuesOtherCurrencies.length > 0 ? 'Hide in other currencies' : 'Show in other currencies'}
                            </span>
                            {isLoadingOtherCurrencies && <PropagateLoader size={5} color="#007bff" className="loading-other-currencies" />}
                            {isShowOthersCurrency && <div className="other-currencies">
                                <span className="text-currency">
                                    {arrValuesOtherCurrencies[0]}
                                </span>
                                <span className="text-currency" style={{ marginTop: '2.5px' }}>
                                    {arrValuesOtherCurrencies[1]}
                                </span>
                            </div>}
                        </div>
                    }
                </div>
            </div>
            <button
                type="submit"
                className="btn-subm-last-step"
                onMouseEnter={() => setIsHoverBtnSumb(true)}
                onMouseLeave={() => setIsHoverBtnSumb(false)}
            >
                Finish creation
            </button>
        </form>
    );
};

export default LastStepResume;