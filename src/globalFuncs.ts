import { Dispatch } from "redux";
import { useAppDispatch, useAppSelector } from "./hookRedux"
import { setFilterPositions, setAmountTimeWorked, setUpdIdsPositions, setUpdCountTimeInToDate } from "./store/resumesSlice";
import { Resume } from "./types/typesResume";
import { TypedUseSelectorHook } from "react-redux";
import { AddDispatch, RootState } from "./store/storeIndex";


interface GlobalFuncs {
    checkAllValidateHooks: (arrHooks: boolean[]) => "submit" | "button";
}

const useSetUpdAmountTimeWorkedPoss = () => {
    const dispatch = useAppDispatch();

    const setUpdAmountTimeWorkedPoss = () => {
        dispatch(setUpdIdsPositions());
        dispatch(setAmountTimeWorked());
    };
    
    return { setUpdAmountTimeWorkedPoss };
};

export const updCountTimeToDatePos = (resumesState: Resume, dispatch: AddDispatch) => {
    const findToDatePos = resumesState.positions?.find(item => item.workingTime?.toDate === 'to date');

    
    if(findToDatePos){
        dispatch(setUpdCountTimeInToDate(findToDatePos.idPosition || 0))
    }
}

export const checkAllValidateHooks: GlobalFuncs['checkAllValidateHooks'] = (arrHooks) => {

    const isFalseHooks = arrHooks.every(hook => !hook);

    return isFalseHooks ? 'submit' : 'button';
}

export default useSetUpdAmountTimeWorkedPoss;