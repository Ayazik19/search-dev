import React, { useState } from "react";
import './bigFpModalResult.css'
import { useAppDispatch, useAppSelector } from "../../../../hookRedux";
import { useNavigate } from "react-router-dom";
import { setChangeScroll } from "../../../../store/isMainScrollSlice";
import ResultCreationResume from "./componentsResultCreationResume/resultCreationResume";
import LastStepResume from "./componentsResultCreationResume/lastStepResume";
import ResumeFinishDetails from "./componentsResumeFinishDetails/resumeFinishDetails";

interface Props {
    setIsShowBigFpModalResult: (value: boolean) => void;
}

const BigFpModalResult: React.FC<Props> = ({ setIsShowBigFpModalResult }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { resumesState } = useAppSelector(state => state.resumes);
    const [isVisibleTitleCont, setIsVisibleTitleCont] = useState<boolean>(true);

    const [isFinishedResumeDetails, setIsFinishedResumeDetails] = useState<boolean>(false);


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
                        <ResultCreationResume isVisibleTitleCont = {isVisibleTitleCont}setIsVisibleTitleCont = {setIsVisibleTitleCont} setIsFinishedResumeDetails={setIsFinishedResumeDetails} setIsShowBigFpModalResult={setIsShowBigFpModalResult} />
                        :
                        <ResumeFinishDetails isVisibleTitleCont={isVisibleTitleCont} setIsFinishedResumeDetails={setIsFinishedResumeDetails} setIsVisibleTitleCont={setIsVisibleTitleCont}/>
                    }
                </div>
            </div>
        </div>
    );
}

export default BigFpModalResult;