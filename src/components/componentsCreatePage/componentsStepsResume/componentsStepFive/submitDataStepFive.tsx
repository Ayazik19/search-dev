import { Resume } from "../../../../types/typesResume";
import { ErrorModalData } from "../stepsResumeFive";
import FpContModalWarning from "./fpConts/contModalWarning";


interface FuncSubmit {
    submitDataStepFive:
    (
        dataErrorModal: ErrorModalData,
        setDataErrorModal: (value: ErrorModalData) => void,
        resumesState: Resume[]
    ) => void;
}
// в хуке модел дата, отсюда будет отображаться если у пользователя
// выбран стейт тайп ворк, но не заполнены данные

const submitDataStepFive: FuncSubmit['submitDataStepFive'] = (
    dataErrorModal,
    setDataErrorModal,
    resumesState
) => {
    ////data
    //states
    const stateTypeWorkResume = resumesState && resumesState[resumesState.length - 1]?.typeWorkResume;
    //hooks

    //variables
    const findPositionsState = resumesState[resumesState.length - 1]?.positions;
    const findProjectsState = resumesState[resumesState.length - 1]?.petProjects;
    //func
    // const showErrorModal = (textError: string) => {
    //     setDataErrorModal({
    //         isShowModalWarningData: true,
    //         textErrorModal: textError,
    //         typeError: 'NO-DATA-SUBMIT'
    //     })
    //     return (
    //         <FpContModalWarning dataErrorModal={dataErrorModal} setDataErrorModal={setDataErrorModal} />
    //     )
    // }

    if (dataErrorModal.isShowModalWarningData) {
        return; // Если модалка уже открыта, ничего не делаем
    }

    if (stateTypeWorkResume === 'a') {
        if (findPositionsState && findPositionsState.length > 0) {
            // handleNextStep();
            console.log('1.1')
        }
        else {
            setDataErrorModal({
                isShowModalWarningData: true,
                textErrorModal: 'Enter your position works data',
                typeError: 'NO-DATA-SUBMIT',
            });        
        }
    }
    else if (stateTypeWorkResume === 'b') {
        if (findProjectsState && findProjectsState.length > 0) {
            // handleNextStep();
            console.log('2.1')
        }
        else {
            setDataErrorModal({
                isShowModalWarningData: true,
                textErrorModal: 'Enter your position works data',
                typeError: 'NO-DATA-SUBMIT',
            });        
        }
    }

}

export default submitDataStepFive;