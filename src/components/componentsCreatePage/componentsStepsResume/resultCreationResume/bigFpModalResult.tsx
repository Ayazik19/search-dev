import React, { useEffect, useState } from "react";
import './bigFpModalResult.css'
import { useAppDispatch, useAppSelector } from "../../../../hookRedux";
import { useNavigate } from "react-router-dom";
import { setChangeScroll } from "../../../../store/isMainScrollSlice";
import ResultCreationResume from "./componentsResultCreationResume/resultCreationResume";
import LastStepResume from "./componentsResultCreationResume/lastStepResume";
import ResumeFinishDetails from "./componentsResumeFinishDetails/resumeFinishDetails";

interface Props {
    setIsShowBigFpModalResult: (value: boolean) => void;
    showCurrentStep: (stateArrStepsResume: Array<{ status: string }>) => React.ReactElement[] | null;
}

const BigFpModalResult: React.FC<Props> = ({ setIsShowBigFpModalResult, showCurrentStep }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { resumesState } = useAppSelector(state => state.resumes);
    const [isVisibleTitleCont, setIsVisibleTitleCont] = useState<boolean>(true);

    const [isFinishedResumeDetails, setIsFinishedResumeDetails] = useState<boolean>(false);

    const [isScrollFormResumeFinishDetailsToBottom, setIsScrollFormResumeFinishDetailsToBottom] = useState<boolean>(false)

    useEffect(() => {
        if(isVisibleTitleCont){
            setTimeout(() => {
                setIsVisibleTitleCont(false);
            }, 6000)
        }
    },[isVisibleTitleCont])

    dispatch(setChangeScroll(false));

    return (
        <div className="big-fp-modal-result">
            <div className="fp-cont-result">
                {/* тут сделать такое условие {"cont-result" : "cont-result_margin-0"} */}
                <div className="cont-result_margin-zero">
                    {/* {
                        resumesState.isResumeCompleted ? 
                        <ResultCreationResume />
                        :
                        <LastStepResume />
                    }   */}
                    {isFinishedResumeDetails ?
                        <ResultCreationResume
                            isScrollFormResumeFinishDetailsToBottom={isScrollFormResumeFinishDetailsToBottom}
                            setIsScrollFormResumeFinishDetailsToBottom={setIsScrollFormResumeFinishDetailsToBottom}
                            showCurrentStep={showCurrentStep}
                            isVisibleTitleCont={isVisibleTitleCont}
                            setIsVisibleTitleCont={setIsVisibleTitleCont}
                            setIsFinishedResumeDetails={setIsFinishedResumeDetails}
                            setIsShowBigFpModalResult={setIsShowBigFpModalResult}
                        />
                        :
                        <ResumeFinishDetails
                            isScrollFormResumeFinishDetailsToBottom={isScrollFormResumeFinishDetailsToBottom}
                            setIsScrollFormResumeFinishDetailsToBottom={setIsScrollFormResumeFinishDetailsToBottom}
                            isVisibleTitleCont={isVisibleTitleCont}
                            setIsFinishedResumeDetails={setIsFinishedResumeDetails}
                            setIsVisibleTitleCont={setIsVisibleTitleCont}
                        />
                    }
                </div>
            </div>
        </div>
    );
}

export default BigFpModalResult;