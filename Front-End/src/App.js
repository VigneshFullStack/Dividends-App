import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dividend from './components/Dividend';
import Companies from './components/Companies';
import DividendDetails from './components/DividendDetails';

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <div className="container mt-3">
                    <Routes>
                        <Route path="/" element={<Dividend />} />
                        <Route path="/companies" element={<Companies />} />
                        <Route path="/dividend-details" element={<DividendDetails />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
