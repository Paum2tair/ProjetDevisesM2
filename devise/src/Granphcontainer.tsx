import React, { useEffect, useState } from 'react';
import './style/banner.css';
import PriceChart from './PriceChart';

interface Currency {
  iso: string;
}

const Granphcontainer: React.FC = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>(''); // État pour la devise sélectionnée

  useEffect(() => {
    // Fonction pour récupérer les devises
    const fetchCurrencies = async () => {
      try {
        const response = await fetch('http://localhost:8000/requete.php/list_all');
        const data = await response.json();
        setCurrencies(data);
      } catch (error) {
        console.error('Erreur lors du chargement des devises :', error);
      }
    };

    fetchCurrencies();
  }, []);

  // Gestion du changement de devise
  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCurrency(event.target.value);
  };

  return (
    <div className="graphcontainer">
      <div className="filtrage">
        <div className="dd">
          <label htmlFor="currency">Choisir votre devise :</label>
          <div className="hh">
            <select name="currency" id="currency-select" onChange={handleCurrencyChange}>
              <option value="">--SVP choisissez une devise--</option>
              {currencies.map((currency) => (
                <option key={currency.iso} value={currency.iso}>
                  {currency.iso}
                </option>
              ))}
            </select>
            <a href="/import">+</a>
          </div>
        </div>
      </div>
      <div className="graph">
      {selectedCurrency === '' ? (
    <p>Aucune devise choisie. Veuillez sélectionner une devise pour afficher le graphique.</p>
  ) : (
    <PriceChart currency={selectedCurrency} />
  )}
      </div>
    </div>
  );
};

export default Granphcontainer;
