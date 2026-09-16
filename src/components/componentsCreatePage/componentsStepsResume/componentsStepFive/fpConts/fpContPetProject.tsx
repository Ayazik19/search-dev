import React, { useState } from 'react'
import iconCloseFpCont from '../../../../../../dist/icons/iconCloseFpCont.png';
import { useAppSelector } from '../../../../../hookRedux';
import iconChangeProject from '../../../../../../dist/icons/iconChangeProject.png';
import iconDeleteProject from '../../../../../../dist/icons/iconDeleteProject.png';
import { useDispatch } from 'react-redux';
import { setFilterProjects } from '../../../../../store/resumesSlice';
import { Projects } from '../../../../../types/typesResume';

interface Props {
    setIsFpContPetProject: (value: boolean) => void;
    setChangeProject: (value: boolean) => void;
    handleMainChangeProject: (item: Projects, idChangeProject: number) => void;
}

const FpContPetProject: React.FC<Props> = ({ setIsFpContPetProject, setChangeProject, handleMainChangeProject }) => {
    const { resumesState } = useAppSelector(state => state.resumes);
    const dispatch = useDispatch()
    //variables
    const stateProjects = resumesState.petProjects;

    //hooks
    const [isHover, setIsHover] = useState<number | boolean>(false);

    const listPetProject = stateProjects && stateProjects.map((item, index) => {
        const handleChangeProject = (item: Projects) => {
            setChangeProject(true);
            handleMainChangeProject(item, item.idProject);
        }
        return (
            <div
                className={`item-pet-project project-${index}`}
                key={index}
                onMouseEnter={() => setIsHover(index)}
                onMouseLeave={() => setIsHover(false)}
            >
                <div className='main-item-project'>
                    <div className='name-pet-project'>
                        <span className='text-info-project'>
                            {item.name}
                        </span>
                    </div>
                    <div className='link-pet-project'>
                        <span className='text-info-project'>
                            {item.url}
                        </span>
                    </div>
                    <div className='description-pet-project'>
                        <span className='text-info-project'>
                            {item.description}
                        </span>
                    </div>
                </div>
                {isHover === index && 
                <div className='menu-change-pet-project'>
                    <div 
                        className='butt-pet-project change-project'
                        onClick={() => handleChangeProject(item)}
                    >
                        <img className='icon-menu-project' src={iconChangeProject} />
                    </div>
                    <div 
                        className='butt-pet-project delete-project'
                        onClick={() => dispatch(setFilterProjects(index))} 
                    >
                        <img className='icon-menu-project' src={iconDeleteProject}/>
                    </div>
                </div>}
            </div>
        )
    })
    return (
        <div className="fp-cont-list-added-pet-projects">
            <div className="fp-cont-project">
                <div className='main-cont-project'>
                    <header className='header-work-project'>
                        <span className='main-text_project-resume'>
                            Pet projects
                        </span>
                    </header>
                    {listPetProject}
                </div>
            </div>
            <img
                src={iconCloseFpCont}
                className="fp-close-cont-location"
                onClick={() => setIsFpContPetProject(false)}
            />
        </div>
    )
}

export default FpContPetProject;