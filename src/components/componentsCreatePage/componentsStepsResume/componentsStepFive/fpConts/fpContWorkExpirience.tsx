import React, { useEffect, useState } from 'react';
import iconCloseFpCont from '../../../../../../dist/icons/iconCloseFpCont.png';
import { useAppDispatch, useAppSelector } from '../../../../../hookRedux';
import { Positions } from '../../../../../types/typesResume';
import { formattedWorkingTimeDate, setFilterPositions } from '../../../../../store/resumesSlice';
import iconChangeDataPos from '../../../../../../dist/icons/iconChangeData.png';
import iconDeletePos from '../../../../../../dist/icons/iconDeleteData.png';
import useSetUpdAmountTimeWorkedPoss from '../../../../../globalFuncs';


interface PropsMainComp {
    setIsFpContListWorks: (value: boolean) => void;
    setChangePos: (value: boolean) => void;
    setItemChangeDataPos: (value: Positions) => void;
}

const FpContWorkExpirience: React.FC<PropsMainComp> = ({ setIsFpContListWorks, setChangePos, setItemChangeDataPos }) => {
    const { resumesState } = useAppSelector(state => state.resumes);
    
    const {setUpdAmountTimeWorkedPoss} = useSetUpdAmountTimeWorkedPoss();

    const dispatch = useAppDispatch();

    const positionsArr = resumesState.positions;

    let yearAmountWorked;
    let monthAmountWorked;
    if (typeof resumesState.amountTimeWorked === "object" && resumesState.amountTimeWorked !== null) {
        yearAmountWorked = resumesState.amountTimeWorked.year;
        monthAmountWorked = resumesState.amountTimeWorked.month;
    }
    
    const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);

    useEffect(() => {
        if(resumesState.positions?.length === 0){
            setIsFpContListWorks(false)
        }
    },[resumesState.positions])

    const listWorkResume = positionsArr && positionsArr.map((item, index) => {
        const arrPost = item.post;
        const positionsResume = arrPost && arrPost.map((item, index) => {
            return(
                <div className='positions-info'> 
                    <span className='text-name-post main-text'>{item.postName}</span>
                    <span className='description-post'>{item.descriptionPost}</span>
                </div>
            );
        })


        const yearCompanyWorked = item.workingTime?.countTime?.year;
        const monthCompanyWorked = item.workingTime?.countTime?.month;

        const formattedSinceDate = formattedWorkingTimeDate(item.workingTime?.sinceDate || '', item.workingTime?.toDate || '')

        const handleDeletePos = () => {
            dispatch(setFilterPositions(index))
            setUpdAmountTimeWorkedPoss();
        }

        const handleChangePos = (item: Positions) => {
            setChangePos(true);
            setItemChangeDataPos(item);
        }

        return (
            <div 
                className={`item-work-position pos-${index}`} 
                key={index} 
                onMouseLeave={() => setActiveMenuIndex(null)} 
                onMouseEnter={() => setActiveMenuIndex(index)}
            >
                <div className='date-worked-position'>
                    <span className='text_date-worked'>
                        {formattedSinceDate.formattedSinceDate} - 
                        <br />
                        {formattedSinceDate.formattedToDate}
                    </span>
                    <br />
                    <span className='text_amount-date-worked'>
                        {yearCompanyWorked ? <span>{yearCompanyWorked} {yearCompanyWorked > 1 ? 'years' : 'year'}</span> : null}
                        {monthCompanyWorked ? <span> {monthCompanyWorked} {monthCompanyWorked > 1 ? 'months' : 'month'}</span> : null}
                    </span>
                </div>
                <div className='info-position'>
                    <span className='text-name-company main-text'>{item.nameCompany}</span>
                    <span className='text-city-company'>{item.cityCompany}</span>

                    {positionsResume}
                </div>
                {activeMenuIndex === index && <div className='menu-item-work-positions'>
                    <div 
                        className='butt-work-positions change-data'
                        onClick = {() => handleChangePos(item)}
                    >
                        <img className='icon-menu-pos' src={iconChangeDataPos} />
                    </div>
                    <div 
                        className='butt-work-positions delete-pos' 
                        onClick={handleDeletePos}
                    >
                        <img className='icon-menu-pos' src={iconDeletePos}/>
                    </div>
                </div>}

            </div>
        );
    })


    return (
        <div className="fp-cont-list-added-works">
            <div className="fp-cont-works">
                <div className='main-cont-works'>
                    <header className='header-work-position'>
                        <span className='text_amount-worked-resume'>
                            Work expirience
                        </span>
                        {yearAmountWorked ? <span className='text_amount-worked-resume'> {yearAmountWorked} {yearAmountWorked > 1 ? 'years' : 'year'}</span> : null}
                        {monthAmountWorked ? <span className='text_amount-worked-resume'> {monthAmountWorked} {monthAmountWorked > 1 ? 'months' : 'month'}</span> : null}
                    </header>
                    {listWorkResume}
                </div>
            </div>
            <img
                src={iconCloseFpCont}
                className="fp-close-cont-location"
                onClick={() => setIsFpContListWorks(false)}
            />
        </div>
    );
}

export default FpContWorkExpirience;