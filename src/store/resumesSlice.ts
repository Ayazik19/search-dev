import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResumeState, Resume, BasicInfo, Education, Positions, Date, Post, ProfileLinks, Projects, skills, statusSearchResume, levelIsResume } from "../types/typesResume";
import { FormValues } from "../components/componentsCreatePage/componentsStepsResume/stepResumeFour";
import { differenceInMonths, differenceInYears, format, parseISO } from "date-fns";
import { ProjectsForm } from "../components/componentsCreatePage/componentsStepsResume/componentsStepFive/resumePetProjects";


const initialState: ResumeState = {
    resumesState: []
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

const calculateCountResumes = (resumesState: ResumeState[]): number => {
    return resumesState.length - 1;
}

const resumesSlice = createSlice({
    name: "resume",
    initialState,
    reducers: {
        setNameResume(state, action: PayloadAction<string>) {
            if (state.resumesState.length > 0) {
                state.resumesState[0].nameResume = action.payload;
            }
            else {
                const { resumesState } = state;
                const lengthArr = resumesState?.length || 0;

                const validResumesState = Array.isArray(resumesState) ? resumesState : [];

                const newResume = {
                    idResume: lengthArr + 1,
                    nameResume: action.payload,
                    isResumeCompleted: false,
                };
                state.resumesState = [...validResumesState, newResume];
            }
        },
        setBasicInfo(state, action: PayloadAction<BasicInfo>) {
            state.resumesState.forEach((item: Resume) => {
                item.basicInfo = {
                    ...item.basicInfo,
                    ...action.payload,
                };
            })
        },
        setEducationClass(state, action: PayloadAction<string>) {
            state.resumesState.forEach((item: Resume) => {

                const education: Education = {
                    educationClass: action.payload
                }

                item.education = education;
            })
        },
        setEducation(state, action: PayloadAction<FormValues>) {
            const payloadObject = action.payload;
            const resumesState = state.resumesState;

            const lastResume = resumesState[resumesState.length - 1];

            if (lastResume && lastResume.education) {
                lastResume.education.nameInstituation = payloadObject.nameInstituation;
                lastResume.education.faculty = payloadObject.faculty;
            }
        },
        setChang(state) {
            const resumesState = state.resumesState;

            state.resumesState[resumesState.length - 1].statusSearchResume = '';
        },
        setChangeTypeWork(state, action: PayloadAction<string>) {
            const resumesState = state.resumesState;

            const lastResume = resumesState[resumesState.length - 1];
            if (lastResume) {
                lastResume.typeWorkResume = action.payload;
            }
        },
        setAmountTimeWorked(state) {
            const resumesState = state.resumesState;

            const lastResume = resumesState[resumesState.length - 1];
            if (lastResume.positions) {
                const length = lastResume.positions.length;
                const positions = lastResume.positions;
                if (length > 1) {
                    const getEarlySinceDate = getEarlyOrLateDate(positions, 'early');
                    const getLateToDate = getEarlyOrLateDate(positions, 'toDate');

                    const amountCountTimeWorked = formattedWorkingTimeDate(getEarlySinceDate, getLateToDate)

                    state.resumesState[0].amountTimeWorked = amountCountTimeWorked.calculateCountTime;
                }
                else if (length === 1) {
                    const stateFirstObjPos = lastResume.positions[0].workingTime?.countTime;
                    lastResume.amountTimeWorked = stateFirstObjPos;
                }
                else {
                    lastResume.amountTimeWorked = {
                        year: 0,
                        month: 0
                    };
                }
            }
        },
        setPosition(state, action: PayloadAction<Positions>) {
            const resumesState = state.resumesState;

            const lastResume = resumesState[resumesState.length - 1];

            const positions = lastResume.positions ?? [];
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

            if (lastResume.positions) {
                lastResume.positions?.push(finallyPost);
            }
            else {
                lastResume.positions = [finallyPost];
            }
        },
        setUpdIdsPositions(state) {
            const resumesState = state.resumesState;

            const lastResume = resumesState[resumesState.length - 1];

            const statePositions = lastResume.positions;
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
                lastResume.positions = updIdsPos;
            }

        },
        setFilterPositions(state, action: PayloadAction<number>) {
            const resumesState = state.resumesState;

            state.resumesState[resumesState.length - 1].positions = state.resumesState[resumesState.length - 1].positions?.filter(item => item.idPosition !== action.payload);
        },
        setFilterProjects(state, action: PayloadAction<number>) {
            const resumesState = state.resumesState;

            state.resumesState[resumesState.length - 1].petProjects = state.resumesState[resumesState.length - 1].petProjects?.filter(item => item.idProject !== action.payload)
        },
        setChangeFieldPost(state, action: PayloadAction<ChangeFieldPayload>) {
            const resumesState = state.resumesState;

            const lastResume = resumesState[resumesState.length - 1];

            const postChange = action.payload.post;
            const fieldChange = action.payload.field;
            const valueChange = action.payload.value;

            const statePositions = lastResume.positions;
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

            const lastResume = resumesState[resumesState.length - 1];

            const post = action.payload.post;
            const mainIdPost = action.payload.mainIdPost;
            if (lastResume.positions) {
                lastResume.positions[mainIdPost].post = post;
            }
        },
        setLinkProfile(state, action: PayloadAction<ProfileLinks>) {
            const resumesState = state.resumesState;

            const lastResume = resumesState[resumesState.length - 1];

            const stateProfileLinks = lastResume.profileLinks;
            lastResume.profileLinks = stateProfileLinks ?? [];
            lastResume.profileLinks.push(action.payload);
        },
        setChangeLinkProfile(state, action: PayloadAction<{ nameLink: string, value: string }>) {
            const resumesState = state.resumesState;

            const lastResume = resumesState[resumesState.length - 1];

            const field = action.payload.nameLink;
            const value = action.payload.value;

            const stateProfileLinks = lastResume.profileLinks;
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
                lastResume.profileLinks = changedLink;
            }
        },
        setChangeProjectData(state, action: PayloadAction<Projects>) {
            const resumesState = state.resumesState;

            const lastResume = resumesState[resumesState.length - 1];

            const changedProject = action.payload;

            const stateProjects = lastResume.petProjects;
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
            lastResume.petProjects = updatedProjects;
        },
        setPetProject(state, action: PayloadAction<ProjectsForm>) {
            const resumesState = state.resumesState;

            const lastResume = resumesState[resumesState.length - 1];

            const statePetProjects = state.resumesState[0].petProjects;

            const addIdProject: Projects = {
                idProject: statePetProjects?.length || 0,
                name: action.payload.projects.name,
                description: action.payload.projects.description,
                url: action.payload.projects.url,
            };


            lastResume.petProjects = statePetProjects ?? [];

            lastResume.petProjects.push(addIdProject)
        },
        setSkills(state, action: PayloadAction<skills>) {
            const resumesState = state.resumesState;

            state.resumesState[resumesState.length - 1].skills = action.payload;
        },
        setValueModalCont(state, action: PayloadAction<{
            typeField: string,
            value: string
        }>) {
            const resumesState = state.resumesState;

            const lastResume = resumesState[resumesState.length - 1];

            if (action.payload.typeField === 'status search') {
                lastResume.statusSearchResume = action.payload.value;
            }
            else {
                lastResume.levelIsResume = action.payload.value;
            }
        },
        deleteResume(state) {
            state.resumesState = [];
        },
    },
});

export const { setValueModalCont, setSkills, setChang, setChangeProjectData, setChangeLinkProfile, setFilterProjects, setPetProject, setLinkProfile, setChangeDataPostArr, setChangeFieldPost, setUpdIdsPositions, setFilterPositions, setAmountTimeWorked, setPosition, setChangeTypeWork, setNameResume, setBasicInfo, setEducationClass, setEducation, deleteResume } = resumesSlice.actions;
export default resumesSlice.reducer;