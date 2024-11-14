import React from 'react';
import './style/banner.css';
import { useNavigate } from 'react-router-dom';
const Header: React.FC = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/'); // Redirige vers la page d'accueil
    };
    return (
        <div className="header_container" onClick={handleClick} style={{ cursor: 'pointer' }} title="Revenir à l'écran d'accueil">
            <h1>Exchange-man</h1>
        </div>
    );
};

export default Header;

