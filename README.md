# Portfolio – Saïd KHATIR (Géomaticien)

Ce dépôt contient le code source de mon **portfolio**. Je l’ai conçu pour **présenter et partager mes travaux** en géomatique (cartographie, datavisualisation, analyses spatiales et webmapping), ainsi que pour donner une vue d’ensemble de mon **parcours** (formation, stages, expériences).

Le site est au format **one-page** : navigation simple et accès rapide à mes productions (cartes, infographies et cartes interactives).

## [Accéder au e-portfolio sous ce lien](https://saidkhatir.github.io/saidkhatir_portfolio/)

---

## Contenu du portfolio

### À propos
Une présentation synthétique de mon profil (Master SIGAT) et de mon activité actuelle, avec un focus sur mes compétences de géomaticien et ma recherche de nouvelles opportunités.

### Mon parcours (Timeline)
Une frise chronologique interactive qui retrace les grandes étapes :
- expériences professionnelles avant la reprise d’études,
- Licence Géographie & Aménagement,
- Master SIGAT (M1 / M2) + stages,
- poste actuel à l’INRAE.

### Travaux & réalisations (Portfolio)
Le cœur du site : une galerie filtrable pour explorer mes productions.

**Catégories :**
- **Cartes** : productions cartographiques (ex. analyses thématiques, anamorphoses, cartes bivariées, émissions GES, GTFS, etc.)
- **Infographies** : posters / dataviz et supports visuels de restitution
- **Cartes interactives** :
  - participation à une refonte de cartographie interactive (site externe via iframe)
  - webmaps développées dans le cadre de projets/stages (iframes locales)

Chaque visuel est cliquable : ouverture en **plein écran** via une fenêtre modale pour mieux apprécier les détails.

### Contact
Informations de contact + liens vers :
- GitHub
- LinkedIn

---

## Stack & outils utilisés

### Front-end
- **HTML5** : structure des sections (about, parcours, portfolio, contact)
- **CSS3** : mise en page responsive, animations/transitions, composants UI (cartes, boutons filtres, modal, timeline), dégradés et styles modernes
- **JavaScript (Vanilla)** : logique interactive sans framework :
  - filtres du portfolio (Cartes / Infographies / Interactif)
  - gestion du **modal** d’images
  - **smooth scroll** sur les ancres
  - slider timeline (boutons, dots, clavier, swipe mobile)

### Librairies & ressources externes
- **Font Awesome** (CDN) : icônes (timeline, réseaux sociaux, navigation)
- **iframes** : intégration de cartes web interactives (externes et locales)

### Déploiement / usage
- Le site fonctionne en **statique** (aucun back-end).
- Exécutable localement (simple ouverture du fichier) ou via un petit serveur (recommandé pour éviter des soucis de chemins/iframes).

---

## Organisation des contenus (ce que contient le dépôt)

- `index.html` : page principale et contenu du portfolio
- `style.css` : styles et responsive
- `main.js` : interactions (filtres, modal, timeline, scroll)
- `img/` : photo + visuels de portfolio
- `map/` : cartes interactives locales (webmaps embarquées)

---
