import React from "react";
import './home.css';

const BtnGoToFullSearchResume: React.FC = () => {
    {/* тут сделать с кнопкой, если поль зареган, то обширный поиск
    с переадресацией на др стр, в противном случае, адресация на регистр */}
    return(
        <button className="btn-full-search-resume">Extensive resume search</button>
    );
}
export default BtnGoToFullSearchResume;