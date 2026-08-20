import React, { useEffect, useState } from "react";
import { useForm, UseFormSetValue } from "react-hook-form";
import { ProjectsProfileLinks, Projects } from "../../../../types/typesResume";
import Buttons from "./buttons";
import { useAppDispatch, useAppSelector } from "../../../../hookRedux";
import { setChangeLinkProfile, setChangeProjectData, setLinkProfile, setPetProject } from "../../../../store/resumesSlice";
import FpContPetProject from "./fpConts/fpContPetProject";
import { checkAllValidateHooks } from "../../../../globalFuncs";
import { setChangeScroll } from "../../../../store/isMainScrollSlice";

export interface ProjectsForm {
    gitLink: string,
    projects: Projects
}

const handleSetValuesInps = (
    setValue: UseFormSetValue<ProjectsForm>,
    typeSetValue: string,
    item?: Projects
) => {
    const arrNameInps: Array<"gitLink" | "projects" | "projects.idProject" | "projects.name" | "projects.description" | "projects.url"> = [
        'projects.name',
        'projects.description',
        'projects.url',
    ];
    if (typeSetValue === 'empty') {
        arrNameInps.forEach(element => {
            setValue(element, '')
        });
    }
    else if (typeSetValue === 'change' && item) {
        setValue('projects.name', item.name);  
        setValue('projects.url', item.url);        
        setValue('projects.description', item.description);        
    }
}


const ResumePetProjects: React.FC = () => {
    const { register, formState: { errors }, handleSubmit, setValue, watch } = useForm<ProjectsForm>({ mode: 'onChange' })
    const dispatch = useAppDispatch();
    //variables
   
    
    //states
    const { resumesState } = useAppSelector(state => state.resumes);
    const stateProject = resumesState.petProjects;
    const lengthProject = stateProject?.length;
    const findStateGitLink = resumesState?.projectsProfile?.find(item => item.nameLink === 'github')
    const stateGitLink = findStateGitLink?.url;
    //hooks
    const [changeProject, setChangeProject] = useState<boolean>(false);
    const [gitHubUrlAcc, setGitHubUrlAcc] = useState<string>(stateGitLink ? stateGitLink : '');
    const [isFpContPetProject, setIsFpContPetProject] = useState<boolean>(false)
    const [idChangeProject, setIdChangeProject] = useState<number>(0);
    


    const validateGitHubUrlAcc = (value: string) => {
        const regex = /^https:\/\/github\.com\//;
        setGitHubUrlAcc(value);
        return regex.test(value) || 'Incorrect url github profile';
    }

   
    useEffect(() => {
        if (stateGitLink) {
            setValue('gitLink', stateGitLink)
        }
        else {
            setValue('gitLink', '')
        }
    }, [stateGitLink])


    const validateGitHubUrlProject = (value: string) => {
        console.log(gitHubUrlAcc + '/', value)
        if (gitHubUrlAcc !== '') {
            console.log(value.startsWith(gitHubUrlAcc + '/') || 'Incorrect url project')
            return value.startsWith(gitHubUrlAcc + '/') || 'Incorrect url project';
        }
    }

   

    useEffect(() => {
        if (stateProject && stateProject.length < 1) {
            setIsFpContPetProject(false);
        }

        if(isFpContPetProject){
            dispatch(setChangeScroll(false));
        }
        else {
            dispatch(setChangeScroll(true));
        }
    }, [isFpContPetProject, stateProject])

    const stateProfileLinks = resumesState?.projectsProfile;


    const onSubmitForm = (data: ProjectsForm) => {
        const isStateFieldGitLink = stateProfileLinks?.find(item => item.nameLink === 'github')
        const isChangedGitProfile = stateProfileLinks?.find(item => item.url !== gitProfileInp);
        if (isChangedGitProfile && isStateFieldGitLink) {
            dispatch(setChangeLinkProfile({ nameLink: 'github', value: gitProfileInp }))
        }
        else if (!isChangedGitProfile && !isStateFieldGitLink) {
            const gitLinkProfile: ProjectsProfileLinks = {
                nameLink: 'github',
                url: data.gitLink
            }
            dispatch(setLinkProfile(gitLinkProfile))
            dispatch(setChangeLinkProfile({ nameLink: 'github', value: gitProfileInp }))
        }
        if (changeProject) {
            dispatch(setChangeProjectData(
                {
                    idProject: idChangeProject,
                    name: nameProjectInp,
                    url: linkProjectInp,
                    description: descriptionProjectInp
                }
            ))
        }
        else {
            dispatch(setPetProject(data))
        }
        handleSetValuesInps(setValue, 'empty')
    }

    const gitProfileInp = watch('gitLink');
    const nameProjectInp = watch('projects.name');
    const descriptionProjectInp = watch('projects.description')
    const linkProjectInp = watch('projects.url');

    const [isUniqueNameInp, setIsUniqueNameInp] = useState<string>('');
    const [isUniqueLinkInp, setIsUniqueLinkInp] = useState<string>('');


    useEffect(() => {
        if(!changeProject){
            if (nameProjectInp || linkProjectInp && !changeProject) {
                const checkUniqueNameInp = stateProject?.find(item => item.name === nameProjectInp);
                const checkUniqueLinkInp = stateProject?.find(item => item.url === linkProjectInp);
                if (checkUniqueNameInp) {
                    setIsUniqueNameInp(`You already have name project - '${checkUniqueNameInp.name}' `)
                }
                else {
                    setIsUniqueNameInp(``)
                }
    
    
                if (checkUniqueLinkInp) {
                    setIsUniqueLinkInp(`You already have link project - '${checkUniqueLinkInp.url}' `)
                }
                else {
                    setIsUniqueLinkInp(``)
                }
            }
        }
    }, [nameProjectInp, linkProjectInp])



    const checkAllErrors = checkAllValidateHooks([isUniqueLinkInp !== '' ? true : false, isUniqueNameInp !== '' ? true : false])

    const handleMainChangeProject = (item: Projects, idChangeProject: number) => {
        handleSetValuesInps(setValue, 'change', item)
        setIdChangeProject(idChangeProject);
        setIsFpContPetProject(false)
    }

    return (
        <>
            <form className="form-pet-project" onSubmit={handleSubmit(onSubmitForm)}>
                <div className="project-info git-link">
                    <span className="name-project-info">Git link</span>
                    <input
                        type='text'
                        placeholder=""
                        className={!errors?.gitLink ? "input-project_full-width" : "input-project_full-width_errors"}
                        {...register('gitLink', {
                            required: 'Set link pet project',
                            validate: validateGitHubUrlAcc
                        })}
                    />
                    {errors?.gitLink && <p className="erorrs-input-project">{errors.gitLink.message}</p>}
                </div>
                <div className="inputs-add-pet-projects">
                    <div className="project-info name-project">
                        <span className="name-project-info">Name</span>
                        <input
                            type="text"
                            className={!errors?.projects?.name ? "input-project_full-width" : "input-project_full-width_errors"}
                            {...register('projects.name', {
                                required: 'Set name pet project',
                            })}
                        />
                        {errors?.projects?.name && <p className="erorrs-input-project">{errors.projects.name.message}</p>}
                        {nameProjectInp !== '' && <p className="erorrs-input-project">{isUniqueNameInp}</p>}
                    </div>
                    <div className="project-info link-project">
                        <span className="name-project-info">Link</span>
                        <input
                            type="text"
                            className={!errors?.projects?.url ? "input-project_full-width" : "input-project_full-width_errors"}
                            {...register('projects.url', {
                                required: 'Set link pet project',
                                validate: validateGitHubUrlProject
                            })}
                        />
                        {errors?.projects?.url && <p className="erorrs-input-project">{errors.projects.url.message}</p>}
                        {linkProjectInp !== '' && <p className="erorrs-input-project">{isUniqueLinkInp}</p>}
                    </div>
                    <div className="project-info description-pet-project">
                        <span className="name-project-info">Description</span>
                        <textarea
                            placeholder="Describe the main idea of ​​your pet project and its functionality"
                            className={!errors?.projects?.description ? "text-project_description-post" : "text-project_description-post_error"}
                            {...register('projects.description', {
                                required: 'Set description pet project'
                            })}
                        />
                        {errors?.projects?.description && <p className="erorrs-text-area-project">{errors.projects.description.message}</p>}
                    </div>
                </div>
                <div className={errors?.projects?.description ? "btns-pet-projects-adaptiv-error-text-area" : "btns-pet-projects"}>
                    <Buttons
                        type={checkAllErrors}
                        className="btn-pet-projects add-button"
                    >
                        {!changeProject ? 'Add pet project +' : 'Change pet project'}
                    </Buttons>
                    {lengthProject && lengthProject >= 1 ?
                        <Buttons
                            className="btn-pet-projects show-list-button"
                            type='button'
                            onClick={() => setIsFpContPetProject(true)}
                        >
                            Show list pet projects
                        </Buttons>
                        : null}
                </div>
                {isFpContPetProject && <FpContPetProject setIsFpContPetProject={setIsFpContPetProject} setChangeProject={setChangeProject} handleMainChangeProject={handleMainChangeProject} />}
            </form>
        </>
    );
}

export default ResumePetProjects;