import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hookRedux";
import { useForm } from "react-hook-form";
import './stepResume.css'
import { setEducation } from "../../../store/resumesSlice";
import { setBackStep, setNextStep } from "../../../store/stepsResume";

export interface FormValues {
    nameInstituation: string,
    faculty: string,
    yearGradiation: string
}

const StepResumeFour: React.FC = () => {
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

    const { stateStepsResume } = useAppSelector(state => state.stepsResume)
    const isStepOne = stateStepsResume.stepsResume.stepOne;
    const isStepTwo = stateStepsResume.stepsResume.stepTwo;
    const isStepThree = stateStepsResume.stepsResume.stepThree;
    const isStepFour = stateStepsResume.stepsResume.stepFour;
    const isStepFive = stateStepsResume.stepsResume.stepFive;

    const [arrSearchedFaculties, setArrSearchedFaculties] = useState<string[]>([]);
    const [valueFacultyInp, setValueFacultyInp] = useState<string>('');

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
        dispatch(setNextStep())
        dispatch(setEducation(data))
        console.log(data)
    }

    const nameResume = resumesState[0]?.nameResume;
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
                        />
                        <span className="help-text-education">
                            If you are still studying, please indicate <br />
                            your expected graduation year
                        </span>
                        {errors?.yearGradiation && <p className="erorrs-input-education">{errors.yearGradiation.message}</p>}
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
                            <button className="b-back-step" onClick={() => dispatch(setBackStep())}>
                                Back
                            </button>
                            <button type='submit' className="b-next-step step-one_true">
                                Save and continue
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default StepResumeFour;