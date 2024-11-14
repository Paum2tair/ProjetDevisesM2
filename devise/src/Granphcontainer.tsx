import React from 'react';
import './style/banner.css';

const Granphcontainer: React.FC = () => {
    return (
        <div className="graphcontainer">
            <div className="filtrage">
                <div className="dd">

                    <label for="currency">Choisir votre devise :</label>
                    <div className="hh">
                        <select name="pets" id="pet-select">
                            <option value="">--SVP choisissez une devise--</option>
                            <option value="USD">USD</option>
                            <option value="GPB">GPB</option>
                        </select>
                        <a href="#">+</a>
                    </div>
                </div>

            </div>
            <div className="graph">

            </div>
        </div>
    );
};

export default Granphcontainer;

