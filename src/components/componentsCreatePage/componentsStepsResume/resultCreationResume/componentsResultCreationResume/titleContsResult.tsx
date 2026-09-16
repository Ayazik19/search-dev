import React from 'react';

interface Props {
    textTitle: string | string[]; // Пропсы могут быть строками или массивом строк
    setIsVisibleTitleCont: (value: boolean) => void;
}

const TitleContsResult: React.FC<Props> = ({ setIsVisibleTitleCont, textTitle }) => {
    let lastLetter = '';

    const handleHideCont = () => {
        setIsVisibleTitleCont(false);
    }

    const displayTitleCont = (title: string) => {
        return title.split('').map((letter, index) => {
            const isLastLetterI = letter === 'i';
            const isLastElSpace = lastLetter === ' ';
            lastLetter = letter;
            return (
                <React.Fragment key={index}>
                    {isLastLetterI && isLastElSpace && <br />}
                    <span
                        style={{ display: "inline-block", color: 'white', marginTop: isLastLetterI && isLastElSpace ? '10px' : '0px' }}
                    >
                        {letter === " " ? "\u00A0" : letter}
                    </span>
                </React.Fragment>
            );
        });
    }

    return (
        <div className="title-last-cont" onClick={handleHideCont}>
            <div className="text-content">
                {typeof textTitle === 'string' ? displayTitleCont(textTitle) : null}
            </div>
        </div>
    );
}

export default TitleContsResult;
