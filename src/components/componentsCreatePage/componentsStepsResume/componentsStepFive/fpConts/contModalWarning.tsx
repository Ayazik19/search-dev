import React from "react";
import { ErrorModalData } from "../../stepsResumeFive";
import iconCloseModal from '../../../../../../dist/icons/iconCloseFpCont.png';
import { useAppDispatch } from "../../../../../hookRedux";
import { setChangeTypeWork } from "../../../../../store/resumesSlice";

interface Props {
    dataErrorModal: ErrorModalData,
    setDataErrorModal: (value: ErrorModalData) => void
    removeDataModal: ErrorModalData,
    handleInpValueTypeWork: (event: React.ChangeEvent<HTMLSelectElement>, isChangedTypeWorkResume: boolean ) => void
}

const FpContModalWarning: React.FC<Props> = ({ 
    dataErrorModal, 
    setDataErrorModal, 
    removeDataModal, 
    handleInpValueTypeWork,
}) => {
    const dispatch = useAppDispatch()
    const typeError = dataErrorModal.typeError
    const styleMainCont = (): string => {
        return typeError === 'NO-DATA-SUBMIT' ?
            'main-warning type-warning_no-data-submit' : 'main-warning type-warning_changed-type-work-resume'
    }

    const handleCloseModal = () => {
        setDataErrorModal(removeDataModal)
    }

    const handleAgreedSubmitStep = () => {
        const event = {
            target: {
                value: 'I have no pet projects and commercial experience'
            }
        } as React.ChangeEvent<HTMLSelectElement>
        handleInpValueTypeWork(event, true)
    }

    return (
        <div className="cont-modal-warning step-five">
            <div className={dataErrorModal.isShowModalWarningData ? "modal-warning visible-modal" : "modal-warning hidden-modal"}>
                <div className={styleMainCont()}>
                    {typeError !== 'NO-DATA-SUBMIT' ?
                        <div className="info-warning">
                            <img 
                                src={iconCloseModal}
                                className="icon-close-modal_type-changed-work" 
                                onClick={() => handleCloseModal()}
                            />
                            <span>{dataErrorModal.textErrorModal}</span>
                            <div className="bts-modal-warning">
                                <button 
                                    className = 'btn-warning type-cancel' 
                                    onClick={handleCloseModal}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className = 'btn-warning type-agreed' 
                                    onClick={handleAgreedSubmitStep}
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                        :
                        <div className="info-warning">
                            <img 
                                src={iconCloseModal}
                                className="icon-close-modal_type-no-data" 
                                onClick={() => handleCloseModal()}
                            />
                            <span className="text-no-data-submit">{dataErrorModal.textErrorModal}</span>
                            <button 
                                className = 'btn-warning type-agreed-no-data-submit' 
                                onClick={handleAgreedSubmitStep}
                            >
                                OK
                            </button>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
export default FpContModalWarning;