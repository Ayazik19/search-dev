import React from 'react';
import Home from './components/home';
import './App.css';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';

const App: React.FC = () => {
    return (
        <div className='app'>
            <Router>
                <Routes>
                    <Route path='/' element={<Home />}>Home</Route>
                </Routes>
            </Router>
        </div>
    );
};

export default App;