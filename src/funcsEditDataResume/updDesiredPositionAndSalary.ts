import { useAppDispatch, useAppSelector } from "../hookRedux"
import { setBasicInfo, setNameResume, setSalary, setValueModalCont } from "../store/resumesSlice";
import { BasicInfo, DateBirth, levelIsResume, Salary, statusSearchResume } from "../types/typesResume";

//все вычисления проводятся в этих функц, в функцию передаются только готовые значения
export const updDesiredPositionAndSalary = (
    nameResume: string, 
    updLevelIsresume: levelIsResume, 
    arrUpdWorkFormat: string[],
    arrUpdBussynes: string[],
    updSalary: Salary, // обьект
    updDateBirth: DateBirth,
    updGender: string,
    updCity: string,
    updStatusSearchResume: statusSearchResume
) => {
    const dispatch = useAppDispatch();

    const {resumesState} = useAppSelector(state => state.resumes);
    const stateBasicInfo = resumesState.basicInfo;

    const updBasicInfo: BasicInfo = {
        ...stateBasicInfo,
        dateBirth: updDateBirth,
        gender: updGender,
        city: updCity
    }
    
    dispatch(setNameResume(nameResume));
    dispatch(setValueModalCont({typeField: '', value: updLevelIsresume}))
    dispatch(setSalary(updSalary))
    dispatch(setBasicInfo(updBasicInfo))
    dispatch(setValueModalCont({typeField: 'status search', value: updStatusSearchResume}))
}