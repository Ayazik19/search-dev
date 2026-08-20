import React, { ComponentType, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hookRedux";
import { useForm } from "react-hook-form";
import iconGreyShowFpCont from '../../../../dist/icons/iconGreyShowFpCont.png';
import iconWhiteShowFpCont from '../../../../dist/icons/iconWhiteShowFpCont.png';
import iconDeleteCountryItem from '../../../../dist/icons/iconDeleteCountryItem.png';
import { setBasicInfo } from "../../../store/resumesSlice";
import FpContCountry from "./fpContCountry";
import { TypesComponents } from "../createResumePage";
import StepSuccess from "./stepsSucces";
import { BasicInfo, ContactLinks, SocialNetwork } from "../../../types/typesResume";
import { setChangeScroll } from "../../../store/isMainScrollSlice";
import { arrSocialLinks, iconMap } from "../../../dataArrays/listSocialContacts";

import iconFacebookSocial from '../../../../dist/icons/iconFacebookSocial.png';
import iconInstagramSocial from '../../../../dist/icons/iconInstagramSocial.png';
import iconPinterestSocial from '../../../../dist/icons/iconPinterestSocial.png';
import iconTelegramSocial from '../../../../dist/icons/iconTelegramSocial.png';
import iconTwitterSocial from '../../../../dist/icons/iconTwitterSocial.png';
import iconVkontakteSocial from '../../../../dist/icons/iconVkontakteSocial.png';
import iconHelpSocialInp from '../../../../dist/icons/iconHelpSocialInp.png';
import { Country } from "country-state-city";

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
    socialContactsLinks: ContactLinks[],
    citizenship: string[],
    workPermit: string[],
    elAddress: string,
    phoneNumber: string
}


interface PropsHandle {
    handleBackStep: () => void;
    handleNextStep: () => void;
    stepsComponents: ComponentType<TypesComponents>[]
}




const StepResume2: React.FC<PropsHandle> = ({ stepsComponents, handleNextStep, handleBackStep }) => {
    const dispatch = useAppDispatch();

    const [valueInpSocialLinks,setValueInpSocialLinks] = useState<string>('');
    const [arrSelectedCitizenship, setArrSelectedCitizenship] = useState<string[]>([]);
    const [arrSelectedWorkPermit, setArrSelectedWorkPermit] = useState<string[]>([]);
    const [errorsContactSocialLinks, setErrorsContactSocialLinks] = useState<boolean>(false);
    
    const arrCountries = Country.getAllCountries();
    
    const [hoverIconFpCitiz, setHoverIconFpCitiz] = useState<boolean>(false);
    const [hoverIconFpWorkPermit, setHoverIconFpWorkPermit] = useState<boolean>(false);
    
    const [isFullPageCitizenship, setIsFullPageCitizenship] = useState<boolean>(false);
    const [isFullPageWorkPermit, setIsFullPageWorkPermit] = useState<boolean>(false);
    const [selecteGender, setSelectedGender] = useState<string>('m');
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ mode: 'onChange' });
    const { resumesState } = useAppSelector(state => state.resumes);
    
    const nameResume = resumesState.nameResume;
    
    const stateBasicInfo = resumesState.basicInfo;
    const stateFirstName = stateBasicInfo?.firstName;
    const stateLastName = stateBasicInfo?.lastName;
    const statePatronymic = stateBasicInfo?.patronymic;
    const stateCity = stateBasicInfo?.city;
    const stateGender = stateBasicInfo?.gender;

    const stateDateBirth = stateBasicInfo?.dateBirth;
    const stateMonthBirth = stateDateBirth?.month;
    
    const stateWorkPermit = stateBasicInfo?.workPermit;
    const stateCitizenship = stateBasicInfo?.citizenship;
    const stateElAddrees = stateBasicInfo?.elAddress;
    const statePhoneNumber = stateBasicInfo?.phoneNumber;
    const stateSocialContactsLinks = stateBasicInfo?.socialContactsLinks;
    
    const [arrSocialResumeLinks, setArrSocialResumeLinks] = useState<ContactLinks[]>(stateSocialContactsLinks ? stateSocialContactsLinks : []);

    const [valuesBasicInfo, setValuesBasicInfo] = useState<BasicInfo>({
        firstName: stateFirstName ?? '',
        lastName: stateLastName ?? '',
        patronymic: statePatronymic ?? '',
        city: stateCity ?? '',
        gender: stateGender ?? '',
        dateBirth: {
            day: stateBasicInfo?.dateBirth?.day ?? '',
            month: stateBasicInfo?.dateBirth?.month ?? '',
            year: stateBasicInfo?.dateBirth?.year ?? ''
        },
        socialContactsLinks: stateSocialContactsLinks ?? [],
        workPermit: stateWorkPermit ?? [],
        citizenship: stateCitizenship ?? [],
        elAddress: stateElAddrees ?? '',
        phoneNumber: statePhoneNumber ?? ''
    });


    useEffect(() => {
        setArrSelectedCitizenship(stateCitizenship ?? [])
        setArrSelectedWorkPermit(stateWorkPermit ?? [])
    }, [stateWorkPermit, stateCitizenship])

    useEffect(() => {
        if(isFullPageCitizenship || isFullPageWorkPermit){
            dispatch(setChangeScroll(false));
        }
        else{
            dispatch(setChangeScroll(true));
        }
    },[isFullPageCitizenship, isFullPageWorkPermit])
    

    const handleInpCountryCitiz = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toLowerCase();
    
        const isAlreadyEl = arrSelectedCitizenship.find(el => el.toLowerCase() === value);
    
        arrCountries.forEach((el) => {
            if (value === el.name.toLowerCase() && !isAlreadyEl) { 
                setArrSelectedCitizenship([...arrSelectedCitizenship, el.name]);
            }
        });
    };

    const handleInpCountryWoPer = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toLowerCase();

        const isAlreadyEl = arrSelectedWorkPermit.find(el => el === value);

        arrCountries.forEach((el) => {
            if (value === el.name.toLowerCase() && !isAlreadyEl) { 
                setArrSelectedWorkPermit([...arrSelectedWorkPermit, el.name]);
            }
        });
    }

    const onSubmitForm = (data: FormValues) => {
        if(!valueInpSocialLinks && arrSocialResumeLinks.length === 0){
            setErrorsContactSocialLinks(true);
            return;
        }
        
        
        const formattedData = {
            ...data,
            citizenship: arrSelectedCitizenship,
            workPermit: arrSelectedWorkPermit,
            socialContactsLinks: arrSocialResumeLinks,
            dateBirth: {
                day: data.dateBirth.day,
                month: data.dateBirth.month,
                year: data.dateBirth.year
            }
        };

        if(stateBasicInfo?.firstName){
            for (const key in stateBasicInfo) {
                if (JSON.stringify(stateBasicInfo[key as keyof BasicInfo]) !== JSON.stringify(formattedData[key as keyof BasicInfo])) {
                    dispatch(setBasicInfo(formattedData))
                }
            }
        }
        else{
            dispatch(setBasicInfo(formattedData))
        }
        handleNextStep();
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

    const handleChangeValueInp = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setValuesBasicInfo((prevValues) => {
            if (name.includes('dateBirth')) {
                if (name === 'dateBirth.day') {
                    return {
                        ...prevValues,
                        dateBirth: {
                            ...prevValues.dateBirth,
                            day: value
                        }
                    };
                } else if (name === 'dateBirth.month') {
                    return {
                        ...prevValues,
                        dateBirth: {
                            ...prevValues.dateBirth,
                            month: value
                        }
                    };
                } else if (name === 'dateBirth.year') {
                    return {
                        ...prevValues,
                        dateBirth: {
                            ...prevValues.dateBirth,
                            year: value
                        }
                    };
                }
            } else {
                return {
                    ...prevValues,
                    [name]: value
                };
            }
            return prevValues;
        });
    };

    const handleChangeInpMonthBirth = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setValuesBasicInfo((prevValues) => ({
            ...prevValues,
            dateBirth:{
                ...prevValues.dateBirth,
                month: event.target.value
            }
        }))
    }

    const handleChangeInpSocialLinks = (event: React.ChangeEvent<HTMLInputElement>) => {
        setErrorsContactSocialLinks(false);
        const value = event.target.value.length >= 3 && event.target.value.toLowerCase();

        if(value){
            setValueInpSocialLinks(value);
        }
    };

    const handleAddContactSocialLink = () => {
        arrSocialLinks.forEach((item) => {
            const isLinkIncluded = item.link.some(link => valueInpSocialLinks && valueInpSocialLinks.includes(link));
    
            if (isLinkIncluded) {
                const isAlreadySelected = arrSocialResumeLinks.find(existingItem => existingItem.nameSelectedSocial === item.name);
    
                if (!isAlreadySelected) {
                    const resultDataLink = {
                        nameSelectedSocial: item.name,
                        link: valueInpSocialLinks || ''
                    }

                    setArrSocialResumeLinks(prevLinks => [
                        ...prevLinks, 
                        resultDataLink
                    ]);
                }
            }
        });
    }

    const handleSetSocialLink = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if(event.key === 'Enter'){
            console.log('aa')
            event.preventDefault();

            handleAddContactSocialLink();
        }
    }

    
    const handleDeleteSelectedSocial = (currentDeleteSocial: string) => {
        const updArrSocialsResume = arrSocialResumeLinks.filter(item => item.nameSelectedSocial !== currentDeleteSocial)
        setArrSocialResumeLinks(updArrSocialsResume);
    }

    
    const selectedSocialContacts = arrSocialResumeLinks.map((item, index) => {
        const iconSrc = iconMap[item.nameSelectedSocial as SocialNetwork];

        const isLinkTelegramFirstMethood = item.link.includes('@');

        return(
            <div key={index} className='selected-social-contacts' style={{marginLeft: index + 1 === 1 ? '0px' : '7.5px'}}>
                <div className="item-social">
                    <div className="icon-selected-social">
                        <img src={iconSrc} className="icon-socal"/>
                        <div className={isLinkTelegramFirstMethood ? "selected-social-link-el_small" : "selected-social-link-el_big"}>
                            <span className="text-social-link">{item.link}</span>
                        </div>
                    </div>
                    <div className="line-social-items"></div>
                    <img 
                        className="icon-delete-social"
                        src={iconDeleteCountryItem}
                        onClick = {() => handleDeleteSelectedSocial(item.nameSelectedSocial)}
                    />
                </div>
            </div>
        );
    })

    useEffect(() => {
        console.log(arrSocialResumeLinks)
    },[arrSocialResumeLinks])
    
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
                            value={valuesBasicInfo.firstName}
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
                            onChange={handleChangeValueInp}
                        />
                        {errors?.firstName ? <p className="errors-input-contacts">{errors?.firstName.message}</p> : null}
                    </div>
                    <div className="contact-info surname-info">
                        <span className="name-contact">Surname</span>
                        <input
                            type="text"
                            value={valuesBasicInfo.lastName}
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
                            onChange={handleChangeValueInp}
                        />
                        {errors?.lastName ? <p className="errors-input-contacts">{errors?.lastName.message}</p> : null}
                    </div>
                    <div className="contact-info patronymic-info">
                        <span className="name-contact">Patronymic</span>
                        <input
                            type="text"
                            className="input-contacts_full-width"
                            value={valuesBasicInfo.patronymic}
                            {...register('patronymic')}
                            onChange={handleChangeValueInp}
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
                            value={valuesBasicInfo.city}
                            className={!errors?.city ? "input-contacts_full-width" : "input-contacts_full-width_errors"}
                            {...register('city', {
                                required: 'Set your city',
                                pattern: {
                                    value: /^[A-Za-z]+$/,
                                    message: 'Set correct city'
                                }
                            })}
                            onChange={handleChangeValueInp}
                        >
                        </input>
                        {errors?.city && <p className="errors-input-contacts">{errors?.city.message}</p>}
                    </div>
                    <div className="contact-info  birth-info">
                        <span className="name-contact">Date birth</span>
                        <div className="set-date">
                            <input
                                value={valuesBasicInfo?.dateBirth?.day}
                                type="text"
                                maxLength={2}
                                className={errors?.dateBirth?.day || errors?.dateBirth?.month || errors?.dateBirth?.year ? "input-date-1_error" : "input-date-1"}
                                placeholder="Day"
                                {...register('dateBirth.day', {
                                    pattern: {
                                        value: /^(0[1-9]|[12][0-9]|3[01])$/,
                                        message: 'Wrong day birth'
                                    },
                                    required: 'Set your day birth'
                                })}
                                onChange={handleChangeValueInp}
                            />
                            <select
                                id='date-birth'
                                value={stateMonthBirth}
                                className={errors?.dateBirth?.day || errors?.dateBirth?.month || errors?.dateBirth?.year ? "select-date_error" : "select-date"}
                                {...register('dateBirth.month', {
                                    required: 'Set your month birth'
                                })}
                                onChange={handleChangeInpMonthBirth}
                            >
                                <option value=''></option>
                                <option value='January'>January</option>
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
                                value={valuesBasicInfo?.dateBirth?.year}
                                type="text"
                                maxLength={4}
                                className={errors?.dateBirth?.day || errors?.dateBirth?.month || errors?.dateBirth?.year ? "input-date-2_error" : "input-date-2"}
                                placeholder="Year"
                                {...register('dateBirth.year', {
                                    pattern: {
                                        value: /^(196[0-9]|197[0-9]|198[0-9]|199[0-9]|200[0-8])$/,
                                        message: 'Wrong year birth'
                                    },
                                    required: 'Set your year birth'
                                })} 
                                onChange={handleChangeValueInp}
                            />
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
                            value={valuesBasicInfo.elAddress}
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
                            onChange={handleChangeValueInp}
                        />
                        {errors?.elAddress ? <p className="errors-input-contacts">{errors?.elAddress.message}</p> : null}
                    </div>
                    <div className="contact-info tel-number-info" >
                        <span className="name-contact">Phone number</span>
                        <input
                            value={valuesBasicInfo.phoneNumber}
                            type="text"
                            className={errors?.phoneNumber ? "input-contacts_full-width_errors" : "input-contacts_full-width"}
                            placeholder="+7"
                            {...register('phoneNumber', {
                                required: 'Set your phone number',
                                pattern: {
                                    value: /^\+79\d{9}$/,
                                    message: 'Phone number must start with +7 and 9 digits'
                                }
                            })}
                            onChange={handleChangeValueInp}

                        />
                        {errors?.phoneNumber ? <p className="errors-input-contacts">{errors?.phoneNumber.message}</p> : null}
                    </div>
                    <div className="contact-info contact-links-info" >
                        <div className="cont-help-add-social-inp">
                            <img src = {iconHelpSocialInp} className="icon-help-inp-cont"/>
                            <div className="help-social-cont">
                                <span className="text-help-social-cont">After you have written to add the link press enter</span>
                            </div>
                        </div>
                        <span className="name-contact">Social contacts</span>
                        <input
                            type="text"
                            className={errorsContactSocialLinks ? "input-contacts_full-width_errors" : "input-contacts_full-width"}
                            placeholder="Telegram, twitter"
                            {...register('socialContactsLinks')}
                            onChange={handleChangeInpSocialLinks}
                            onKeyDown={handleSetSocialLink}
                        />
                        {errorsContactSocialLinks && <p className="errors-input-contacts">Set your social contacts links</p>}
                    </div>
                    <div className="selected-items socials">
                        {selectedSocialContacts}
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
                            src={iconGreyShowFpCont}
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
                            src={iconGreyShowFpCont}
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
                        <StepSuccess stepsComponents={stepsComponents} />
                        <div className="footer-main-create-page">
                            <button className="b-back-step" onClick={() => handleBackStep()}>
                                Back
                            </button>
                            <button type='submit' className="b-next-step step-three_true">
                                Save and continue
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div >)
}

export default StepResume2;