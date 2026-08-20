import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../hookRedux";
import TitleContsResult from "./titleContsResult";
import defaultIcon from '../../../../../../dist/icons/iconInstagramSocial.png';
import './resultCreationResume.css';
import imgDefaultUser from '../../../../../../dist/images/imgDefaultUser.png';
import iconSetUserPhoto from '../../../../../../dist/icons/iconSetUserPhoto.png'
import { iconMap } from "../../../../../dataArrays/listSocialContacts";
import { SocialNetwork } from "../../../../../types/typesResume";
import { setPhotoResume } from "../../../../../store/resumesSlice";
import iconMenuPreviewPhotoResume from '../../../../../../dist/icons/iconMenuPreviewPhotoResume.png'
import iconCloseFpContReview from '../../../../../../dist/icons/iconRemoveValSearchStack.png'
import iconAddOtherPhotoResume from '../../../../../../dist/icons/iconAddOtherPhotoResume.png'
import iconInstallPhotoResume from '../../../../../../dist/icons/iconInstallPhotoResume.png'
import iconDeletePhotoResume from '../../../../../../dist/icons/iconDeletePhotoResume.png'
import { setBackStep } from "../../../../../store/stepsResume";


const MIN_ZOOM = 1;
const MAX_ZOOM = 3.5;
const ZOOM_STEP = 0.15;

interface ComponentEdit {
    [componentName: string]: React.ReactNode,
    isCurrentEdit: boolean
}

interface Props {
    setIsVisibleTitleCont: (value: boolean) => void;
    isVisibleTitleCont: boolean;
    setIsShowBigFpModalResult: (value: boolean) => void;
    setIsFinishedResumeDetails: (value: boolean) => void;
}

interface EditDataComponents {
    [componentName: string]: ComponentEdit,
}

export interface SelectedPhotoResume {
    photoUrl: string,
    photoFile: File | null
}

interface CompletionTips {
    id: number,
    textCompletion: string,
    stepToEditData: number | null,
    funcGoToEdit?: any // подумать над этим, для тех мест, где не нужно передавать номер степа
}

const ResultCreationResume: React.FC<Props> = ({ setIsVisibleTitleCont, isVisibleTitleCont, setIsShowBigFpModalResult, setIsFinishedResumeDetails }) => {
    const { resumesState } = useAppSelector(state => state.resumes);
    const dispatch = useAppDispatch();
    const amountTimeWorked = resumesState.amountTimeWorked;
    const mainResumeRef = useRef<HTMLDivElement>(null);
    const initialSelectedPhoto = { photoUrl: '', photoFile: null } as SelectedPhotoResume;
    //перенести это в тот момент, когда происходит конечный сабмит
    //сделать по типу setLoading(true)
    const [textErrorSelectedPhoto, setTextErrorSelectedPhoto] = useState<string>('');
    const [selectedFilePhoto, setSelectedFilePhoto] = useState<SelectedPhotoResume>(initialSelectedPhoto);
    const [changeHeader, setChangeHeader] = useState<boolean>(false);
    const [isShowPreviewPhotoResume, setIsShowPreviewPhotoResume] = useState<boolean>(false);
    const [previewScale, setPreviewScale] = useState<number>(1);
    const [previewOffset, setPreviewOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [isPreviewDragging, setIsPreviewDragging] = useState<boolean>(false);
    const [isShowMenuReviewPhotoResume, setIsShowMenuReviewPhotoResume] = useState<boolean>(false);
    const previewDragStartRef = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);

    const [arrCompletionTips, setArrCompletionTips] = useState<CompletionTips[]>([])

    useEffect(() => {
        if (resumesState.basicInfo?.socialContactsLinks) {
            if (resumesState.basicInfo?.socialContactsLinks.length < 2) {
                setArrCompletionTips(prev => [
                    ...prev,
                    { id: arrCompletionTips.length + 1, textCompletion: 'Add more links to social profiles', stepToEditData: 2 }
                ])
            }
        }

        if (resumesState.education?.educationClass === 'There is no education in IS') {
            setArrCompletionTips(prev => [
                ...prev,
                { id: arrCompletionTips.length + 1, textCompletion: 'Fill in your education in information systems', stepToEditData: 3 }
            ])
        }

        if (resumesState.petProjects) { // это не правильно работает
            if (resumesState.petProjects.length === 0) {
                setArrCompletionTips(prev => [
                    ...prev,
                    { id: arrCompletionTips.length + 1, textCompletion: 'Add your pet projects', stepToEditData: 5 }
                ])
            }
        }

        if (resumesState.positions) {// это не правильно работает
            if (resumesState.positions.length === 0) {
                setArrCompletionTips(prev => [
                    ...prev,
                    { id: arrCompletionTips.length + 1, textCompletion: 'Add your work experience in companies', stepToEditData: 5 }
                ])
            }
        }

        if (resumesState.salary) {
            if (resumesState.salary.amount === '') {
                setArrCompletionTips(prev => [
                    ...prev,
                    { id: arrCompletionTips.length + 1, textCompletion: 'Specify your desired salary', stepToEditData: null }
                ])
            }
        }

        if (resumesState.busyness) {
            if (resumesState.busyness.length <= 1) {
                setArrCompletionTips(prev => [
                    ...prev,
                    { id: arrCompletionTips.length + 1, textCompletion: 'Select your employment type', stepToEditData: null }
                ])
            }
        }

        if (resumesState.workFormat) {
            if (resumesState.workFormat.length <= 1) {
                setArrCompletionTips(prev => [
                    ...prev,
                    { id: arrCompletionTips.length + 1, textCompletion: 'Select your work format', stepToEditData: null }
                ])
            }
        }

        if (resumesState.photo) {
            if (resumesState.photo === '') {
                setArrCompletionTips(prev => [
                    ...prev,
                    { id: arrCompletionTips.length + 1, textCompletion: 'Upload a photo to your resume', stepToEditData: null  }
                ])
            }
        }
    }, [resumesState])


    const handleScroll = () => {
        if (mainResumeRef.current) {
            const currentCountScroll = mainResumeRef.current.scrollTop;

            if (currentCountScroll >= 190) {
                setChangeHeader(true)
            }
            else {
                setChangeHeader(false);
            }
        }
    }

    const displayWorkFormats = resumesState?.workFormat?.map((el, index) => {
        return (
            <span key={index} style={{ marginLeft: index !== 0 ? '3px' : '0px' }}>
                {index + 1 !== resumesState.workFormat?.length ? `${el},` : el}
            </span>
        );
    })
    const displayBusyness = resumesState?.busyness?.map((el, index) => {
        return (
            <span key={index} style={{ marginLeft: index !== 0 ? '3px' : '0px' }}>
                {index + 1 !== resumesState.busyness?.length ? `${el},` : el}
            </span>
        );
    })
    const displayCitiz = resumesState?.basicInfo?.citizenship?.map((el, index) => {
        return (
            <span key={index} style={{ marginLeft: index !== 0 ? '3px' : '0px' }}>
                {index + 1 !== resumesState.basicInfo?.citizenship?.length ? `${el},` : el}
            </span>
        );
    })
    const displayWorkPermit = resumesState?.basicInfo?.workPermit?.map((el, index) => {
        return (
            <span key={index} style={{ marginLeft: index !== 0 ? '3px' : '0px' }}>
                {index + 1 !== resumesState.basicInfo?.workPermit?.length ? `${el},` : el}
            </span>
        );
    })

    const displaySocials = resumesState.basicInfo?.socialContactsLinks?.map((item, index) => {
        const iconSrc = iconMap[item.nameSelectedSocial as SocialNetwork]
        return (
            <a
                key={index}
                className="link-to-social"
                target="_blank"
                style={{ marginLeft: index !== 0 ? '7.5px' : '0px' }}
                href={item.link}
            >
                <img src={iconSrc} className="icon-social" />
            </a>
        );
    })


    const displayExpiriences = resumesState.positions?.map((item, index) => {

        const displayPostItem = item.post?.map((item, index) => {
            return (
                <div key={index} className="post-item-info">
                    <span className="params-info">{item.postName}</span>
                    <span className="params-info">{item.descriptionPost}</span>
                </div>
            );
        })

        return (
            <div key={index} className="item-expirience" style={{ marginTop: index !== 0 ? '15px' : '0' }}>
                <span className="params-info name-company">{item.nameCompany}</span>
                <div className="params-info time-worked-company">
                    <span>{item.workingTime?.sinceDate} - {item.workingTime?.toDate} -
                        {
                            item.workingTime?.countTime?.year !== undefined && item.workingTime?.countTime?.year !== 0 &&
                            `${item.workingTime?.countTime?.year} ${item && item.workingTime.countTime?.year > 1 ? 'years' : 'year'}`
                        }
                    </span>
                    <span style={{ marginLeft: '3px' }}>
                        {
                            item.workingTime?.countTime?.month !== undefined && item.workingTime?.countTime?.month !== 0 &&
                            `${item.workingTime?.countTime?.month} ${item.workingTime.countTime?.month > 1 ? 'months' : 'month'}`
                        },
                    </span>
                    <span style={{ marginLeft: '3px' }}>{item.cityCompany}</span>
                </div>
                <div className="params-info posts-resume">
                    {displayPostItem}
                </div>
            </div>
        );
    })

    const displayPetProjects = resumesState.petProjects?.map((item, index) => {
        return (
            <div key={index} className="item-pet-project-result-creation-resume" style={{ marginTop: index !== 0 ? '15px' : '0' }}>
                <span className="params-info name-project">{item.name}</span>
                <div>
                    <a className="params-info link-project-result-creation-resume" target="_blank" href={item.url}>{item.url}</a>
                </div>
                <span className="params-info desc-project">{item.description}</span>
            </div>
        );
    })

    const displaySkills = resumesState.skills?.map(el => {
        const widthCountLength = el.length > 6 ? el.length - 6 : 6 - el.length;

        return (
            <div key={el} className="el-skill-result-creation-resume" style={{
                width: `calc(110px + ${el.length > 6 ? widthCountLength * 5 : -widthCountLength * 12}px)`,
            }}>
                <span>{el}</span>
            </div>
        );
    })

    let styleStatusSearch: {} = {};
    const statusSearchWork = resumesState.statusSearchResume;
    if (statusSearchWork === 'I am actively looking') {
        styleStatusSearch = {
            backgroundColor: '#a7ffbf',
            color: 'black',
        }
    }
    else if (statusSearchWork === 'Passive job search') {
        styleStatusSearch = {
            backgroundColor: 'rgb(255, 255, 156)',
            color: 'black',
        }
    }
    else {
        styleStatusSearch = {
            backgroundColor: 'rgb(54, 33, 33)',
            color: 'white',
        }
    }

    useEffect(() => {
        if (textErrorSelectedPhoto) {
            const showContMessage = setTimeout(() => {
                setTextErrorSelectedPhoto('');
            }, 4000);

            return () => {
                clearTimeout(showContMessage);
            }
        }
    }, [textErrorSelectedPhoto])

    useEffect(() => {
        if (!isShowPreviewPhotoResume) {
            setPreviewScale(1);
            setPreviewOffset({ x: 0, y: 0 });
            setIsPreviewDragging(false);
            previewDragStartRef.current = null;
        }
    }, [isShowPreviewPhotoResume]);

    useEffect(() => {
        if (previewScale === 1) {
            setPreviewOffset({ x: 0, y: 0 });
            setIsPreviewDragging(false);
            previewDragStartRef.current = null;
        }
    }, [previewScale]);

    const handlePreviewWheel = (event: React.WheelEvent<HTMLImageElement>) => {
        event.preventDefault();

        setPreviewScale((currentScale) => {
            const nextScale = event.deltaY < 0
                ? currentScale + ZOOM_STEP
                : currentScale - ZOOM_STEP;

            const normalizedScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextScale));

            if (normalizedScale === 1) {
                setPreviewOffset({ x: 0, y: 0 });
                setIsPreviewDragging(false);
                previewDragStartRef.current = null;
            }

            return normalizedScale;
        });
    };

    const handlePreviewMouseDown = (event: React.MouseEvent<HTMLImageElement>) => {
        if (previewScale <= 1) {
            return;
        }

        setIsPreviewDragging(true);
        previewDragStartRef.current = {
            x: event.clientX,
            y: event.clientY,
            offsetX: previewOffset.x,
            offsetY: previewOffset.y,
        };
    };

    const handlePreviewMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!isPreviewDragging || !previewDragStartRef.current) {
            return;
        }

        const deltaX = event.clientX - previewDragStartRef.current.x;
        const deltaY = event.clientY - previewDragStartRef.current.y;

        setPreviewOffset({
            x: previewDragStartRef.current.offsetX + deltaX,
            y: previewDragStartRef.current.offsetY + deltaY,
        });
    };

    const handlePreviewMouseUp = () => {
        setIsPreviewDragging(false);
        previewDragStartRef.current = null;
    };

    const handlePreviewDoubleClick = () => {
        setPreviewScale(1);
        setPreviewOffset({ x: 0, y: 0 });
    };

    const handleSetPhotoResume = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = (e: Event) => {
            const target = e.target as HTMLInputElement;
            const file = target.files?.[0];

            if (file) {
                if (file.type === 'image/jpeg' || file.type === 'image/png') {
                    if (file.size <= 5 * 1024 * 1024) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const url = e.target?.result as string;

                            if (selectedFilePhoto.photoUrl !== '' && url === selectedFilePhoto.photoUrl) {
                                setTextErrorSelectedPhoto('Выбранное фото уже добавлено')
                            }
                            else {
                                setSelectedFilePhoto({ photoUrl: url, photoFile: file });
                            }
                        };
                        reader.readAsDataURL(file);
                    }
                    else {
                        setTextErrorSelectedPhoto('Размер фото должен быть не больше 5 MB');
                    }
                }
                else {
                    setTextErrorSelectedPhoto('Фото должно быть форматом JPEG или PNG')
                }
            }
        }

        input.click();
    }

    const handleAddOtherPhotoResume = () => {
        handleSetPhotoResume();
        setIsShowMenuReviewPhotoResume(false);
    }

    const handleInstallPhotoResume = async () => {
        try {
            const response = await fetch(selectedFilePhoto.photoUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            if (selectedFilePhoto.photoFile && selectedFilePhoto.photoFile.name) link.download = selectedFilePhoto.photoFile.name
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            setIsShowMenuReviewPhotoResume(false);
        }
        catch (error) {
            console.log(error)
        }
    }

    const handleDeletePhotoResume = () => {
        setSelectedFilePhoto(initialSelectedPhoto);
        setIsShowMenuReviewPhotoResume(false);
        setIsShowPreviewPhotoResume(false);
    }

    const handleGoToEditResume = (currentStepToEdit: number) => {
        setIsShowBigFpModalResult(false);
        dispatch(setBackStep(currentStepToEdit))
    }

    const handleBackToFinishResumeDetails = () => {
        setIsFinishedResumeDetails(false);
        setIsVisibleTitleCont(false)
    }

    const displayListCompletionTips = arrCompletionTips &&
        arrCompletionTips.slice().map((item, index) => {
            const textCompletion = item.textCompletion
            let calcWidthCont: string = '';

            if (textCompletion === 'Add more links to social profiles') {
                calcWidthCont = '260px';
            }
            else if (textCompletion === 'Add your work experience in companies') {
                calcWidthCont = '310px';
            }
            else if (textCompletion === 'Fill in your education in information systems') {
                calcWidthCont = '350px';
            }
            else if (textCompletion === 'Add your pet projects' || textCompletion === 'Select your work format') {
                calcWidthCont = '185px';
            }
            else {
                calcWidthCont = '230px';
            }


            return (
                <div key={index} className="completion-tip" style={{ width: calcWidthCont }} onClick={() => handleGoToEditResume(item.stepToEditData ?? 0)}>
                    <span className="text-completion-tip">{item.textCompletion}</span>
                </div>
            );
        })

    return isVisibleTitleCont ? <TitleContsResult textTitle={'Its almost there...'} setIsVisibleTitleCont={setIsVisibleTitleCont} /> : (
        <>
            <div className="result-resume">
                <header className="header-resume">
                    {changeHeader ?
                        <div className="header-resume-info_scrolled-under">
                            <div className="start-side-header-result-creation-resume">
                                <img src={selectedFilePhoto.photoUrl !== '' ? selectedFilePhoto.photoUrl : imgDefaultUser} className="img-resume-header" />
                                <span className="left-side-header-main-text">{resumesState.basicInfo?.firstName} {resumesState.basicInfo?.lastName}</span>
                            </div>
                            <div className="end-side-header-result-creation-resume">
                                <span className="center-side-header-main-text">{resumesState.levelIsResume} {resumesState.nameResume}</span>
                            </div>
                        </div>
                        :
                        <span className="header-text-resume">
                            Your completed resume
                        </span>
                    }
                </header>
                <main className="main-resume" ref={mainResumeRef} onScroll={handleScroll}>
                    <div className="resume-media">
                        <div className="img-resume-user" style={{ backgroundColor: selectedFilePhoto.photoUrl === '' ? 'gray' : undefined }}>
                            <img
                                src={selectedFilePhoto.photoUrl !== '' ? selectedFilePhoto.photoUrl : imgDefaultUser}
                                style={{
                                    width: selectedFilePhoto.photoUrl !== '' ? '100%' : undefined,
                                    height: selectedFilePhoto.photoUrl !== '' ? '100%' : undefined,
                                    cursor: selectedFilePhoto.photoUrl !== '' ? 'pointer' : 'auto'
                                }}
                                onClick={() => selectedFilePhoto.photoUrl !== '' && setIsShowPreviewPhotoResume(true)}
                                className="img-resume"
                            />
                            <div className="set-own-img-resume" onClick={handleSetPhotoResume}>
                                <img src={iconSetUserPhoto} className="icon-set-user-resume-photo" />
                            </div>
                        </div>
                        <span className="contact-name">
                            {resumesState.basicInfo?.firstName} {resumesState.basicInfo?.lastName} {resumesState.basicInfo?.patronymic}
                        </span>
                        <span className="resume-name">
                            {resumesState.levelIsResume} {resumesState.nameResume}
                        </span>
                    </div>
                    <div className="pre-header">
                        <div className="resume-info working-conditions-info">
                            <div>
                                <span className="text-edit-data" onClick={handleBackToFinishResumeDetails}>Edit</span>
                            </div>
                            <span className="params-info">
                                Work format: {displayWorkFormats}
                            </span>
                            <span className="params-info">
                                Busyness: {displayBusyness}
                            </span>
                            <span className="params-info">
                                Salary conditions - {resumesState.salary?.amount}{resumesState.salary?.currency}
                            </span>
                        </div>
                        <div>
                            <span className="text-edit-data" onClick={() => handleGoToEditResume(2)}>Edit</span>
                        </div>
                        <div className="params-info main-contact" >
                            <span>
                                {resumesState.basicInfo?.gender || 'Male'},
                            </span>
                            <span style={{ marginLeft: '3px' }}>
                                {resumesState.basicInfo?.dateBirth?.day}.{resumesState.basicInfo?.dateBirth?.month}.{resumesState.basicInfo?.dateBirth?.year},
                            </span>
                            <span style={{ marginLeft: '3px' }}>
                                {resumesState.basicInfo?.city}
                            </span>
                        </div>
                        <div className="location-works-contact">
                            <span className="params-info citizensip-text">
                                Citizenship: {displayCitiz}
                            </span>
                            <span className="params-info work-permit-text">
                                Work permit: {displayWorkPermit}
                            </span>
                        </div>
                        <div className="status-search-work" style={styleStatusSearch}>
                            {resumesState.statusSearchResume}
                        </div>
                        <div className="main-contacts">
                            <div>
                                <span className="text-edit-data" onClick={() => handleGoToEditResume(2)}>Edit</span>
                            </div>

                            <span className="params-info text-name-cont">Contacts:</span>
                            <div className="default-contact">
                                <span className="params-info phone-number-text">
                                    {resumesState.basicInfo?.phoneNumber}
                                </span>
                                <span className="params-info email-text">
                                    {resumesState.basicInfo?.elAddress}
                                </span>
                            </div>
                            <div className="params-info social-contacts">
                                {displaySocials}
                            </div>
                        </div>
                    </div>
                    {resumesState.positions && resumesState.positions.length > 0 && <div className="expirience-info">
                        <div className="header-cont-resume-info">
                            <span className="name-cont">
                                {typeof amountTimeWorked === 'object' ?
                                    <div>
                                        {amountTimeWorked.year !== 0 &&
                                            <>
                                                <span>{amountTimeWorked.year}</span>
                                                <span style={{ marginLeft: '5px' }}>{amountTimeWorked.year > 1 ? 'years' : 'year'}</span>
                                            </>
                                        }
                                        <span style={{ marginLeft: amountTimeWorked.year !== 0 ? '5px' : '0px' }}>{amountTimeWorked.month}</span>
                                        <span style={{ marginLeft: '5px' }}>{amountTimeWorked.month > 1 ? 'months' : 'month'}</span>
                                        <span style={{ marginLeft: '5px' }}>expirience</span>
                                    </div> :
                                    <span>
                                        {amountTimeWorked} year expirience
                                    </span>
                                }
                            </span>
                            <span className="text-edit-data" style={{ marginLeft: '15px' }} onClick={() => handleGoToEditResume(5)}>Edit</span>
                        </div>
                        <div className="params-info positions-resume">
                            {displayExpiriences}
                        </div>
                    </div>}
                    {resumesState.petProjects && resumesState.petProjects.length > 0 &&
                        <div className="pet-projects-info">
                            <div className="header-cont-resume-info">
                                <span className="name-cont">
                                    Pet projects
                                </span>
                                <span className="text-edit-data" style={{ marginLeft: '15px' }} onClick={() => handleGoToEditResume(5)}>Edit</span>
                            </div>
                            <div className="params-info pet-projects-resume">
                                {displayPetProjects}
                            </div>
                        </div>
                    }
                    {resumesState.education?.educationClass !== 'There is no education in IS' &&
                        <div className="education-info">
                            <div className="header-cont-resume-info">
                                <span className="name-cont">
                                    Education
                                </span>
                                <span className="text-edit-data" style={{ marginLeft: '15px' }} onClick={() => handleGoToEditResume(3)}>Edit</span>
                            </div>
                            <div className="params-info item-education-result-creation-resume">
                                <span className="params-info name-instituation-creation-resume">{resumesState.education?.nameInstituation}</span>
                                <span className="params-info name-faculty-creation-resume">{resumesState.education?.faculty}</span>
                                <span className="params-info year-graduation-result-creation-ersume">{resumesState.education?.yearGraduation}</span>
                            </div>
                        </div>
                    }
                    <div className="soft-skills-IS-result-creation-resume">
                        <div className="header-cont-resume-info">
                            <span className="name-cont">Skills</span>
                            <span className="text-edit-data" style={{ marginLeft: '15px' }} onClick={() => handleGoToEditResume(6)}>Edit</span>
                        </div>
                        <div className="list-skills-result-creation-resume">
                            {displaySkills}
                        </div>
                    </div>
                    {/* <div className="description-result-creation-resume">
                        <div className="header-cont-resume-info">
                            <span className="name-cont">About me</span>
                            <span className="text-edit-data" style={{ marginLeft: '15px' }}>Edit</span>
                        </div>
                        <span className="params-info text-desc-result-creation-resume">
                            {resumesState.descriptionResume}
                        </span>
                    </div> */}
                </main>
                <footer className="footer-result-creation-resume">
                    {arrCompletionTips.length > 0 &&
                        <div className="resume-completion-tips">
                            <header className="header-info-completion-tips">
                                <span className="main-text-info-completion-tips">What’s missing from the resume? Fill in all missing fields for better responses.</span>
                            </header>
                            <main className="list-completion-tips">
                                {displayListCompletionTips}
                            </main>
                        </div>
                    }
                    <div className="btns-result-creation-resume">
                        <button
                            className="btn-back-to-modal-resume-finish-details"
                            onClick={handleBackToFinishResumeDetails}
                        >
                            Back
                        </button>
                        <button
                            className="btn-finish-result"
                        >
                            Finish
                        </button>
                    </div>
                </footer>
                {textErrorSelectedPhoto !== '' &&
                    <div className="cont-message-error-selected-photo-resume" style={{ width: textErrorSelectedPhoto === 'Фото слишком много весит' ? '260px' : '340px' }}>
                        <span className="text-error-selected-photo">{textErrorSelectedPhoto}</span>
                    </div>
                }
            </div>
            {isShowPreviewPhotoResume &&
                <div
                    className="big-fp-preview-cont"
                    onMouseMove={handlePreviewMouseMove}
                    onMouseUp={handlePreviewMouseUp}
                    onMouseLeave={handlePreviewMouseUp}
                >
                    <div className="header-preview-cont">
                        <span className="text-preview-photo">Загруженное фото для резюме</span>
                        <div className="menu-preview-photo-resume">
                            <div className="menu-photo-resume">
                                <div>
                                    <img src={iconMenuPreviewPhotoResume} className="icon-menu-preview-photo-resume" onClick={() => setIsShowMenuReviewPhotoResume(isShowMenuReviewPhotoResume ? false : true)} />
                                    {isShowMenuReviewPhotoResume &&
                                        <div className="menu-preview">
                                            <div className="list-actions-menu-preview">
                                                <div
                                                    className="action-menu-preview preview-add-other-photo-resume"
                                                    onClick={handleAddOtherPhotoResume}
                                                >
                                                    <img src={iconAddOtherPhotoResume} className="icon-action-menu-preview icon-add-other-photo-resume" />
                                                    <span className="text-action-menu">Добавить другое фото</span>
                                                </div>
                                                <div
                                                    className="action-menu-preview preview-install-photo-resume"
                                                    onClick={handleInstallPhotoResume}
                                                >
                                                    <img src={iconInstallPhotoResume} className="icon-action-menu-preview icon-install-photo-resume" />
                                                    <span className="text-action-menu">Скачать фото</span>
                                                </div>
                                                <div
                                                    className="action-menu-preview preview-delete-photo-resume"
                                                    onClick={handleDeletePhotoResume}
                                                >
                                                    <img src={iconDeletePhotoResume} className="icon-action-menu-preview icon-delete-photo-resume" />
                                                    <span className="text-action-menu">Удалить</span>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                                <img src={iconCloseFpContReview} className="icon-menu-preview-photo-resume" onClick={() => setIsShowPreviewPhotoResume(false)} />
                            </div>
                            <img className="close-big-fp-preview-cont" onClick={() => setIsShowPreviewPhotoResume(false)} />
                        </div>
                    </div>
                    <div className="img-current-photo-resume-wrap">
                        <img
                            className="img-current-photo-resume"
                            src={selectedFilePhoto.photoUrl}
                            onWheel={handlePreviewWheel}
                            onMouseDown={handlePreviewMouseDown}
                            onDoubleClick={handlePreviewDoubleClick}
                            style={{
                                transform: `translate(${previewOffset.x}px, ${previewOffset.y}px) scale(${previewScale})`,
                                cursor: previewScale > 1 ? (isPreviewDragging ? 'grabbing' : 'grab') : 'zoom-in'
                            }}
                            draggable={false}
                        />
                    </div>
                    <div className="footer-preview-cont">
                        <span className="zoom-preview-photo-resume">
                            {Math.round(previewScale * 100)}%
                        </span>
                    </div>
                </div>
            }
        </>
    );
}

export default ResultCreationResume;