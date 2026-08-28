import React, { ComponentType, Suspense, useEffect, useState } from 'react';
import { TypesComponents } from '../createResumePage';
import StepSuccess from './stepsSucces';
import { useAppDispatch, useAppSelector } from '../../../hookRedux';
import iconCloseRecomSkils from '../../../../dist/icons/iconRemoveValSearchStack.png';
import iconRemoveSelectedSkill from '../../../../dist/icons/iconRemoveSelectedSkills.png';
import { arrAllTagesSearch, arrayStacks, arrBackTagsSearch, arrDevOpsEngineerTagesSearch, arrFrontTagsSearch, arrFullTagsSearch, arrLeadTagesSearch, arrMobileTagsSearch, arrQaEngineerTagesSearch, arrTeamLeadTagesSearch } from '../../../dataArrays/listsStackDevops';
import { Resume, skills } from '../../../types/typesResume';
import { setIdResumeDb, setResumeCompleted, setSkills } from '../../../store/resumesSlice';
import { db } from '../../../firebase';
import { doc, DocumentReference, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import './stepResume.css';
import BigFpModalResult from './resultCreationResume/bigFpModalResult';


interface Props {
    onStepOneData: (value: string) => void;
    handleStepOne: (data: string) => void;
    stepOneData: string;
    handleNextStep: (educClass?: string | undefined) => void;
    handleBackStep: () => void;
    showCurrentStep: (stateArrStepsResume: Array<{ status: string }>) => React.ReactElement[] | null;
    stepsComponents: ComponentType<TypesComponents>[]
}




function FomattedTextErrorsStack(nameResume: string): string {
    let formattedNameStack = '';
    let isAddLetter = true;
    for (let i = 0; i < nameResume.length; i++) {
        const letter = nameResume[i];
        if (letter === ' ' && formattedNameStack !== 'Web') {
            isAddLetter = false;
        }


        if (isAddLetter) {
            if (formattedNameStack === ' ') {
                formattedNameStack = letter;
            }
            else {
                formattedNameStack = `${formattedNameStack}${letter}`
            }
        }
    }
    return formattedNameStack;
}

const StepResume6: React.FC<Props> = ({
    onStepOneData,
    handleStepOne,
    stepOneData,
    handleNextStep,
    handleBackStep,
    stepsComponents,
    showCurrentStep
}) => {
    //variables
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { resumesState } = useAppSelector(state => state.resumes);
    const nameResume = resumesState.nameResume || '';
    const tagsMapping: { [key in typeof arrayStacks[number]]: string[] } = {
        'Backend Developer': arrBackTagsSearch,
        'Full-stack Developer': arrFullTagsSearch,
        'Mobile Developer': arrMobileTagsSearch,
        'Frontend Developer': arrFrontTagsSearch,
        'Lead Developer': arrLeadTagesSearch,
        'Team Lead': arrTeamLeadTagesSearch,
        'DevOps Engineer': arrDevOpsEngineerTagesSearch,
        'QA Engineer': arrQaEngineerTagesSearch
    }
    //hooks
    const [inpSkillsValue, setinpSkillsValue] = useState<string>('');
    const [currentArrStackTags, setCurrentArrStackTags] = useState<string[]>();
    const [selectedSkill, setSelectedSkill] = useState<string[]>([]);
    const [showRecomSkilsCont, setShowRecomSkilsCont] = useState<boolean>(false);
    const [isAddEffect, setIsAddEffect] = useState<boolean>(false);
    const [addEffect, setAddEffect] = useState<boolean>(false);
    const [arrSearchedSKills, setArrSearchedSkills] = useState<string[]>([]);
    const [isAddedSkills, setIsAddedSkills] = useState<boolean>(true);
    const [isFocusedInp, setIsFocusedInp] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [isShowBigFpModalResult, setIsShowBigFpModalResult] = useState<boolean>(false);


    useEffect(() => {
        const tags = tagsMapping[nameResume as keyof typeof tagsMapping];

        if (tags) {
            setCurrentArrStackTags(tags)
        }
    }, [nameResume])

    const onSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        event.preventDefault();
        if (selectedSkill.length === 0) {
            setIsAddedSkills(false);
        }
        else {
            dispatch(setSkills(selectedSkill));

            if (resumesState.idResumeDb) {
                // const docRef = doc(db, 'resumes', resumesState.idResumeDb);
                // const docSnapshot = await getDoc(docRef);

                // if (docSnapshot.exists()) {
                //     const currentDataDb: Resume = docSnapshot.data();

                //     const updResume: Resume = { ...currentDataDb, ...resumesState };

                //     await updateDoc(docRef, updResume);
                // }
            }
            else {
                // try {
                //     const uniqueId = uuidv4();
                //     const docRef = doc(db, 'resumes', uniqueId);

                //     const formattedResumes: Resume = {
                //         nameResume: resumesState.nameResume,
                //         basicInfo: resumesState.basicInfo,
                //         education: resumesState.education,
                //         projectsProfile: resumesState.projectsProfile || [],
                //         petProjects: resumesState.petProjects || [],
                //         positions: resumesState.positions || [],
                //         amountTimeWorked: resumesState.amountTimeWorked || 'No expirience',
                //         skills: selectedSkill,
                //         statusSearchResume: resumesState.statusSearchResume || 'Default',
                //         levelIsResume: resumesState.levelIsResume || 'Default'
                //     }

                //     console.log(formattedResumes)

                //     await setDoc(docRef, formattedResumes);
                //     setLoading(false)

                //     dispatch(setResumeCompleted());
                //     dispatch(setIdResumeDb(uniqueId));
                //     navigate('/')
                // } catch (error) {
                //     setLoading(false);
                //     console.log(error);
                // }
                setLoading(false);
                setIsShowBigFpModalResult(true);
            }
        }
    }

    const displaySearchedEls = arrSearchedSKills.map((el, index) => {
        let styleBorderRadius: string = 'default-index-search-skill'

        if (arrSearchedSKills.length > 1) {
            if (index === 0) {
                styleBorderRadius = 'first-index-search-skill';
            }
            else if (index + 1 === arrSearchedSKills.length) {
                styleBorderRadius = 'last-index-search-skill';
            }
        }
        else {
            styleBorderRadius = 'one-index-search-skill';
        }


        const handleAddSkill = () => {
            if (!selectedSkill.includes(el)) {
                setSelectedSkill([...selectedSkill, el])
                setIsAddEffect(true);
            }
        }

        return (
            <div
                key={el}
                style={{}}
                onClick={handleAddSkill}
                className={`searched-el ${styleBorderRadius}`}
            >
                <span>{el}</span>
            </div>
        )
    })


    const handleChangeInpValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        setinpSkillsValue(value);

        if (value === '') {
            setArrSearchedSkills([]);
            return;
        }

        const searchedSkills: Array<string> = [];


        arrAllTagesSearch.forEach(el => {
            const lowerCasedEl = el.toLowerCase();
            const lowerCasedValue = value.toLowerCase();

            if (lowerCasedEl.includes(lowerCasedValue)) {
                searchedSkills.push(el);
            }
        });


        setArrSearchedSkills(searchedSkills);
    }

    useEffect(() => {
        if (isFocusedInp && inpSkillsValue === '') {
            setShowRecomSkilsCont(true);
        }
    }, [isFocusedInp])


    const selectedSKillsItems = selectedSkill && selectedSkill.map((el, index) => {
        const widthCountLength = el.length > 6 ? el.length - 6 : 6 - el.length;

        const isNewEl = index + 1 === selectedSkill.length && addEffect;

        const handleRemoveSkill = () => {
            const filteredSkills = selectedSkill.filter(skill => skill !== el);
            setSelectedSkill(filteredSkills)
        }

        return (
            <div
                key={index}
                className='item-selected-skill'
                style={{
                    width: `calc(110px + ${el.length > 6 ? widthCountLength * 5 : -widthCountLength * 12}px)`,
                    backgroundColor: isNewEl ? '#007bff' : 'gray',
                    transition: !isNewEl ? 'background-color 0.75s' : 'none',
                }}
            >

                <span style={{ flexGrow: 2.5, marginLeft: '7.5px' }}>{el}</span>
                <div className='right-side-selected-skill'>
                    <img
                        src={iconRemoveSelectedSkill}
                        className='icon-remove-selected-skill'
                        onClick={handleRemoveSkill}
                    />
                </div>
            </div>
        )
    })

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | null = null;

        if (isAddEffect) {
            setAddEffect(true);
            timer = setTimeout(() => {
                setAddEffect(false);
                setIsAddEffect(false);
            }, 1000)
        }

        return () => {
            if (timer) {
                clearTimeout(timer)
            }
        }
    }, [isAddEffect])

    const recomItems = currentArrStackTags && currentArrStackTags.map((el, index) => {
        const widthCountLength = el.length > 6 ? el.length - 6 : 6 - el.length;

        const handleAddSkill = () => {
            if (!selectedSkill.includes(el)) {
                setSelectedSkill([...selectedSkill, el])
                setIsAddEffect(true);
            }
            else {
                const filteredSkills = selectedSkill.filter(skill => skill !== el);
                setSelectedSkill(filteredSkills)
            }
        }

        return (
            <div
                key={index}
                className='item-recom'
                style={{
                    width: `calc(90px + ${el.length > 6 ? widthCountLength * 5 : -widthCountLength * 8}px)`,
                    backgroundColor: selectedSkill.find(skill => skill === el) ?
                        'rgb(183,183,183)' : 'whitesmoke',
                    border: selectedSkill.find(skill => skill === el) ?
                        'rgb(183,183,183)' : '1px solid #768694'
                }}
                onClick={handleAddSkill}
            >
                <span>{el}</span>
            </div>
        )
    })

    const handleAddSkillKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (inpSkillsValue.length > 0) {
                setSelectedSkill([...selectedSkill, inpSkillsValue])
                setIsAddEffect(true);
            }
        }
    };

    useEffect(() => {
        if (selectedSkill.length > 0) {
            setIsAddedSkills(true);
        }
    }, [selectedSkill, inpSkillsValue])

    useEffect(() => {
        if (inpSkillsValue === '' && isAddedSkills) {
            setShowRecomSkilsCont(true);
        }
        else {
            setShowRecomSkilsCont(false);
        }
    }, [inpSkillsValue, isAddedSkills])

    const formattedTextNameStack = FomattedTextErrorsStack(nameResume);
    //тут есть ошибка у новых стэков разработки

    return (
        <>
            {isShowBigFpModalResult && <BigFpModalResult showCurrentStep={showCurrentStep} setIsShowBigFpModalResult = {setIsShowBigFpModalResult}/>}
            <div className="step-resume-creation">
                <div className="resume-creation">
                    <span className="main-text-step">
                        What skills do you have?
                    </span>
                    <span
                        className="description-text-step"
                    >
                        Resume {nameResume}
                    </span>
                    <form
                        onSubmit={onSubmitForm}
                        className='form-skils'
                    >
                        <div className='skils-info name-info'>
                            <span className='name-skils'>Recomended skils IS</span>
                            {selectedSkill.length > 0 &&
                                <div className='selected-skills'>
                                    {selectedSKillsItems}
                                </div>
                            }
                            <input
                                type='text'
                                value={inpSkillsValue}
                                className={!isAddedSkills ? 'input-skils_full-width_errors' : 'input-skils_full-width'}
                                placeholder={`For example, ${currentArrStackTags && currentArrStackTags[0]} `}
                                onChange={handleChangeInpValue}
                                onKeyDown={handleAddSkillKeyDown}
                                onFocus={() => setIsFocusedInp(true)}
                                onBlur={() => setIsFocusedInp(false)}
                            />
                            {showRecomSkilsCont &&
                                <div className='recom-info'>
                                    <header className='header-recom'>
                                        <div className='recom-items'>
                                            <span className='text-recom'>Recomended skils</span>
                                            <img
                                                src={iconCloseRecomSkils}
                                                className='icon-close-recom-skils'
                                                onClick={() => setShowRecomSkilsCont(false)}
                                            />
                                        </div>
                                    </header>
                                    <div
                                        className='recom-lists'
                                    >
                                        <div className='recom-lists-info'>
                                            {recomItems}
                                        </div>
                                    </div>
                                </div>
                            }
                            {!isAddedSkills && <p className='errors-text-skils'>{`Set your ${formattedTextNameStack.toLowerCase()} skils`}</p>}
                        </div>
                        {arrSearchedSKills.length > 0 && <div
                            className='searched-items-skills'
                            style={{
                                height: `${(40 * arrSearchedSKills.length)}px`
                            }}
                        >
                            {displaySearchedEls}
                        </div>}
                        <div className="footer-create-page">
                            <StepSuccess stepsComponents={stepsComponents} />
                            <div className="footer-main-create-page">
                                <button className="b-back-step" onClick={() => handleBackStep()}>
                                    Back
                                </button>
                                <button type='submit' className="b-next-step step-three_true">
                                    {loading ?
                                        <PulseLoader
                                            color="white"
                                            size={15}
                                        />
                                        : 'Finish'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default StepResume6;