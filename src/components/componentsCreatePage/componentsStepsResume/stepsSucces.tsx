import React from 'react'
import useStepsStyle from './stylesStepsSucces';

interface Props {
    visibleStepNumbers?: number[];
    stepsComponents?: React.ComponentType<any>[];
}

const StepSuccess: React.FC<Props> = ({ visibleStepNumbers, stepsComponents }) => {
    const resolvedVisibleStepNumbers = visibleStepNumbers ?? (stepsComponents ? stepsComponents.map((_, index) => index + 1) : [1, 2, 3, 4, 5, 6]);
    const styleSuccesSteps = useStepsStyle(resolvedVisibleStepNumbers);

    return (
        <div className="steps-success-items">
            <div style={styleSuccesSteps.step1}></div>
            <div style={styleSuccesSteps.step2}></div>
            <div style={styleSuccesSteps.step3}></div>
            {resolvedVisibleStepNumbers.includes(4) && <div style={styleSuccesSteps.step4}></div>}
            {resolvedVisibleStepNumbers.includes(5) && <div style={styleSuccesSteps.step5}></div>}
            <div style={styleSuccesSteps.step6}></div>
        </div>
    )
}

export default StepSuccess