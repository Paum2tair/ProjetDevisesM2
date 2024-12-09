# Projet Devises M2

### Créateurs :
#### Emilie LE ROUZIC
#### Sven TUAL
#### Antoine NOEL

## Mise en place rapide

Afin de pouvoir utiliser le programme, il est requis d'éxecuter ces deux commandes : 

**-Lancement du serveur de développement :**
```npm run dev```

**-Lancement du serveur PHP :**
```php -S localhost:8000```

Le format de la base de données est présent dans le fichier devise.sql. ⚠️ Les données y ont été retirées.

## Choix techniques

Ce fichier a pour but d'expliquer les choix techniques de ce projet.

### Modèle de données 
Une seule table a été utilisée pour représenter les données. Les seuls objets manipulés par le site sont des rapports entre devises. De fait, les ISO des devises sont récupérées directement depuis le CSV.

### Base de données 
L'outil Wampp a été utilisé car il permet la création d'un serveur local mysql. Cet outil fourni un accès à PhpMyAdmin. Cela a été très utile pour la visualisation et la gestion de la base de données, notamment lors de la phase de tests.

### Front
Le framework React a été utilisé pour ce projet. Ce dernier n'étant composé que de quelques pages , cela a permis de commencer rapidement à coder tout en possèdant une liste d'outils très utiles. Par exemple la commande npm run dev permettant de mettre en place un serveur local très rapidement.

### Back
Le langage PHP a été utilisé afin de créer les requètes et ainsi accèder à la base de données. Ce langage a été souvent utilisé lors du cursus isennien et a donc été choisi.

