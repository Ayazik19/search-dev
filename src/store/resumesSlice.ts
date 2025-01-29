import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResumeState, Resume, BasicInfo, Education, Positions, Date, Post, ProjectsProfileLinks, Projects, skills, statusSearchResume, levelIsResume } from "../types/typesResume";
import { FormValues } from "../components/componentsCreatePage/componentsStepsResume/stepResumeFour";
import { differenceInMonths, differenceInYears, format, parseISO } from "date-fns";
import { ProjectsForm } from "../components/componentsCreatePage/componentsStepsResume/componentsStepFive/resumePetProjects";


const initialState: ResumeState = {
    resumesState: {
        idResumeDb: '',
        nameResume: '',
        isResumeCompleted: false,
        basicInfo: {},
        education: {},
        skills: [],
        projectsProfile: [],
        typeWorkResume: '',
        positions: [],
        petProjects: [],
        amountTimeWorked: {year: 0, month: 0},
        statusSearchResume: 'Default',
        levelIsResume: 'Middle Developer',
    }
};

interface ChangeFieldPayload {
    post: Positions;
    field: string;
    value: string;
}

interface ChangePostArrPayload {
    post: Post[],
    mainIdPost: number
}


interface Funcs {
    formattedWorkingTimeDate: (sinceDate: string, toDate: string) => {
        formattedSinceDate: string,
        formattedToDate: string,
        calculateCountTime: Date
    }
    calculateAmountWorkingTime: (positions: Positions) => {
        calculateAmountTimeWorked: Date
    }
    getEarlyOrLateDate: (positions: Positions[], typeGetDate: string) => string;
}
export const formattedWorkingTimeDate: Funcs['formattedWorkingTimeDate'] = (sinceDate, toDate) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const currentDateString = `${year}-${month}-${day}`;

    const formattedSinceDate = parseISO(sinceDate);

    const formattedToDate = toDate === 'to date' ? new Date(currentDateString) : parseISO(toDate);

    const calculateCountTimeYear = differenceInYears(formattedToDate, formattedSinceDate);
    const calculateCountTimeMonth = differenceInMonths(formattedToDate, formattedSinceDate) % 12;



    const countTime = {
        month: calculateCountTimeMonth,
        year: calculateCountTimeYear
    };

    return {
        formattedSinceDate: format(formattedSinceDate, 'MMMM yyyy'),
        formattedToDate: format(formattedToDate, 'MMMM yyyy'),
        calculateCountTime: countTime
    };
};

const getEarlyOrLateDate: Funcs['getEarlyOrLateDate'] = (positions: Positions[], typeGetDate: string) => {
    let resDateYear = '';
    let resDateMonth = '';
    let resDateDay = '';

    const isToDateField = positions.find(item => item.workingTime?.toDate === 'toDate');

    for (let i = 0; i < positions.length; i++) {
        const workingTime = positions[i].workingTime;
        const typeDateOperation = typeGetDate === 'early' ? workingTime?.sinceDate : workingTime?.toDate;

        const dateYear = typeDateOperation?.slice(0, 4) || '';
        const dateDay = typeDateOperation?.slice(8, 10) || '';
        const dateMonth = typeDateOperation?.slice(5, 7) || '';

        if (i !== positions.length && !isToDateField) {
            if (resDateYear !== '' && resDateMonth !== '') {
                if (dateYear && dateMonth) {
                    const yearNum = parseInt(dateYear, 10);
                    const monthNum = parseInt(dateMonth, 10);
                    const typeComprassion = typeGetDate === 'early' ? yearNum < parseInt(resDateYear, 10) : yearNum > parseInt(resDateYear, 10);
                    const isEarlyOrLateYear = typeComprassion ? typeDateOperation : false;
                    const isEqualYear = yearNum === parseInt(resDateYear, 10);

                    if (isEarlyOrLateYear && !isEqualYear) {
                        resDateYear = typeGetDate === 'early' ? Math.min(yearNum, parseInt(resDateYear, 10)).toString() : Math.max(yearNum, parseInt(resDateYear, 10)).toString();
                        resDateDay = dateDay;
                    } else if (!isEarlyOrLateYear && isEqualYear) {
                        resDateMonth = typeGetDate === 'early' ? Math.min(monthNum, parseInt(resDateMonth, 10)).toString() : Math.max(monthNum, parseInt(resDateMonth, 10)).toString();
                        resDateDay = dateDay;
                    }
                }
            } else {
                resDateYear = dateYear;
                resDateMonth = dateMonth;
                resDateDay = dateDay;
            }
        }
    }


    const formattedMonth = resDateMonth.padStart(2, '0');

    const resFormattedFullDate = (!isToDateField && typeGetDate !== 'toDate')
        ? `${resDateYear}-${formattedMonth}-${resDateDay}`
        : 'to date';

    return isToDateField !== undefined && typeGetDate === 'toDate' ? 'toDate' : resFormattedFullDate;
}

const resumesSlice = createSlice({
    name: "resume",
    initialState,
    reducers: {
        setNameResume(state, action: PayloadAction<string>) {
            if (state.resumesState) {
                state.resumesState.nameResume = action.payload;
            }
            else {
                const { resumesState } = state;
                const lengthArr = resumesState || 0;


                const newResume = {
                    idResume: lengthArr + 1,
                    nameResume: action.payload,
                    isResumeCompleted: false,
                };
                state.resumesState = newResume;
            }
        },
        setBasicInfo(state, action: PayloadAction<BasicInfo>) {
            const basicInfoUpdates = action.payload; 

            state.resumesState = {
                ...state.resumesState,
                basicInfo: {
                    ...state.resumesState.basicInfo,
                    ...basicInfoUpdates, 
                },
            };
        },
        setEducationClass(state, action: PayloadAction<string>) {
            const education: Education = {
                educationClass: action.payload
            };

            state.resumesState = {
                ...state.resumesState,
                education: education, 
            };
        },
        setEducation(state, action: PayloadAction<FormValues>) {
            const payloadObject = action.payload;
            const resumesState = state.resumesState;


            if (resumesState && resumesState.education) {
                resumesState.education.nameInstituation = payloadObject.nameInstituation;
                resumesState.education.faculty = payloadObject.faculty;
                resumesState.education.yearGraduation = payloadObject.yearGradiation;
            }
        },
        setChangeTypeWork(state, action: PayloadAction<string>) {
            const resumesState = state.resumesState;

            if (resumesState) {
                resumesState.typeWorkResume = action.payload;
            }
        },
        setAmountTimeWorked(state) {
            const resumesState = state.resumesState;

            if (resumesState.positions) {
                const length = resumesState.positions.length;
                const positions = resumesState.positions;
                if (length > 1) {
                    const getEarlySinceDate = getEarlyOrLateDate(positions, 'early');
                    const getLateToDate = getEarlyOrLateDate(positions, 'toDate');

                    const amountCountTimeWorked = formattedWorkingTimeDate(getEarlySinceDate, getLateToDate)

                    state.resumesState.amountTimeWorked = amountCountTimeWorked.calculateCountTime;
                }
                else if (length === 1) {
                    const stateFirstObjPos = resumesState.positions[0].workingTime?.countTime;
                    resumesState.amountTimeWorked = stateFirstObjPos;
                }
                else {
                    resumesState.amountTimeWorked = {
                        year: 0,
                        month: 0
                    };
                }
            }
        },
        setPosition(state, action: PayloadAction<Positions>) {
            const resumesState = state.resumesState;


            const positions = resumesState.positions ?? [];
            const lengthPositions = positions.length;
            const payloadObj = action.payload;

            let payloadDataSinceDatePost = payloadObj.workingTime?.sinceDate || '';
            let payloadDataToDatePost = payloadObj.workingTime?.toDate || '';

            let formattedCountTime = { year: 0, month: 0 };

            if (payloadDataSinceDatePost && payloadDataToDatePost) {
                const formattedWorkingTime = formattedWorkingTimeDate(payloadDataSinceDatePost, payloadDataToDatePost);

                formattedCountTime = formattedWorkingTime.calculateCountTime || { year: 0, month: 0 };
            }


            const finallyPost = {
                idPosition: lengthPositions,
                nameCompany: payloadObj.nameCompany,
                cityCompany: payloadObj.cityCompany,
                post: payloadObj.post,
                workingTime: {
                    sinceDate: payloadDataSinceDatePost,
                    toDate: payloadDataToDatePost,
                    countTime: {
                        year: formattedCountTime.year,
                        month: formattedCountTime.month
                    }
                },
            };

            if (resumesState.positions) {
                resumesState.positions?.push(finallyPost);
            }
            else {
                resumesState.positions = [finallyPost];
            }
        },
        setUpdIdsPositions(state) {
            const resumesState = state.resumesState;


            const statePositions = resumesState.positions;
            if (statePositions && statePositions.length >= 1) {
                const updIdsPos = statePositions?.map((item, index) => {
                    return {
                        idPosition: index,
                        nameCompany: item.nameCompany,
                        cityCompany: item.cityCompany,
                        post: item.post,
                        workingTime: {
                            sinceDate: item.workingTime?.sinceDate || '',
                            toDate: item.workingTime?.toDate || '',
                            countTime: {
                                year: item.workingTime?.countTime?.year ?? 0,
                                month: item.workingTime?.countTime?.month ?? 0
                            }
                        }
                    };
                });
                resumesState.positions = updIdsPos;
            }

        },
        setFilterPositions(state, action: PayloadAction<number>) {
            state.resumesState.positions = state.resumesState.positions?.filter(item => item.idPosition !== action.payload);
        },
        setFilterProjects(state, action: PayloadAction<number>) {
            state.resumesState.petProjects = state.resumesState.petProjects?.filter(item => item.idProject !== action.payload)
        },
        setChangeFieldPost(state, action: PayloadAction<ChangeFieldPayload>) {
            const resumesState = state.resumesState;


            const postChange = action.payload.post;
            const fieldChange = action.payload.field;
            const valueChange = action.payload.value;

            const statePositions = resumesState.positions;
            if (statePositions) {
                if (postChange && postChange.idPosition !== undefined) {
                    const positionToUpdate = statePositions[postChange.idPosition];

                    if (positionToUpdate) {
                        let updatedPosition = { ...positionToUpdate };

                        const slicedIsWorkingTimeField = fieldChange.slice(0, 11);
                        const fieldWorkingTime = fieldChange.slice(12, fieldChange.length);
                        if (slicedIsWorkingTimeField === 'workingTime' && updatedPosition.workingTime) {
                            updatedPosition.workingTime = {
                                ...updatedPosition.workingTime,
                                [fieldWorkingTime]: valueChange
                            };
                        } else {
                            updatedPosition[fieldChange] = valueChange;
                        }

                        statePositions[postChange.idPosition] = updatedPosition;
                    }
                }
            }
        },
        setChangeDataPostArr(state, action: PayloadAction<ChangePostArrPayload>) {
            const resumesState = state.resumesState;


            const post = action.payload.post;
            const mainIdPost = action.payload.mainIdPost;
            if (resumesState.positions) {
                resumesState.positions[mainIdPost].post = post;
            }
        },
        setLinkProfile(state, action: PayloadAction<ProjectsProfileLinks>) {
            const resumesState = state.resumesState;


            const stateProfileLinks = resumesState.projectsProfile;
            resumesState.projectsProfile = stateProfileLinks ?? [];
            resumesState.projectsProfile.push(action.payload);
        },
        setChangeLinkProfile(state, action: PayloadAction<{ nameLink: string, value: string }>) {
            const resumesState = state.resumesState;


            const field = action.payload.nameLink;
            const value = action.payload.value;

            const stateProfileLinks = resumesState.projectsProfile;
            if (stateProfileLinks) {
                const changedLink = stateProfileLinks?.map((item, index) => {
                    if (item.nameLink === field) {
                        return {
                            ...item,
                            url: value
                        }
                    }
                    return item;
                })
                resumesState.projectsProfile = changedLink;
            }
        },
        setChangeProjectData(state, action: PayloadAction<Projects>) {
            const resumesState = state.resumesState;


            const changedProject = action.payload;

            const stateProjects = resumesState.petProjects;
            const updatedProjects = stateProjects?.map((item) => {
                if (item.idProject === changedProject.idProject) {
                    if (item.description !== changedProject.description) {
                        return {
                            ...item,
                            description: changedProject.description
                        }
                    }
                    if (item.name !== changedProject.name) {
                        return {
                            ...item,
                            name: changedProject.name
                        }
                    }
                    if (item.url !== changedProject.url) {
                        return {
                            ...item,
                            url: changedProject.url
                        }
                    }
                    return item;
                }
                return item;
            });
            resumesState.petProjects = updatedProjects;
        },
        setPetProject(state, action: PayloadAction<ProjectsForm>) {
            const resumesState = state.resumesState;


            const statePetProjects = resumesState.petProjects;

            const addIdProject: Projects = {
                idProject: statePetProjects?.length || 0,
                name: action.payload.projects.name,
                description: action.payload.projects.description,
                url: action.payload.projects.url,
            };


            resumesState.petProjects = statePetProjects ?? [];

            resumesState.petProjects.push(addIdProject)
        },
        setSkills(state, action: PayloadAction<skills>) {
            const resumesState = state.resumesState;

            resumesState.skills = action.payload;
        },
        setValueModalCont(state, action: PayloadAction<{
            typeField: string,
            value: string
        }>) {
            const resumesState = state.resumesState;


            if (action.payload.typeField === 'status search') {
                resumesState.statusSearchResume = action.payload.value;
            }
            else {
                resumesState.levelIsResume = action.payload.value;
            }
        },
        setResumeCompleted(state) {
            const resumesState = state.resumesState;

            resumesState.isResumeCompleted = true;
        },
        setIdResumeDb(state, action: PayloadAction<string>) {
            const resumesState = state.resumesState;

            resumesState.idResumeDb = action.payload;
        },
        deleteResume(state) {
            state.resumesState = {};
        },
    },
});

export const {  setValueModalCont, setIdResumeDb, setResumeCompleted, setSkills, setChangeProjectData, setChangeLinkProfile, setFilterProjects, setPetProject, setLinkProfile, setChangeDataPostArr, setChangeFieldPost, setUpdIdsPositions, setFilterPositions, setAmountTimeWorked, setPosition, setChangeTypeWork, setNameResume, setBasicInfo, setEducationClass, setEducation, deleteResume } = resumesSlice.actions;
export default resumesSlice.reducer;