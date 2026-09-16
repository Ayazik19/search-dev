import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hookRedux";
import logoSite from './logoSite.jpg';
import { setUserQuality } from "../store/userSlice";
import imgReviewsContent2 from './imgReviewsContent2.jpg';
import imgContentArticles from './imgContentArticles.jpeg'
import './home.css';

const Home: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { userState } = useAppSelector(state => state.user);

    const [valueQuality, setValueQuality] = useState<number>(5);



    interface HandleChanges {
        handleChangeAgreement: (typeAgreement: string) => void;
        handleSetQualitySite: (event: React.FormEvent<HTMLFormElement>) => void;
    }
    

    const handleSetQualitySite: HandleChanges['handleSetQualitySite'] = (event) => {
        event.preventDefault();
        dispatch(setUserQuality(valueQuality))
    }

    const handleChangeAgreement: HandleChanges['handleChangeAgreement'] = (typeAgreement: string) => {
        // if (typeAgreement === 'Find Work' && typeFindWork !== true) {
        //     dispatch(setChangeIsFindWork(true))
            navigate('/create-resume');
        // }
        // else if (typeAgreement === 'Find Dev' && typeFindDev !== true) {
        //     dispatch(setChangeIsFindDev(true))
        // }
    }

    return (
        <div className="home-main">
            <nav>
                <div className="left-side-nav">
                    <img src={logoSite} className="logo-site" />
                    <span className="text-city-user">City</span>
                </div>
                <div className="right-side-nav">
                    {/* {typeFindWork !== true && ( */}
                        <button
                            className="b-type_search-resume"
                            onClick={() => handleChangeAgreement('Find Work')}
                        >
                            Create resume
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
                        Quick and convenient resume search, <br></br>
                        thousands of resumes developers<br></br>
                        from professionals in different fields
                    </span>
                    <form className="operation-search-resumes">
                        <input
                            className="input-serach-resume"
                            placeholder="Area and specialization"
                        />
                        <button
                            className="butt-search-resume"
                            type="submit"
                        >
                            Show resume
                        </button>
                    </form>
                </header >
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
                                <form className="reviews-operation" onSubmit={handleSetQualitySite}>
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
                                <img src={imgReviewsContent2} className="img-review-content" />
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
                                <img src="https://hhcdn.ru/file/17765989.png" className="img-content-articles-item"/>
                                <span className="text-articles-items">Algorithms will help you find 
                                    <br></br>
                                    the developer of your dreams
                                </span>
                            </div>
                            <div className="items-articles">
                                <img src="https://hhcdn.ru/file/17836708.png" className="img-content-articles-item"/>
                                <span className="text-articles-items">How to find a developer urgently: 
                                    <br></br>
                                    3 ways
                                </span>
                            </div>
                            <div className="items-articles">
                                <img src = {imgContentArticles} className="img-content-articles-item"/>
                                <span className="text-articles-items">Checklist: how to choose 
                                    <br></br>
                                    a development team
                                </span>
                            </div>
                        </div>
                    </div>
                </main>

            </div>
        </div>
    );
};

export default Home;