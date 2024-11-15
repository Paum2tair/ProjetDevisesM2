import React from 'react';
import './style/banner.css';

interface BannerProps {
    title: string;
    subtitle?: string;
}

const Banner: React.FC<BannerProps> = ({ title, subtitle }) => {

    return (
        <div className="banner-container" >
            <h1 className="banner-title">{title}</h1>
            {subtitle && <p className="banner-subtitle">{subtitle}</p>}
            <a href="/exchange-man" className="home_bt">
            <span className="text">J’en profite</span>
            <span class="fleche zero">&gt;</span>
            <span class="fleche un">&gt;</span>
            <span class="fleche deux">&gt;</span>
            </a>
        </div>
    );
};

export default Banner;
