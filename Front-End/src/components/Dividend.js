import React from 'react';
import CompanyDropdown from '../components/CompanyDropdown';
import BarChart from '../components/BarChart';
import DonutChart from '../components/DonutChart';

const Dividend = () => {
    return (
        <div className="container">
            <h2 className="text-center text-secondary mb-4">Dividend Dashboard</h2>
            <CompanyDropdown />
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '40px' }}>
                <BarChart />
                <DonutChart />
            </div>
        </div>
    );
};

export default Dividend;
