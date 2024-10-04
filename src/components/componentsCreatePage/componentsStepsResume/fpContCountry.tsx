import React, { useState, useEffect } from 'react';
import { arrCountries } from '../../../dataArrays/listCountry';
import iconCloseFpCont from './iconCloseFpCont.png';

interface PropsStepResTwo {
    isFullPageCitizenship: boolean;
    isFullPageWorkPermit: boolean;
    arrSelectedCitizenship: string[];
    arrSelectedWorkPermit: string[];
    setArrSelectedCitizenship: (value: string[]) => void;
    setArrSelectedWorkPermit: (value: string[]) => void;
    setIsFullPageCitizenship: (value: boolean) => void;
    setIsFullPageWorkPermit: (value: boolean) => void;
    handleSelectedCountry: (data: string[], type: string) => void;
}

const FpContCountry: React.FC<PropsStepResTwo> = (props) => {
    const [valueSearchCountry, setValueSearchCountry] = useState<string>('');
    const [stateArrCitiz, setStateArrCitiz] = useState<string[]>(arrCountries);
    const [stateArrWoPer, setStateArrWoPer] = useState<string[]>(arrCountries);
    const [isCheckedCitiz, setIsCheckedCitiz] = useState<boolean[]>([]);
    const [isCheckedWoPer, setIsCheckedWoPer] = useState<boolean[]>([]); 


    const handleSetInputCountrySearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setValueSearchCountry(value);

        if (value === '') {
            setStateArrCitiz(arrCountries);
            setStateArrWoPer(arrCountries);
        }
        else {
            const newSearchedArrCountr: string[] = [];
            const newSearchedArrWoPer: string[] = [];

            arrCountries.map((el) => {
                if (value === el) {
                    newSearchedArrCountr.push(el);
                    newSearchedArrWoPer.push(el);
                }
            });

            setStateArrCitiz(newSearchedArrCountr);
            setStateArrWoPer(newSearchedArrWoPer);
        }
    };

    const handleSetValueCont = () => {
        if (arrSelectedCitiz.length > 0 || arrSelectedWoPer.length > 0) {
            if (props.isFullPageCitizenship) {
                let updArrSelectedCitiz: string[] = [];
                if (arrSelectedCitiz.length === 4) {
                    const updatedArr: string[] = arrSelectedCitiz.slice(0, -1);
                    updArrSelectedCitiz = arrSelectedCitiz.concat(updatedArr);
                } else {
                    updArrSelectedCitiz = arrSelectedCitiz;
                }
                props.handleSelectedCountry(updArrSelectedCitiz, 'citizenship');
                props.setIsFullPageCitizenship(false);
            } else {
                let updArrSelectedWoPer: string[] = [];
                if (arrSelectedWoPer.length === 4) {
                    const updatedArr: string[] = arrSelectedWoPer.slice(0, -1);
                    updArrSelectedWoPer = arrSelectedWoPer.concat(updatedArr);
                } else {
                    updArrSelectedWoPer = arrSelectedWoPer;
                }
                props.handleSelectedCountry(updArrSelectedWoPer, 'Work Permit');
                props.setIsFullPageWorkPermit(false);
            }
        }
        else{
            props.setIsFullPageWorkPermit(false);
            props.setIsFullPageCitizenship(false);
        }
    };
 

    useEffect(() => {
        setIsCheckedCitiz(stateArrCitiz && stateArrCitiz.map((el) =>
            props.arrSelectedCitizenship && props.arrSelectedCitizenship.some((country) => country === el)
        ));
        setIsCheckedWoPer(stateArrWoPer && stateArrWoPer.map((el) =>
            props.arrSelectedWorkPermit && props.arrSelectedWorkPermit.some((country) => country === el)
        ));
    }, [stateArrCitiz, stateArrWoPer, props.arrSelectedCitizenship, props.arrSelectedWorkPermit]);

    useEffect(() => {
        const newCountriesCitiz = [...arrSelectedCitiz];
        const newCountriesWoPer = [...arrSelectedWoPer];

        if (props.isFullPageCitizenship && props.arrSelectedCitizenship && props.arrSelectedCitizenship.length > 0) {
            newCountriesCitiz.push(...props.arrSelectedCitizenship);
            setArrSelectedCitiz(newCountriesCitiz);
        }
        if (props.isFullPageWorkPermit && props.arrSelectedWorkPermit && props.arrSelectedWorkPermit.length > 0) {
            newCountriesWoPer.push(...props.arrSelectedWorkPermit);
            setArrSelectedWoPer(newCountriesWoPer);
        }
    }, [props.arrSelectedCitizenship, props.arrSelectedWorkPermit]);

    const [arrSelectedCitiz, setArrSelectedCitiz] = useState<string[]>([]);
    const [arrSelectedWoPer, setArrSelectedWoPer] = useState<string[]>([]);

    const listCountriesCitiz = stateArrCitiz.map((el, index) => {
        let isLimitLength = arrSelectedCitiz.length <= 3;

        return (
            <div key={el} className="el-country">
                <input
                    type="checkbox"
                    className={!isLimitLength ? 'checkbox-country_limit' : 'checkbox-country'}
                    checked={isCheckedCitiz[index]}
                    onChange={() => {
                        if (isCheckedCitiz[index]) {
                            setArrSelectedCitiz(arrSelectedCitiz.filter((country) => country !== el));
                            setIsCheckedCitiz([...isCheckedCitiz.slice(0, index), false, ...isCheckedCitiz.slice(index + 1)]); // Обновляем isCheckedCitiz
                        } else if (!isCheckedCitiz[index] && isLimitLength) {
                            setArrSelectedCitiz([...arrSelectedCitiz, el]);
                            setIsCheckedCitiz([...isCheckedCitiz.slice(0, index), true, ...isCheckedCitiz.slice(index + 1)]); // Обновляем isCheckedCitiz
                        }
                    }}
                />
                <span
                    className={!isLimitLength && !isCheckedCitiz[index] ? 'name-country_limit' : 'name-country'}
                    onClick={() => {
                        if (isCheckedCitiz[index]) {
                            setArrSelectedCitiz(arrSelectedCitiz.filter((country) => country !== el));
                            setIsCheckedCitiz([...isCheckedCitiz.slice(0, index), false, ...isCheckedCitiz.slice(index + 1)]); // Обновляем isCheckedCitiz
                        } else if (!isCheckedCitiz[index] && isLimitLength) {
                            setArrSelectedCitiz([...arrSelectedCitiz, el]);
                            setIsCheckedCitiz([...isCheckedCitiz.slice(0, index), true, ...isCheckedCitiz.slice(index + 1)]); // Обновляем isCheckedCitiz
                        }
                    }}
                >
                    {el}
                </span>
            </div>
        );
    });

    const listCountriesWoPer = stateArrWoPer.map((el, index) => {
        let isLimitLength = arrSelectedWoPer.length <= 3;

        return (
            <div key={el} className="el-country">
                <input
                    type="checkbox"
                    className={!isLimitLength ? 'checkbox-country_limit' : 'checkbox-country'}
                    checked={isCheckedWoPer[index]}
                    onChange={() => {
                        if (isCheckedWoPer[index]) {
                            setArrSelectedWoPer(arrSelectedWoPer.filter((country) => country !== el));
                            setIsCheckedWoPer([...isCheckedWoPer.slice(0, index), false, ...isCheckedWoPer.slice(index + 1)]); // Обновляем isCheckedCitiz
                        } else if (!isCheckedWoPer[index] && isLimitLength) {
                            setArrSelectedWoPer([...arrSelectedWoPer, el]);
                            setIsCheckedWoPer([...isCheckedWoPer.slice(0, index), true, ...isCheckedWoPer.slice(index + 1)]); // Обновляем isCheckedCitiz
                        }
                    }}
                />
                <span
                    className={!isLimitLength && !isCheckedWoPer[index] ? 'name-country_limit' : 'name-country'}
                    onClick={() => {
                        if (isCheckedWoPer[index]) {
                            setArrSelectedWoPer(arrSelectedWoPer.filter((country) => country !== el));
                            setIsCheckedWoPer([...isCheckedWoPer.slice(0, index), false, ...isCheckedWoPer.slice(index + 1)]); // Обновляем isCheckedCitiz
                        } else if (!isCheckedWoPer[index] && isLimitLength) {
                            setArrSelectedWoPer([...arrSelectedWoPer, el]);
                            setIsCheckedWoPer([...isCheckedWoPer.slice(0, index), true, ...isCheckedWoPer.slice(index + 1)]); // Обновляем isCheckedCitiz
                        }
                    }}
                >
                    {el}
                </span>
            </div>
        );
    });

    return (
        <div className="fp-cont-select-location">
            <div className="fp-cont-location">
                <div className="main-fp-cont-location">
                    <header className="header-fp-location">
                        <span className="main-text-fp-location">
                            {props.isFullPageCitizenship ? 'Citizenship' : 'Work permit'}
                        </span>
                        <input
                            className="input-fast-search-location"
                            type="text"
                            placeholder="Fast search"
                            value={valueSearchCountry}
                            onChange={handleSetInputCountrySearch}
                        />
                    </header>
                    <main className="main-fp-location">
                        {props.isFullPageCitizenship ? listCountriesCitiz : listCountriesWoPer}
                    </main>
                    <footer className="footer-fp-location">
                        <button
                            className="b-location type-cancelled"
                            onClick={() => {
                                props.isFullPageCitizenship ? props.setIsFullPageCitizenship(false) : props.setIsFullPageWorkPermit(false);
                            }}
                        >
                            Cancel
                        </button>
                        <button className="b-location type-select" onClick={handleSetValueCont}>
                            Select
                        </button>
                    </footer>
                </div>
            </div>
            <img
                src={iconCloseFpCont}
                className="fp-close-cont-location"
                onClick={() => {
                    props.isFullPageCitizenship ? props.setIsFullPageCitizenship(false) : props.setIsFullPageWorkPermit(false);
                }}
            />
        </div>
    );
};

export default FpContCountry;