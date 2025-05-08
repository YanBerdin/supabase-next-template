# **Project Requirements Document: « Réveil Basket Is sur Tille » Website**

Contexte : Le club de basket souhaite moderniser sa présence en ligne et valoriser son histoire, ses équipes ainsi que ses valeurs. Les éléments graphiques (logo, palette de couleurs) seront extraits de leurs réseaux sociaux (lien fourni).

## Fonctionnalités à Développer :

### Intégration de Supabase

- Configuration de la connexion à Supabase
- Création des types pour les entités principales (utilisateurs, équipes, événements, actualités, etc.)
- Implémentation des fonctions pour interagir avec la base de données
- Mise en place de l'authentification pour l'espace membres
- Connexion au MCPServer de Supabase

### 1. Page d’accueil :

Bannière dynamique intégrant le logo et des visuels en action.

Présentation des actualités et événements récents.

Liens vers les réseaux sociaux et partenaires.

### Pages de contenu :

Qui sommes-nous ? : Historique, valeurs, équipe dirigeante avec fiche et photos.

- **Équipes** : Fiches détaillées pour chaque catégorie (masculine, féminine, juniors…), calendrier des matchs, résultats et classements.

- **Actualités & Événements** : Interface CMS pour la gestion et publication d’articles et d’évènements (avec module commentaires et partage social).

- **Média** : Galerie photo/vidéo responsive, intégrée à une interface de gestion pour actualiser les contenus.

- **Contact & Adhésion** : Formulaire de contact (anti-spam, validation côté client et serveur), et formulaires d’inscription.

### Exigences Techniques :

Intégrer un système de gestion de contenu pour permettre aux administrateurs de gérer facilement les articles, événements et médias.

Base de données : Utiliser MySQL, PostgreSQL Supabase, MariaDB , Mongodb ou autre SGBD sécurisé pour gérer les informations.

### Sécurité :

- Protocole HTTPS obligatoire.

- protection contre les attaques (SQL injection, XSS, CSRF, etc.).

- Implémentation d’un bandeau de consentement aux cookies et gestion des demandes RGPD (accès, rectification, suppression).

### 2. Calendrier interactif

- Création d'une page de calendrier complète avec react-big-calendar
- Affichage des événements sous différentes vues (mois, semaine, jour, agenda)
- Filtrage des événements par catégorie
- Liste des événements à venir
- Options d'exportation du calendrier


### 3. Espace membres

- Système d'authentification complet (connexion, déconnexion, mot de passe oublié)
- Tableau de bord personnalisé
- Gestion du profil utilisateur
- Accès aux documents du club
- Paramètres de notification et de confidentialité

### Structure de la base de données

La base de données comprend les tables suivantes :

- users : informations sur les membres
- teams : données des équipes
- events : événements du club (matchs, entraînements, réunions)
- news : actualités du club
- media : photos et vidéos
- matches : informations sur les matchs

### page de test pour vérifier la connexion à Supabase et récupérer les données. Voici comment l'utiliser :

1. **Accédez à la page de test** : Rendez-vous sur `/test-connection` dans votre application.
2. **Vérifiez le statut de la connexion** :

1. Si la connexion réussit, vous verrez un message de succès et les données récupérées.
2. Si la connexion échoue, vous verrez un message d'erreur avec des détails sur le problème.


3. **Explorez les données** :

1. La page affiche les équipes, les événements et les actualités récupérés de Supabase.
2. Vous pouvez naviguer entre ces différentes catégories à l'aide des onglets.



4. **Tester à nouveau** : Vous pouvez cliquer sur le bouton "Tester à nouveau" pour rafraîchir les données.


Cette page permet de vérifier que :

- La connexion à Supabase fonctionne correctement
- Les variables d'environnement sont bien configurées
- Les tables ont été créées et contiennent des données
- Les fonctions de récupération de données fonctionnent comme prévu
- Séparation de la vérification de connexion et de la vérification des tables

1. **Détection spécifique des tables manquantes** :

2. Le code détecte si l'erreur est due à des tables manquantes dans la base de données
3. Un nouvel état "tables-missing" a été ajouté pour ce cas spécifique


2. **Instructions claires pour l'utilisateur** :

1. Affichage d'un message d'alerte spécifique avec des instructions étape par étape pour créer les tables
2. Guide visuel pour accéder à l'éditeur SQL de Supabase et exécuter le script



3. **Vérification de connexion améliorée** :

1. Ajout d'une fonction RPC `get_project_ref()` pour vérifier la connexion de base à Supabase
2. Séparation de la vérification de connexion et de la vérification des tables

### Comment utiliser cette page mise à jour :

1. Accédez à `/test-connection` dans votre application
2. Si vous voyez le message "Tables manquantes", suivez les instructions affichées :

1. Connectez-vous à votre tableau de bord Supabase
2. Accédez à l'éditeur SQL
3. Créez une nouvelle requête
4. Copiez et collez le script SQL **database-setup.sql**
5. Exécutez le script
6. Revenez à la page de test et cliquez sur "Tester à nouveau"



3. Avant d'exécuter le script principal pour créer toutes les tables, vous devrez d'abord exécuter le script `check-connection.sql` pour créer la fonction RPC `get_project_ref()`.
