import React, { ComponentType } from 'react'
import { TypesComponents } from '../createResumePage'
import useStepsStyle from './stylesStepsSucces';
import StepResume4 from './stepResumeFour';
import StepResume5 from './stepsResumeFive';

interface Props{
    stepsComponents: ComponentType<TypesComponents>[];
}

const StepSuccess: React.FC<Props> = ({stepsComponents}) => {

    const styleSuccesSteps = useStepsStyle();

    return (
        <div className="steps-success-items">
            <div style={styleSuccesSteps.step1}></div>
            <div style={styleSuccesSteps.step2}></div>
            <div style={styleSuccesSteps.step3}></div>
            {stepsComponents?.find(el => el === StepResume4) && <div style={styleSuccesSteps.step4}></div>}
            {stepsComponents?.find(el => el === StepResume5) && <div style={styleSuccesSteps.step5}></div>}
            <div style={styleSuccesSteps.step6}></div>
        </div>
    )
}

export default StepSuccess