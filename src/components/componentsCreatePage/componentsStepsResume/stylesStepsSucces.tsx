import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../../hookRedux";

interface Styles {
    bgColorStep: {
        step: number,
        bgColor: string
    }
}

const useStepsStyle = (visibleStepNumbers: number[] = [1, 2, 3, 4, 5, 6]) => {
    const { stateStepsResume } = useAppSelector(state => state.stepsResume);
    const stateArrStepsResume = stateStepsResume.stepsResume;

    const findCurrentStep = stateArrStepsResume?.find(item => item.status === 'beginning');
    const currentStep = findCurrentStep?.currentStep;

    const basicStyles = useMemo(() => ({
        width: visibleStepNumbers.length <= 4 ? '305px' : '380px',
        height: '100%',
        borderRadius: '8px'
    }), [visibleStepNumbers.length]);

    const [arrBgColorStyles, setArrBgColorStyles] = useState<Styles['bgColorStep'][]>(
        Array.from({ length: 6 }, (_, i) => ({
            step: i + 1,
            bgColor: '#dce3eb'
        }))
    );

    const updateBgColorStyles = () => {
        const currentStepUpd = stateArrStepsResume?.find(item => item.status === 'beginning')?.currentStep;
        if (currentStepUpd) {
            const updatedStyles = arrBgColorStyles.map(item => {
                if (item.step < currentStepUpd) {
                    return {
                        ...item,
                        bgColor: '#007bff'
                    };
                }

                if (item.step === currentStepUpd) {
                    return {
                        ...item,
                        bgColor: 'linear-gradient(to right, #007bff 50%, #dce3eb 50%)'
                    };
                }
                return {
                    ...item,
                    bgColor: '#dce3eb' 
                };
            });

            setArrBgColorStyles(updatedStyles);
        }
    };

    useEffect(() => {
        if (currentStep && currentStep >= 1 && currentStep <= 6) {
            updateBgColorStyles();
        }
    }, [currentStep, stateArrStepsResume]);

    const stylesSuccesSteps = {
        step1: {
            ...basicStyles,
            background: arrBgColorStyles[0]?.bgColor
        },
        step2: {
            ...basicStyles,
            background: arrBgColorStyles[1]?.bgColor
        },
        step3: {
            ...basicStyles,
            background: arrBgColorStyles[2]?.bgColor
        },
        step4: {
            ...basicStyles,
            background: arrBgColorStyles[3]?.bgColor
        },
        step5: {
            ...basicStyles,
            background: arrBgColorStyles[4]?.bgColor
        },
        step6: {
            ...basicStyles,
            background: arrBgColorStyles[5]?.bgColor
        }
    };

    return stylesSuccesSteps;
};

export default useStepsStyle;