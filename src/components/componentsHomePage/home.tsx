import React, { CSSProperties, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hookRedux";
// import logoSite from '../logoSite.jpg';
// import imgReviewsContent2 from '../imgReviewsContent2.jpg';
// import imgContentArticles from '../imgContentArticles.jpeg'
import './home.css';
import FpModalContIsChangeResume from "../modalContIsChangeResume";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Date, skills } from "../../types/typesResume";
import { arrAllTagesSearch, arrayStacks } from "../../dataArrays/listsStackDevops";
import { PulseLoader } from "react-spinners";
import BtnGoToFullSearchResume from "./btnGoToFullSearchResume";
import { setFirstStep } from "../../store/stepsResume";
import { setBusyness, setChangeTypeWork, setNameResume, setResumeCompleted, setStatusSearchResume, setWorkFormat } from "../../store/resumesSlice";
import useSetUpdAmountTimeWorkedPoss, { updCountTimeToDatePos } from "../../globalFuncs";


interface SearchedResumes {
    id: number,
    nameResume: string,
    skills: skills,
    levelIsResume: string,
    resumeContact: {
        age: number,
        amountTimeWorked: Date | string
    }
}

interface HandleChanges {
    handleChangeAgreement: (typeAgreement: string) => void;
}

const Home: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {setUpdAmountTimeWorkedPoss} = useSetUpdAmountTimeWorkedPoss();
    const { stateStepsResume } = useAppSelector(state => state.stepsResume);
    const { resumesState } = useAppSelector(state => state.resumes);
    const [valueQuality, setValueQuality] = useState<number>(5);

    const [isActiveMainInpSearch, setIsActiveMainInpSearch] = useState<boolean>(false);
    const [modalContIsChangeResume, setModalContIsChangeResume] = useState<boolean>(false);
    const [isLoadingSearchResumes, setIsLoadingSearchResume] = useState<boolean>(false);
    const [isShowSearchedTagesAfterSubmit, setIsShowSearchedTagesAfterSubmit] = useState<boolean>(true);
    const [additionalStyles, setAdditionalStyles] = useState<CSSProperties>({});
    const [textValSearched, setTextValSearched] = useState<string>('');
    const [isResumeNotFounded, setIsResumeNotFounded] = useState<boolean>(false);

    const [arrSearchedResumes, setArrSearchedResumes] = useState<SearchedResumes[]>([]);

    const [inpSearchResumeValue, setInputSearchResumeValue] = useState<string>('');
    const [arrSearchedTages, setArrSearchedTages] = useState<string[]>([]);

    const arrTagesSearchResume: string[] = [...arrAllTagesSearch, ...arrayStacks];

    const scrollToSearchedResumes = (arrResFoundedResume: SearchedResumes[]) => {
        let valueScroll: number = 0;
        const searchedResumeLength: number = arrResFoundedResume.length;
        if(searchedResumeLength > 0 && searchedResumeLength <= 3){
            valueScroll = 345;
        }
        else if(searchedResumeLength > 3 && searchedResumeLength <= 6){
            valueScroll = 395;
        }
        else if(searchedResumeLength > 6 && searchedResumeLength <= 9){
            valueScroll = 490;
        }
        window.scrollBy({ top: valueScroll, behavior: 'smooth' })
    }

    // тут в будущем сделать переход на страничку с резюме, где ее инфо и редактирование
    const handleChangeAgreement: HandleChanges['handleChangeAgreement'] = (typeAgreement: string) => {

        // if (typeAgreement === 'Find Work' && typeFindWork !== true) {
        //     dispatch(setChangeIsFindWork(true))

        const stateIsResumeCompleted = resumesState.isResumeCompleted;
        if (stateIsResumeCompleted) {
            setModalContIsChangeResume(true);
            return;
        }
        navigate('/create-resume');
        
        dispatch(setChangeTypeWork('a'));
        dispatch(setFirstStep())
        dispatch(setNameResume(''))
        // }
        // else if (typeAgreement === 'Find Dev' && typeFindDev !== true) {
        //     dispatch(setChangeIsFindDev(true))
        // }
    }


    useEffect(() => {
        updCountTimeToDatePos(resumesState, dispatch);
        setUpdAmountTimeWorkedPoss();
    }, []); // вызывается при монтировании компонента



    const handleSearchResumes = async (valueSearch: string, event: React.SyntheticEvent, el?: string) => {
        event.preventDefault();

        if (valueSearch !== '') {
            setIsLoadingSearchResume(true);

            const resumeCollection = collection(db, 'resumes');
            const resumesSnapshot = await getDocs(resumeCollection);


            const resumesList: SearchedResumes[] = resumesSnapshot.docs.map((doc, index) => {
                const data = doc.data();

                return {
                    id: index,
                    nameResume: data.nameResume,
                    levelIsResume: data.levelIsResume,
                    skills: data.skills,
                    resumeContact: {
                        age: data.basicInfo.dateBirth.year,
                        amountTimeWorked: data.amountTimeWorked
                    }
                }
            });

            const arrResFoundedResume: SearchedResumes[] = resumesList.filter(item => {
                const dataResumeNameResume = item.nameResume.toLowerCase();

                const hasMatchingSkill = item.skills.some(skill => skill.toLowerCase().includes(valueSearch.toLowerCase()));

                return dataResumeNameResume.includes(valueSearch.toLowerCase()) || hasMatchingSkill;
            });

            if (arrResFoundedResume.length === 0) {
                setIsResumeNotFounded(true);
            }
            else {
                setIsResumeNotFounded(false);
            }

            if (el) {
                setInputSearchResumeValue(el)
            }
            setTextValSearched(el ? el : valueSearch);
            setArrSearchedResumes(arrResFoundedResume)
            setIsShowSearchedTagesAfterSubmit(false);
            setIsLoadingSearchResume(false);
            scrollToSearchedResumes(arrResFoundedResume);
        }
    }



    const handleSearchParamsResume = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toLowerCase();
        setInputSearchResumeValue(value);
        if (value === '') {
            setArrSearchedTages([])
            return;
        }


        let arrResSearchedTages: string[] = [];
        if (value.length >= 2) {
            arrResSearchedTages = arrTagesSearchResume.filter(tag =>
                tag.toLowerCase().includes(value)
            );
            setArrSearchedTages(arrResSearchedTages);
            setIsShowSearchedTagesAfterSubmit(true);
        }
        else {
            setArrSearchedTages([])
            return;
        }
    };

    const searchedTages = arrSearchedTages.map((el, index) => {
        return (
            <div
                className={index + 1 === arrSearchedTages.length ? "searched-tag_last-index" : "searched-tag"}
                key={el}
                onClick={(event) => handleSearchResumes(inpSearchResumeValue, event, el)}
            >
                <span className="text-searched-tag">{el}</span>
            </div>
        );
    })

    const searchedResumes = arrSearchedResumes.map(item => {
        const isNameResumeLong = item.nameResume.length > 18;
        
        return (
            <div className="resume-searched-card" style={{}}>
                <div className="info-searched-resume">
                    <div className="right-side_resume-card">
                        <div className="high-side_right-side">
                            <span className="main-text-resume-card">{item.nameResume}</span>
                        </div>
                        <div className="medium-side_right-side" style={{ marginTop: !isNameResumeLong ? '40px' : '15px' }}>
                            <div className="info-resume">
                                <span className="name-info-resume">Level:</span>
                                <span className="value-info-resume">{item.levelIsResume}</span>
                            </div>
                        </div>
                        <div className="low-side_right-side">
                            <div className="info-resume">
                                <span className="name-info-resume">Age:</span>
                                <span className="value-info-resume">{item.resumeContact.age}</span>
                            </div>
                            <div className="info-resume" style={{ marginLeft: '20px' }}>
                                <span className="name-info-resume">Work expirience:</span>
                                <span className="value-info-resume">
                                    {typeof item.resumeContact.amountTimeWorked === 'string' ?
                                        `${item.resumeContact.amountTimeWorked}` : 
                                        `
                                            ${item.resumeContact.amountTimeWorked.year > 0 ? item.resumeContact.amountTimeWorked.year : ''} 
                                            ${item.resumeContact.amountTimeWorked.year > 0 ? 
                                                `${item.resumeContact.amountTimeWorked.year > 1 ? 'years' : 'year'}` 
                                                : 
                                                ''
                                            }  
                                            ${item.resumeContact.amountTimeWorked.month > 0 ? item.resumeContact.amountTimeWorked.month : ''} 
                                            ${item.resumeContact.amountTimeWorked.month > 0 ? 
                                                `${item.resumeContact.amountTimeWorked.month > 1 ? 'months' : 'month'}` 
                                                : 
                                                ''
                                            }  
                                        `
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="left-side_resume-card">
                        <img src="https://hhcdn.ru/icms/10185439.png" className="icon_resume-card" />
                    </div>
                </div>
            </div>
        );
    })

    useEffect(() => {
        if (arrSearchedResumes.length > 0) {
            if (arrSearchedResumes.length === 1) {
                setAdditionalStyles({
                    justifyContent: "center",
                });
            } else if (arrSearchedResumes.length === 2) {
                setAdditionalStyles({
                    justifyContent: "space-evenly",
                });
            } else {
                setAdditionalStyles({
                    justifyContent: "space-between",
                });
            }
        }
    }, [arrSearchedResumes])

    useEffect(() => {
        console.log(arrSearchedResumes)
    }, [arrSearchedResumes])

    return (
        <div className="home-main">
            <nav>
                <div className="left-side-nav">
                    <img className="logo-site" />
                    <span className="text-city-user">{resumesState.basicInfo?.city ? resumesState.basicInfo?.city : 'City'}</span>
                </div>
                <div className="right-side-nav">
                    {/* {typeFindWork !== true && ( */}
                    <button
                        className="b-type_search-resume"
                        onClick={() => handleChangeAgreement('Find Work')}
                    >
                        {resumesState.isResumeCompleted ? 'My resume' : 'Create resume'}
                    </button>
                    {/* )} */}
                    {/* {typeFindDev !== true && (
                        <button
                            className="b-type_search-dev"
                            onClick={() => handleChangeAgreement('Find Dev')}
                        >
                            Search developer
                        </button>
                    )} */}
                </div>
            </nav>
            <div className="page-main_margin">
                <header>
                    <span className="main-header-text">
                        {textValSearched === '' ? (
                            <>
                                <div>
                                    Quick and convenient resume search,
                                </div>
                                <div style={{ animationDelay: '0.2s', marginTop: '5px'}}>
                                    thousands of resumes from developers
                                </div>
                                <div style={{ animationDelay: '0.4s', marginTop: '5px'}}>
                                    and professionals in different fields
                                </div>
                            </>
                        ) : (!isResumeNotFounded ?

                            <>
                                <div className="fade-in">
                                    {arrSearchedResumes.length} {arrSearchedResumes.length > 1 ? 'resumes' : 'resume'} «{textValSearched}»,
                                </div>
                                <div className="fade-in" style={{ animationDelay: '0.2s', marginTop: '5px' }}>
                                    choose the best fit for your tasks
                                </div>
                            </>
                            :
                            <>
                                <div>
                                    {arrSearchedResumes.length} resume «{textValSearched}»,
                                </div>
                                <div className="fade-in" style={{ animationDelay: '0.2s', marginTop: '5px' }}>
                                    try the extensive filter search -
                                </div>
                                <div className="fade-in" style={{ animationDelay: '0.4s', marginTop: '5px' }}>
                                    it should help!
                                </div>
                            </>
                        )}
                    </span>
                    <form className="operation-search-resumes" onSubmit={(event) => handleSearchResumes(inpSearchResumeValue, event)}>
                        <input
                            className="input-serach-resume"
                            style={{
                                borderRadius: arrSearchedTages.length > 0 && isShowSearchedTagesAfterSubmit ? '10px 0 0 0' : '10px 0 0 10px'
                            }}
                            placeholder="Area of ​​development or skills"
                            onFocus={() => setIsActiveMainInpSearch(true)}
                            onBlur={() => setIsActiveMainInpSearch(false)}
                            value={inpSearchResumeValue}
                            onChange={handleSearchParamsResume}
                        />
                        {arrSearchedTages.length > 0 && isShowSearchedTagesAfterSubmit &&
                            <div
                                className="searched-tages"
                                style={{
                                    height: `${40 * arrSearchedTages.length}px`
                                }}
                            >
                                {searchedTages}
                            </div>}
                        <button
                            className="butn-search-resume"
                            type="submit"
                            onChange={(e) =>
                                setInputSearchResumeValue((e.target as HTMLInputElement).value) // Явное указание типа
                            }
                        >
                            {isLoadingSearchResumes ?
                                <PulseLoader color="white" size={15} /> : 'Show resume'
                            }
                        </button>
                    </form>
                    {arrSearchedResumes.length > 0 && arrSearchedResumes.length <= 9 &&
                        <div className="searched-resumes_founded-resumes">
                            <div className="resumes-els" style={additionalStyles}>
                                {searchedResumes}
                            </div>
                            <BtnGoToFullSearchResume />
                        </div>
                    }
                    {isResumeNotFounded &&
                        <div style={{ marginTop: '70px' }}>
                            <BtnGoToFullSearchResume />
                        </div>
                    }
                </header>
                <main className="main-content">
                    <div className="content-recomended-items">
                        <div className="items-recomended">
                            <div className="items-recomended-size-average items-recomended-1">
                                <div className="main-items">
                                    <img src='https://hhcdn.ru/file/17093878.svg' className="img-recomended-item" />
                                    <span className="main-text-item">Register</span>
                                    <span className="text-description-item">
                                        fill in your basic information:
                                        <br></br>full name, city, employment.
                                    </span>
                                </div>
                            </div>
                            <div className="items-recomended-size-average items-recomended-2">
                                <div className="main-items">
                                    <img src="https://hhcdn.ru/file/17093879.svg" className="img-recomended-item" />
                                    <span className="main-text-item">Post a vacancy</span>
                                    <span className="text-description-item">
                                        Get feedback from job
                                        <br></br>seekers' contacts
                                    </span>
                                </div>
                            </div>
                            <div className="items-recomended-size-average items-recomended-3">
                                <div className="main-items">
                                    <img src='https://hhcdn.ru/file/17093880.svg' className="img-recomended-item" />
                                    <span className="main-text-item">Find the developers</span>
                                    <span className="text-description-item">
                                        one of those who want to do
                                        <br></br>the same thing with you
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="content-review">
                        <div className="review">
                            <div className="left-side-review">
                                <div className="text-review">
                                    <span className="main-text-review">searchDev reviews</span>
                                    <span className="description-text-review">We strive to provide you with the best service
                                        <br></br>and continuously improve the quality of our services
                                        <br></br>to do this, we need your help!
                                    </span>
                                </div>
                                <form className="reviews-operation">
                                    <label htmlFor="select-review">Leave a rating of 1-5</label>
                                    <select
                                        id="select-review"
                                        value={valueQuality}
                                        name="select-review"
                                        onChange={(e) => setValueQuality(Number(e.target.value))}
                                    >
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </select>
                                    <button className="b-review-submit">Send</button>
                                </form>
                            </div>
                            <div className="right-side-review">
                                <img className="img-review-content" />
                            </div>
                        </div>
                    </div>
                    <div className="content-achivments">
                        <div className="items-achivments-site">
                            <div className="items-achivments-size-average items-achivments-1">
                                <div className="main-items">
                                    <img src="https://hhcdn.ru/icms/10185404.svg" className="img-achivments-item" />
                                    <span className="main-text-item">Service №1</span>
                                    <span className="text-description-item">
                                        job search and employees
                                        <br></br>in the CIS
                                    </span>
                                </div>
                            </div>
                            <div className="items-achivments-size-average items-achivments-2">
                                <div className="main-items">
                                    <img src="https://hhcdn.ru/file/17100711.svg" className="img-achivments-item" />
                                    <span className="main-text-item">5 million</span>
                                    <span className="text-description-item">
                                        monthly visitors
                                        <br></br>to searchDev.ru
                                    </span>
                                </div>
                            </div>
                            <div className="items-achivments-size-average items-achivments-3">
                                <div className="main-items">
                                    <img src='https://hhcdn.ru/file/17094054.svg' className="img-achivments-item" />
                                    <span className="main-text-item">More 1 million</span>
                                    <span className="text-description-item">
                                        found developers
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="content-articles">
                        <span className="description-articles">Useful information for entrepreneurs - in the articles</span>
                        <div className="content-articles-items">
                            <div className="items-articles">
                                <img src="https://hhcdn.ru/file/17765989.png" className="img-content-articles-item" />
                                <span className="text-articles-items">Algorithms will help you find
                                    <br></br>
                                    the developer of your dreams
                                </span>
                            </div>
                            <div className="items-articles">
                                <img src="https://hhcdn.ru/file/17836708.png" className="img-content-articles-item" />
                                <span className="text-articles-items">How to find a developer urgently:
                                    <br></br>
                                    3 ways
                                </span>
                            </div>
                            <div className="items-articles">
                                <img className="img-content-articles-item" />
                                <span className="text-articles-items">Checklist: how to choose
                                    <br></br>
                                    a development team
                                </span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            {modalContIsChangeResume && <FpModalContIsChangeResume setModalContIsChangeResume={setModalContIsChangeResume} />}
        </div>
    );
};

export default Home;