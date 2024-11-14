import React from 'react';
import './style/banner.css';
import Header from './Header';
import Footer from './Footer';

const Principal: React.FC = () => {
    return (
        <div className="principal">
            <Header />
            <Footer />
        </div>
    );
};

export default Principal;

