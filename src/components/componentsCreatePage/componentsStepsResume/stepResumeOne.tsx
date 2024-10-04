import React, { useEffect, useState, useCallback } from "react";
import './stepResume.css';
import { arrBackTagsSearch, arrMobileTagsSearch } from "../../../dataArrays/listsStackDevops";
import { arrFrontTagsSearch } from "../../../dataArrays/listsStackDevops";
import { arrFullTagsSearch } from "../../../dataArrays/listsStackDevops";
import { arrayStacks } from "../../../dataArrays/listsStackDevops";
import { useAppSelector } from "../../../hookRedux";

interface StepResumeOneProps {
    onStepOneData: (data: string) => void;
    stepOneData: string;
}

const StepResumeOne: React.FC<StepResumeOneProps> = (props) => {
    const [checkedStacks, setCheckedStacks] = useState<{ [key: string]: boolean }>({});

    const [isActive, setIsActive] = useState<boolean>(false);

    const [searchInpValue, setSearchInpValue] = useState<string>('');

    const {resumesState} = useAppSelector(state => state.resumes);
    const nameResume = resumesState[0]?.nameResume;

    const [selectedStack, setSelectedStack] = useState<string>('');

    const isCheckedStacksEmpty = Object.keys(checkedStacks).length === 0;



    const stackDevops = arrayStacks.map((el, index) => {
        const handleSetStack = (el: string) => {
            setSearchInpValue(el);

            setCheckedStacks(prevState => {
                // Создаем новый объект состояния с типом
                const newState: { [key: string]: boolean } = {};

                // Устанавливаем состояние только для текущего чекбокса
                newState[el] = !prevState[el];


                // Возвращаем новый объект состояния, сбрасывая все остальные чекбоксы
                return newState;
            });
            props.onStepOneData(el);
        };

        useEffect(() => {
            if (selectedStack !== '' && selectedStack === el) {
                handleSetStack(selectedStack);
            }
            if (props.stepOneData !== '') {
                handleSetStack(props.stepOneData);
            }
        }, [selectedStack, props.stepOneData]);


        return (
            <div
                className={checkedStacks[el] ? "input-stack_checked" : "item-stack"}
                key={index}
                onClick={() => handleSetStack(el)}
            >
                <input
                    type="checkbox"
                    id={`checkbox-${index}`}
                    checked={checkedStacks[el] || false} // Проверяем состояние чекбокса из объекта
                    onChange={() => handleSetStack(el)}
                    className="input-stack"
                />
                <label htmlFor={`checkbox-${index}`} className="custom-label">
                    <span className="name-item-stack">{el}</span>
                </label>
            </div>
        )
    })

    const [displaySearchItems, setDisplaySearchItems] = useState<string[]>([]);


    const handleSetInpValSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchInpValue(value)
        if (value === '') {
            setDisplaySearchItems([]);
            setCheckedStacks({});
            return;
        }

        const newDisplaySearchItems: string[] = [];

        arrBackTagsSearch.map(el => {
            if (el === value) {
                newDisplaySearchItems.push('Backend Development')
                return true;
            }
        })
        arrFrontTagsSearch.map(el => {
            if (el === value) {
                newDisplaySearchItems.push('Web Frontend Development')
                return true;
            }
        })
        arrFullTagsSearch.map(el => {
            if (el === value) {
                newDisplaySearchItems.push('Full-stack Development')
                return true;
            }
        })
        arrMobileTagsSearch.map(el => {
            if (el === value) {
                newDisplaySearchItems.push('Mobile Development')
                return true;
            }
        })
        setDisplaySearchItems(newDisplaySearchItems);
    }


    const searchItems = displaySearchItems.map((el, index) => {

        return (
            <div
                className='attr-name-search-item'
                onClick={() => setSelectedStack(el)}
                key={index}
            >
                <span className="name-search-item">
                    {el}
                </span>
            </div>

        )
    })


    return (
        <div className="step-resume-creation">
            <div className="resume-creation">
                <span className="main-text-step">
                    Select or specify the development stack
                </span>
                <span className="description-text-step">
                    {nameResume === undefined ? `For example: "Web Frontend developer"` : `Resume ${nameResume}`}
                </span>
                <input
                    type='text'
                    value={searchInpValue}
                    onChange={handleSetInpValSearch}
                    className={!isActive ? 'input-search-stack-items' : 'input-search-stack-items_active'}
                    placeholder="Search"
                    onFocus={() => setIsActive(true)}
                    onBlur={() => setIsActive(false)}
                />
                {displaySearchItems.length !== 0 && isCheckedStacksEmpty ?
                    <div
                        style={{
                            position: 'absolute',
                            marginTop: displaySearchItems.length === 1 ? '-70px' :
                                displaySearchItems.length === 2 ? '-20px' :
                                    displaySearchItems.length === 3 ? '30px' :
                                        'auto',
                            width: '637.5px',
                            zIndex: 1,
                            height: displaySearchItems.length === 1 ? '51px' :
                                displaySearchItems.length === 2 ? '102.5px' :
                                    displaySearchItems.length === 3 ? '153px' :
                                        'auto',
                            backgroundColor: 'white',
                            borderRadius: '10px',
                            transition: 'background-color 0.2s, border-color 0.2s'
                        }}
                    >
                        <div className="stack-items">
                            {searchItems}
                        </div>
                    </div> : null}
                {stackDevops}

            </div>
        </div>
    )
}

export default StepResumeOne;