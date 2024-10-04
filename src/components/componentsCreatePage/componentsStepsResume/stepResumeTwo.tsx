import React, { isValidElement, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hookRedux";
import { useForm } from "react-hook-form";
import { setBackStep, setNextStep } from "../../../store/stepsResume";
import iconGreyShowFpCont from './iconGreyShowFpCont.png';
import iconWhiteShowFpCont from './iconWhiteShowFpCont.png';
import iconCloseFpCont from './iconCloseFpCont.png'
import iconDeleteCountryItem from './iconDeleteCountryItem.png';
import { setBasicInfo } from "../../../store/resumesSlice";
import { arrCountries } from "../../../dataArrays/listCountry";
import FpContCountry from "./fpContCountry";

interface FormValues {
    firstName: string,
    lastName: string,
    patronymic: string,
    gender: string,
    city: string,
    dateBirth: {
        day: string,
        month: string,
        year: string
    };
    citizenship: string[],
    workPermit: string[],
    elAddress: string,
    phoneNumber: string
}

interface PropsHandle {
    handleBackStep: (data: boolean) => void;
}


const StepResumeTwo: React.FC<PropsHandle> = (props) => {
    const dispatch = useAppDispatch();


    const [arrSelectedCitizenship, setArrSelectedCitizenship] = useState<string[]>([]);
    const [arrSelectedWorkPermit, setArrSelectedWorkPermit] = useState<string[]>([]);

    const [isActive, setIsActive] = useState<boolean>(false);

    const { stateStepsResume } = useAppSelector(state => state.stepsResume)
    const isStepOne = stateStepsResume.stepsResume.stepOne;
    const isStepTwo = stateStepsResume.stepsResume.stepTwo;
    const isStepThree = stateStepsResume.stepsResume.stepThree;
    const isStepFour = stateStepsResume.stepsResume.stepFour;
    const isStepFive = stateStepsResume.stepsResume.stepFive;


    const [hoverIconFpCitiz, setHoverIconFpCitiz] = useState<boolean>(false);
    const [hoverIconFpWorkPermit, setHoverIconFpWorkPermit] = useState<boolean>(false);

    const [isFullPageCitizenship, setIsFullPageCitizenship] = useState<boolean>(false);
    const [isFullPageWorkPermit, setIsFullPageWorkPermit] = useState<boolean>(false);
    const [selecteGender, setSelectedGender] = useState<string>('m');
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ mode: 'onTouched' });
    const { resumesState } = useAppSelector(state => state.resumes);

    const nameResume = resumesState[0]?.nameResume;

    const stateBasicInfo = resumesState[0]?.basicInfo;
    const stateFirstName = stateBasicInfo?.firstName;
    const stateLastName = stateBasicInfo?.lastName;
    const statePatronymic = stateBasicInfo?.patronymic;
    const stateCity = stateBasicInfo?.city;
    const stateGender = stateBasicInfo?.gender;

    const stateDateBirth = stateBasicInfo?.dateBirth;
    const stateDayBirth = stateDateBirth?.day;
    const stateMonthBirth = stateDateBirth?.month;
    const stateYearBirth = stateDateBirth?.year;

    const stateWorkPermit = stateBasicInfo?.workPermit;
    const stateCitizenship = stateBasicInfo?.citizenship;
    const stateElAddrees = stateBasicInfo?.elAddress;
    const statePhoneNumber = stateBasicInfo?.phoneNumber;

    useEffect(() => {
        setArrSelectedCitizenship(stateCitizenship ?? [])
        setArrSelectedWorkPermit(stateWorkPermit ?? [])
    },[stateWorkPermit, stateCitizenship])

    const handleInpCountryCitiz = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        const isAlreadyEl = arrSelectedCitizenship.find(el => el === value);

        console.log(isAlreadyEl)

        arrCountries.map((el) => {
            if (value === el && !isAlreadyEl) {
                if(arrSelectedCitizenship){
                    setArrSelectedCitizenship([...arrSelectedCitizenship, el]);
                    return;
                }
                else{
                    setArrSelectedCitizenship([el]);
                    return;
                }
            }
        })
    }

    const handleInpCountryWoPer = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        const isAlreadyEl = arrSelectedWorkPermit.find(el => el === value);

        arrCountries.map((el) => {
            if (value === el && !isAlreadyEl) {
                if(arrSelectedWorkPermit){
                    setArrSelectedWorkPermit([...arrSelectedWorkPermit, el]);
                    return;
                }
                else{
                    setArrSelectedWorkPermit([el]);
                    return;
                }
            }
        })
    }

    const onSubmitForm = (data: FormValues) => {
        dispatch(setNextStep());
        const formattedData = {
            ...data,
            citizenship: arrSelectedCitizenship,
            workPermit: arrSelectedWorkPermit,
            dateBirth: {
                day: data.dateBirth.day,
                month: data.dateBirth.month,
                year: data.dateBirth.year
            }
        };
        dispatch(setBasicInfo(formattedData))
    };

    const handleSelectedCountry = (data: string[], type: string) => {
        return type === 'citizenship' ? setArrSelectedCitizenship(data) : setArrSelectedWorkPermit(data);
    }

    const lengthArrCitiz = arrSelectedCitizenship && arrSelectedCitizenship.length;
    const lengthArrWoPer = arrSelectedWorkPermit && arrSelectedWorkPermit.length;


    const citizensipItems = arrSelectedCitizenship && arrSelectedCitizenship.map((el, index) => {
        return (
            <div key={el} className={`citizenships-items-${index + 1}`}>
                <div className="el-citizenships">
                    <span className="text-citizenship">{el}</span>
                    <img
                        className="icon-delete-citizenship"
                        src={iconDeleteCountryItem}
                        onClick={() => setArrSelectedCitizenship(arrSelectedCitizenship.filter(country => country !== el))}
                    />
                </div>
            </div>
        )
    })
    const workPermitItems = arrSelectedWorkPermit && arrSelectedWorkPermit.map((el, index) => {
        return (
            <div key={el} className={`work-permit-items-${index + 1}`}>
                <div className="el-work-permit">
                    <span className="text-work-permit">{el}</span>
                    <img
                        className="icon-delete-work-permit"
                        src={iconDeleteCountryItem}
                        onClick={() => setArrSelectedWorkPermit(arrSelectedWorkPermit.filter(country => country !== el))}
                    />
                </div>
            </div>
        )
    })

    return (
        <div className="step-resume-creation">
            <div className="resume-creation">
                <span className="main-text-step">
                    Fill in the basic information
                </span>
                <span className="description-text-step">
                    Resume {nameResume}
                </span>
                <form
                    onSubmit={handleSubmit(onSubmitForm)}
                    className="main-resume-user-contacts"
                >
                    <div className="contact-info name-info">
                        <span className="name-contact">Name</span>
                        <input
                            type="text"
                            value={stateFirstName}
                            className={!errors?.firstName ? "input-contacts_full-width" : "input-contacts_full-width_errors"}
                            {...register('firstName', {
                                maxLength: {
                                    value: 15,
                                    message: 'Wrong first name'
                                },
                                pattern: {
                                    value: /^[A-Za-z]+$/,
                                    message: 'Name contains only letters'
                                },
                                required: 'Set your first name'
                            })}
                        />
                        {errors?.firstName ? <p className="errors-input-contacts">{errors?.firstName.message}</p> : null}
                    </div>
                    <div className="contact-info surname-info">
                        <span className="name-contact">Surname</span>
                        <input
                            type="text"
                            value={stateLastName}
                            className={!errors?.lastName ? "input-contacts_full-width" : "input-contacts_full-width_errors"}
                            {...register('lastName', {
                                maxLength: {
                                    value: 15,
                                    message: 'Wrong last name'
                                },
                                pattern: {
                                    value: /^[A-Za-z]+$/,
                                    message: 'Name contains only letters'
                                },
                                required: 'Set your lastname'
                            })}
                        />
                        {errors?.lastName ? <p className="errors-input-contacts">{errors?.lastName.message}</p> : null}
                    </div>
                    <div className="contact-info patronymic-info">
                        <span className="name-contact">Patronymic</span>
                        <input
                            type="text"
                            className="input-contacts_full-width"
                            value={statePatronymic}
                            {...register('patronymic')}
                        />
                    </div>
                    <div className="contact-info gender-info">
                        <span className="name-contact">Gender</span>
                        <div className="gender-types">
                            <div
                                className={
                                    stateGender !== '' && stateGender === 'm'
                                        ? "gender_type-m-selected"
                                        : selecteGender === 'm'
                                            ? "gender_type-m-selected"
                                            : 'gender_type-m'
                                } onClick={() => setSelectedGender('m')}
                            >
                                <span className="text-gender">
                                    Male
                                </span>
                            </div>
                            <div
                                className={
                                    stateGender !== '' && stateGender === 'f'
                                        ? "gender_type-m-selected"
                                        : selecteGender === 'f'
                                            ? "gender_type-f-selected"
                                            : 'gender_type-f'
                                } onClick={() => setSelectedGender('f')}
                            >
                                <span className="text-gender">
                                    Female
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="contact-info location-info">
                        <span className="name-contact">Select your city or region</span>
                        <input
                            value={stateCity}
                            className={!errors?.city ? "input-contacts_full-width" : "input-contacts_full-width_errors"}
                            {...register('city', {
                                required: 'Set your city',
                                pattern: {
                                    value: /^[A-Za-z]+$/,
                                    message: 'Set correct city'
                                }
                            })}
                        >
                        </input>
                        {errors?.city && <p className="errors-input-contacts">{errors?.city.message}</p>}
                    </div>
                    <div className="contact-info  birth-info">
                        <span className="name-contact">Date birth</span>
                        <div className="set-date">
                            <input
                                value={stateDayBirth}
                                type="text"
                                className={errors?.dateBirth?.day || errors?.dateBirth?.month || errors?.dateBirth?.year ? "input-date-1_error" : "input-date-1"}
                                placeholder="Day"
                                {...register('dateBirth.day', {
                                    pattern: {
                                        value: /^(0[1-9]|[12][0-9]|3[01])$/,
                                        message: 'Wrong day birth'
                                    },
                                    required: 'Set your day birth'
                                })}
                            />
                            <select
                                id='date-birth'
                                value={stateMonthBirth}
                                className={errors?.dateBirth?.day || errors?.dateBirth?.month || errors?.dateBirth?.year ? "select-date_error" : "select-date"}
                                {...register('dateBirth.month', {
                                    required: 'Set your month birth'
                                })}>
                                <option value=''></option>
                                <option value='January' className="aa">January</option>
                                <option value='February'>February</option>
                                <option value='March'>March</option>
                                <option value='April'>April</option>
                                <option value='May'>May</option>
                                <option value='June'>June</option>
                                <option value='July'>July</option>
                                <option value='August'>August</option>
                                <option value='September'>September</option>
                                <option value='October'>October</option>
                                <option value='November'>November</option>
                                <option value='December'>December</option>
                            </select>
                            <input
                                value={stateYearBirth}
                                type="text"
                                className={errors?.dateBirth?.day || errors?.dateBirth?.month || errors?.dateBirth?.year ? "input-date-2_error" : "input-date-2"}
                                placeholder="Year"
                                {...register('dateBirth.year', {
                                    pattern: {
                                        value: /^(196[0-9]|197[0-9]|198[0-9]|199[0-9]|200[0-8])$/,
                                        message: 'Wrong year birth'
                                    },
                                    required: 'Set your year birth'
                                })} />
                            {errors?.dateBirth?.day && !errors?.dateBirth?.year && !errors?.dateBirth?.month ? <p className="errors-input-contacts_date">{errors?.dateBirth.day.message}</p> : null}
                            {errors?.dateBirth?.month && !errors?.dateBirth?.year && !errors?.dateBirth?.day ? <p className="errors-input-contacts_date">{errors?.dateBirth.month.message}</p> : null}
                            {errors?.dateBirth?.year && !errors?.dateBirth?.day && !errors?.dateBirth?.month ? <p className="errors-input-contacts_date">{errors?.dateBirth.year.message}</p> : null}

                            {errors?.dateBirth?.year && errors?.dateBirth?.month && errors?.dateBirth?.day ?
                                <p className="errors-input-contacts_date">Set your full date birth</p>
                                : null}
                            {errors?.dateBirth?.year && !errors?.dateBirth?.month && errors?.dateBirth?.day ?
                                <p className="errors-input-contacts_date">Set your day and year date birth</p>
                                : null}
                            {!errors?.dateBirth?.year && errors?.dateBirth?.month && errors?.dateBirth?.day ?
                                <p className="errors-input-contacts_date">Set your day and month date birth</p>
                                : null}
                            {errors?.dateBirth?.year && !errors?.dateBirth?.month && errors?.dateBirth?.day ?
                                <p className="errors-input-contacts_date">Set your day and year date birth</p>
                                : null}
                            {errors?.dateBirth?.year && errors?.dateBirth?.month && !errors?.dateBirth?.day ?
                                <p className="errors-input-contacts_date">Set your month and year date birth</p>
                                : null}
                        </div>

                    </div>
                    <div className="contact-info el-address-info" >
                        <span className="name-contact">E-mail</span>
                        <input
                            value={stateElAddrees}
                            type="text"
                            className={errors?.elAddress ? "input-contacts_full-width_errors" : "input-contacts_full-width"}
                            placeholder="sample@mail.ru"
                            {...register('elAddress', {
                                required: 'Set your el-address',
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/,
                                    message: 'Email address is not valid'
                                }
                            })}
                        />
                        {errors?.elAddress ? <p className="errors-input-contacts">{errors?.elAddress.message}</p> : null}
                    </div>
                    <div className="contact-info tel-number-info" >
                        <span className="name-contact">Phone number</span>
                        <input
                            value={statePhoneNumber}
                            type="text"
                            className={errors?.phoneNumber ? "input-contacts_full-width_errors" : "input-contacts_full-width"}
                            placeholder="+7"
                            {...register('phoneNumber', {
                                required: 'Set your phone number',
                                pattern: {
                                    value: /^\+7\d{10}$/,
                                    message: 'Phone number must start with +7 and 10 digits'
                                }
                            })}
                        />
                        {errors?.phoneNumber ? <p className="errors-input-contacts">{errors?.phoneNumber.message}</p> : null}
                    </div>
                    <div className="contact-info citizenship-info" >
                        <span className="name-contact">Citizenship</span>
                        <input
                            type="text"
                            className={lengthArrCitiz === 0 && !isFullPageCitizenship ? "input-contacts_full-width_errors" : "input-contacts_full-width"}
                            {...register('citizenship')}
                            onChange={handleInpCountryCitiz}
                        />
                        <img
                            src={hoverIconFpCitiz ? iconGreyShowFpCont : iconWhiteShowFpCont}
                            onClick={() => setIsFullPageCitizenship(true)}
                            onMouseOver={() => setHoverIconFpCitiz(true)}
                            onMouseLeave={() => setHoverIconFpCitiz(false)}
                            className="icon-show-fp-cont-location"
                        />
                        {lengthArrCitiz === 0 && !isFullPageCitizenship ? <p className="errors-input-contacts">Set your citizenship</p> : null}
                        {isFullPageCitizenship &&
                            <FpContCountry
                                isFullPageCitizenship={isFullPageCitizenship}
                                setIsFullPageCitizenship={setIsFullPageCitizenship}
                                isFullPageWorkPermit={isFullPageWorkPermit}
                                setIsFullPageWorkPermit={setIsFullPageWorkPermit}
                                handleSelectedCountry={handleSelectedCountry}
                                arrSelectedCitizenship={arrSelectedCitizenship}
                                arrSelectedWorkPermit={arrSelectedWorkPermit}
                                setArrSelectedCitizenship={setArrSelectedCitizenship}
                                setArrSelectedWorkPermit={setArrSelectedWorkPermit}
                            />
                        }
                        <div className="selected-items citizensip">
                            {citizensipItems}
                        </div>
                    </div>
                    <div className="contact-info work-permit-info" >
                        <span className="name-contact">Work permit</span>
                        <input
                            type="text"
                            className={lengthArrWoPer === 0 && !isFullPageWorkPermit ? "input-contacts_full-width_errors" : "input-contacts_full-width"}
                            {...register('workPermit')}
                            onChange={handleInpCountryWoPer}
                        />
                        <img
                            src={hoverIconFpWorkPermit ? iconGreyShowFpCont : iconWhiteShowFpCont}
                            onClick={() => setIsFullPageWorkPermit(true)}
                            onMouseOver={() => setHoverIconFpWorkPermit(true)}
                            onMouseLeave={() => setHoverIconFpWorkPermit(false)}
                            className="icon-show-fp-cont-location"
                        />
                        {isFullPageWorkPermit &&
                            <FpContCountry
                                isFullPageCitizenship={isFullPageCitizenship}
                                setIsFullPageCitizenship={setIsFullPageCitizenship}
                                isFullPageWorkPermit={isFullPageWorkPermit}
                                setIsFullPageWorkPermit={setIsFullPageWorkPermit}
                                handleSelectedCountry={handleSelectedCountry}
                                arrSelectedCitizenship={arrSelectedCitizenship}
                                arrSelectedWorkPermit={arrSelectedWorkPermit}
                                setArrSelectedCitizenship={setArrSelectedCitizenship}
                                setArrSelectedWorkPermit={setArrSelectedWorkPermit}
                            />
                        }
                        {lengthArrWoPer === 0 && !isFullPageWorkPermit ? <p className="errors-input-contacts">Set your work permit</p> : null}
                        <div className="selected-items work-permit">{workPermitItems}</div>
                    </div>
                    <div className="footer-create-page">
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
                        <div className="footer-main-create-page">
                            <button className="b-back-step" onClick={() => props.handleBackStep(true)}>
                                Back
                            </button>
                            <button type="submit" className="b-next-step step-one_true">
                                Save and continue
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>)
}

export default StepResumeTwo;