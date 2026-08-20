import React, { useEffect } from 'react';
import { HashRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './components/componentsHomePage/home';
import CreateResumePage from './components/componentsCreatePage/createResumePage';
import './App.css';

const App: React.FC = () => {
    return (
        <Router>
            <MainContent />
        </Router>
    );
};

const MainContent: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
        const backgroundColor = location.pathname === '/' ? '#1e1e1e' : 'white';
        document.body.style.backgroundColor = backgroundColor;
    }, [location.pathname]);

    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/create-resume' element={<CreateResumePage />} />
        </Routes>
    );
};

export default App;