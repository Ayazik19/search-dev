import React from 'react';
import Home from './components/home';
import './App.css';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import CreateResumePage from './components/componentsCreatePage/createResumePage';

const App: React.FC = () => {
    return (
        <div className='app'>
            <Router>
                <Routes>
                    <Route path='/' element={<Home />}>Home</Route>
                    <Route path='/create-resume' element={<CreateResumePage />}>Create resume</Route>
                </Routes>
            </Router>
        </div>
    );
};

export default App;