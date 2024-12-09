import React, { useState } from 'react';
import './style/banner.css';
import Header from './Header';
import Footer from './Footer';

const Formulaire: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type === 'text/csv') {
                setFile(selectedFile);
                setErrorMessage('');
            } else {
                setFile(null);
                setErrorMessage('Le fichier doit être au format .csv');
            }
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!file) {
            setErrorMessage('Veuillez sélectionner un fichier CSV.');
            return;
        }

        setLoading(true); // Activer le loader
        setErrorMessage(''); // Réinitialiser les erreurs
        setSuccessMessage(''); // Réinitialiser les messages de succès

        const formData = new FormData();
        formData.append('csvFile', file);

        try {
            const response = await fetch('http://localhost:8000/requete.php/upload_csv', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setSuccessMessage('Fichier envoyé avec succès !');
                setFile(null); // Réinitialiser l'état après succès
            } else {
                setErrorMessage('Erreur lors de l’envoi du fichier.');
            }
        } catch (error) {
            setErrorMessage('Une erreur est survenue lors de la requête.');
        } finally {
            setLoading(false); // Désactiver le loader
        }
    };

    return (
        <div className="principal">
            <Header />
            <div className="form">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="file-input">Choisir un fichier CSV :</label>
                    <input
                        type="file"
                        id="file-input"
                        accept=".csv"
                        onChange={handleFileChange}
                    />
                    {loading && <img className="loading" src="loader.gif" alt='Chargement...'></img>}
                    {errorMessage && (
                        <p className="error">
                            {errorMessage}
                        </p>
                    )}
                                {successMessage ? (
                        <>
                            <p className="success">{successMessage}</p>
                            <a className="success-link" href="/exchange-man">
                                Retour au graphique
                            </a>
                        </>
                    ) : (
                        <button type="submit" disabled={loading}>
                            {loading ? 'En cours...' : 'Envoyer'}
                        </button>
                    )}
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default Formulaire;
