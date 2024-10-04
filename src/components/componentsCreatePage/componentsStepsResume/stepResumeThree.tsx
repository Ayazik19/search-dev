import React,{useState} from "react";
import { useAppDispatch, useAppSelector } from "../../../hookRedux";
import { setNextStep } from "../../../store/stepsResume";
import { setEducationClass } from "../../../store/resumesSlice";



const StepResumeThree: React.FC = () => {
    const dispatch = useAppDispatch();
    const { resumesState } = useAppSelector(state => state.resumes);

    const nameResume = resumesState[0]?.nameResume;

    const selectedEducClass = resumesState[0]?.education?.educationClass;

    const arrEducation: string[] = ['Secondary special education', 'Unfinished higher education', 'Higher', 'Bachelor', 'Master', 'Candidate of Sciences', 'There is no education in IS']

    const [arrSelectedEduc, setArrSelectedEduc] = useState(selectedEducClass ? selectedEducClass : 'There is no education in IS');

    const handleSubmitEduc = (el: string) => {
        dispatch(setEducationClass(el));
        dispatch(setNextStep());
        setArrSelectedEduc(el);
    }

    const educationItems = arrEducation.map(el => {
        return(
            <div 
                className="item-education"
                style = {{border: arrSelectedEduc !== el ? '1px solid white' : '1px solid #007bff'}} 
                key = {el} 
                onClick={el !== 'There is no education in IS' ? () => handleSubmitEduc(el) : () => {}}            
            >
                <span className="text-education">
                    {el}
                </span>
            </div>
        );
    })
    

    return (
        <div className="step-resume-creation">
            <div className="resume-creation">
                <span className="main-text-step">
                    What is your education in information systems?
                </span>
                <span className="description-text-step">
                    Resume {nameResume}
                </span>
                <div className="list-education">
                    {educationItems}
                </div>
            </div>
        </div>
    )
}

export default StepResumeThree;