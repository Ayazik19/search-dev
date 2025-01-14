import React, { useEffect, useState } from "react";
import './stepResume.css';
import { arrayStacks } from "../../../dataArrays/listsStackDevops";
import { useAppSelector } from "../../../hookRedux";

interface StepResumeOneProps {
    onStepOneData: (value: string) => void;
    handleStepOne: (data: string) => void;
    stepOneData: string;
}

const StepResume1: React.FC<StepResumeOneProps> = ({ handleStepOne, stepOneData }) => {
    const [checkedStacks, setCheckedStacks] = useState<{ [key: string]: boolean }>({});

    const { resumesState } = useAppSelector(state => state.resumes);
    const nameResume = resumesState.nameResume;
    const [searchInpValue, setSearchInpValue] = useState<string>(nameResume ? nameResume : '');
    
    const [selectedStack, setSelectedStack] = useState<string>('');
    const [isActiveInpSearch, setIsActiveInpSearch] = useState<boolean>(false);

    useEffect(() => {
        if (nameResume) {
            setCheckedStacks({ [nameResume]: true });
        }
    }, [])

    const stackDevops = arrayStacks.map((el, index) => {

        const handleSetStack = (el: string) => {
            setSearchInpValue(el);

            setCheckedStacks(prevState => {
                const newState: { [key: string]: boolean } = {};

                newState[el] = !prevState[el];

                return newState;
            });


            return handleStepOne(el);
        };

        useEffect(() => {
            if (selectedStack !== '' && selectedStack === el) {
                handleSetStack(selectedStack);
            }
            if (stepOneData !== '') {
                handleSetStack(stepOneData);
            }
        }, [selectedStack, stepOneData]);



        return (
            <div
                className={checkedStacks[el] ? "input-stack_checked" : "input-stack_not-checked"}
                key={index}
                onClick={() => handleSetStack(el)}
                style={{
                    marginBottom: index + 1 === arrayStacks.length ? '150px' : '0px'
                }}
            >
                <input
                    type="checkbox"
                    id={`checkbox-${index}`}
                    checked={checkedStacks[el] || false}
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
            return;
        }

        const newDisplaySearchItems: string[] = [];

        arrayStacks.map(el => {
            if (el.toLowerCase().includes(value.toLowerCase())) {
                newDisplaySearchItems.push(el)
            }
        })
        
        setIsActiveInpSearch(true);
        setDisplaySearchItems(newDisplaySearchItems);
    }


    const searchItems = displaySearchItems.map((el, index) => {
        let styleBorderRadius: string = 'default-index-search-stack'

        if(displaySearchItems.length > 1){
            if(index === 0){
                styleBorderRadius = 'first-index-search-stack';
            }
            else if(index + 1 === displaySearchItems.length){
                styleBorderRadius = 'last-index-search-stack';
            }
        }
        else{
            styleBorderRadius = 'one-index-search-stack';
        }

        const handleSetStack = () => {
            setIsActiveInpSearch(true);
            setSelectedStack(el);
        }

        return (
            <div
                className={`attr-name-search-item ${styleBorderRadius}`}
                onClick={handleSetStack}
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
                    className='input-search-stack-items'
                    placeholder="Search"
                />
                {displaySearchItems.length !== 0 &&
                    <div 
                        className="stack-items-info"
                        style={{
                            height: `${(45 * displaySearchItems.length)}px`,
                            marginTop: `-${598 - (displaySearchItems.length * 45)}px`
                        }}
                    >
                        {searchItems}
                    </div>
                }
                {stackDevops}
            </div>
        </div>
    )
}

export default StepResume1;