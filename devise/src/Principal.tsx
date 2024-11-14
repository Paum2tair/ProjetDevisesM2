import React from 'react';
import './style/banner.css';
import Header from './Header';
import Footer from './Footer';

import Granphcontainer from './Granphcontainer';

const Principal: React.FC = () => {
    return (
        <div className="principal">
            <Header />
            <Granphcontainer />
            <Footer />
        </div>
    );
};

export default Principal;

