import React, { useState, useEffect, ComponentType } from "react";
import { useAppDispatch, useAppSelector } from "../../../hookRedux";
import { useForm } from "react-hook-form";
import './stepResume.css'
import { setEducation } from "../../../store/resumesSlice";
import useStepsStyle from "./stylesStepsSucces";
import { TypesComponents } from "../createResumePage";
import StepSuccess from "./stepsSucces";

export interface FormValues {
    nameInstituation: string,
    faculty: string,
    yearGradiation: string
}

interface Props{
    handleNextStep: () => void;
    handleBackStep: () => void;
    stepsComponents: ComponentType<TypesComponents>[]
}

const StepResume4: React.FC<Props> = ({stepsComponents, handleNextStep, handleBackStep}) => {
    const { resumesState } = useAppSelector(state => state.resumes);

    const dispatch = useAppDispatch();

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ mode: 'onChange' })

    const arrFaculty: string[] = [
        "Applied Mathematics and Computer Science",
        "Informatics and Computer Science",
        "Information Systems and Programming",
        "Applied Computer Science",
        "Software Engineering",
        "Information Security"
    ];

    const education = resumesState.education;

    const nameInstituation = education?.nameInstituation;
    const stateFaculty = education?.faculty;
    const yearGradiation = education?.yearGraduation;

    const [arrSearchedFaculties, setArrSearchedFaculties] = useState<string[]>([]);
    const [valueFacultyInp, setValueFacultyInp] = useState<string>(stateFaculty ? stateFaculty : '');

    const handleFacultyInp = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setValueFacultyInp(value);
        setIsShowFaculty(true)

        if (value === '') {
            setArrSearchedFaculties([]);
            return;
        }

        const resultSearchedFaculty = arrFaculty.filter(el => el.toLowerCase().includes(value.toLowerCase()));

        setArrSearchedFaculties(resultSearchedFaculty);
    }

    const [isShowFaculty, setIsShowFaculty] = useState<boolean>(false);

    const searchedFacultiesEls = arrSearchedFaculties && arrSearchedFaculties.map((el, index) => {

        const handleSetFaculty = () => {
            setValueFacultyInp(el);
            setIsShowFaculty(false);
        }

        return (
            <div key={index} className='faculty-finded' onClick={handleSetFaculty}>
                <span className="name-faculty">
                    {el}
                </span>
            </div>
        )
    })

    const onSubmitForm = (data: FormValues) => {
        const dataForm = {
            ...data,
            faculty: valueFacultyInp
        };
        if(nameInstituation){
            let isChangedData = false;
            if(dataForm.nameInstituation !== nameInstituation){
                isChangedData = true;
            }
            else if(dataForm.faculty !== stateFaculty){
                isChangedData = true;
            }
            else if(dataForm.yearGradiation !== yearGradiation){
                isChangedData = true;
            }

            if(isChangedData) {
                dispatch(setEducation(dataForm));
            }
        }
        else{
            dispatch(setEducation(dataForm))
        }
        handleNextStep();
    }

    const [inpValueName, setInpValueName] = useState<string>(nameInstituation  || '');
    const [inpValueYear, setInpValueYear] = useState<string>(yearGradiation || '')

    const handleChangeValueName = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        setInpValueName(value)
    }

    const handleChangeValueYear = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        setInpValueYear(value);
    }


    const nameResume = resumesState.nameResume;
    return (
        <div className="step-resume-creation">
            <div className="resume-creation">
                <span className="main-text-step">
                    Which IS institution did you graduate from?
                </span>
                <span className="description-text-step">
                    Resume {nameResume}
                </span>
                <form
                    onSubmit={handleSubmit(onSubmitForm)}
                    className="form-education"
                >
                    <div className="education-type">
                        <span className="name-education name-type">Name instituation</span>
                        <input

                            {...register('nameInstituation', {
                                required: `Set name instituation, even if you haven't graduated`
                            })}
                            className={!errors?.nameInstituation ? "input-education_full-width" : "input-education_full-width_errors"}
                            type="text"
                            value={inpValueName}
                            onChange={handleChangeValueName}
                        />
                        {errors?.nameInstituation && <p className="erorrs-input-education">{errors.nameInstituation.message}</p>}
                    </div>
                    <div className="education-type">
                        <span className="name-education faculty-type">Faculty</span>
                        <input
                            {...register('faculty', {
                                required: `Set faculty, even if you haven't graduated`
                            })}
                            className={!errors?.faculty ? "input-education_full-width" : "input-education_full-width_errors"}
                            type="text"
                            value={valueFacultyInp}
                            onChange={handleFacultyInp}
                        />
                        {arrSearchedFaculties.length > 0 && isShowFaculty &&
                            <div
                                className="faculty"
                                style={{
                                    height: arrSearchedFaculties.length === 1 ? '25px' : 
                                            arrSearchedFaculties.length === 2 ? '50px' : 
                                            arrSearchedFaculties.length === 3 ? '75px' :
                                            arrSearchedFaculties.length === 4 ? '100px' :
                                            arrSearchedFaculties.length === 5 ? '125px' :
                                            arrSearchedFaculties.length === 6 ? '150px' : 
                                            '0px'
                                    }}
                            >
                                <div className="faculty-els">
                                    {searchedFacultiesEls}
                                </div>
                            </div>}
                        {errors?.faculty && <p className="erorrs-input-education">{errors.faculty.message}</p>}
                    </div>
                    <div className="education-type">
                        <span className="name-education year-gradiation-type">Year graduation</span>
                        <input
                            {...register('yearGradiation', {
                                required: `Set year gradiation, even if you haven't graduated`,
                                pattern: {
                                    value: /^(19[7-9][0-9]|20[0-2][0-9])$/,
                                    message: 'Set real year'
                                }
                            })}
                            className={!errors?.yearGradiation ? "input-education_small-width" : "input-education_small-width_errors"}
                            type="text"
                            value={inpValueYear}
                            onChange={handleChangeValueYear}
                        />
                        <span className="help-text-education">
                            If you are still studying, please indicate <br />
                            your expected graduation year
                        </span>
                        {errors?.yearGradiation && <p className="erorrs-input-education">{errors.yearGradiation.message}</p>}
                    </div>
                    <div className="footer-create-page   four">
                        <StepSuccess stepsComponents={stepsComponents}/>
                        <div className="footer-main-create-page">
                            <button className="b-back-step" onClick={() => handleBackStep()}>
                                Back
                            </button>
                            <button type = 'submit' className="b-next-step step-three_true">
                                Save and continue
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default StepResume4;