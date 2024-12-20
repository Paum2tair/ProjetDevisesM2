import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Banner from './Banner';
import Principal from './Principal';
import Formulaire from './Formulaire';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Banner title="Exchange-man" subtitle=<>Visualisez les taux de change en euro de vos devises préférées.<br /> <br />
Impossible de la trouver ?  Utilisez notre outil de création de devise et importez vos propres valeurs !</> />} />
                <Route path="/exchange-man" element={<Principal />}/>
                <Route path="/import" element={<Formulaire />} />
            </Routes>
        </Router>
    );
};



export default App;
