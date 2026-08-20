import { deleteDoc, doc } from 'firebase/firestore';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { useAppDispatch, useAppSelector } from '../hookRedux';
import { deleteResume } from '../store/resumesSlice';
import { setFalseSteps, setFirstStep } from '../store/stepsResume';

interface Props{
    setModalContIsChangeResume: (value: boolean) => void;
}

const FpModalContIsChangeResume: React.FC<Props> = ({setModalContIsChangeResume}) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {resumesState} = useAppSelector(state => state.resumes);

    const handleChangeDataResume = () => {
        navigate('/create-resume')
    }

    const handleDeleteCurrentResume = async () => {
        const idResumeDb = resumesState.idResumeDb;
        if(idResumeDb){
            const docRef = doc(db, 'resumes', idResumeDb);

            try{
                // await deleteDoc(docRef);
                dispatch(setFirstStep());
                dispatch(deleteResume());
                setModalContIsChangeResume(false);
            }
            catch(e){
                console.log(e)
            }
        } 
    }

    return(
        <div className='fp-cont-is-change-resume'>
            <div className='fp-cont-change'>
                <span className='main-text-fp-cont-change-resume'>
                    You already have a resume created.
                    <br />
                    Do you want to change it or delete it?
                </span>
                <div className='btns-fp-cont-change-resume'>
                    <button className='btn-fp-change-resume delete-resume' onClick={handleDeleteCurrentResume}>Delete</button>
                    <button className='btn-fp-change-resume change-resume' onClick={handleChangeDataResume}>Change</button>
                </div>
            </div>
        </div>
    );
}

export default FpModalContIsChangeResume;