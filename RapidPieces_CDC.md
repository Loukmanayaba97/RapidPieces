# RapidPieces — Cahier des Charges Consolidé

> **Marketplace de Pièces Détachées — Marché Africain**
> Version 1.0 · Mai 2026 · *CONFIDENTIEL — Usage interne uniquement*

---

## 0. Résumé Exécutif

| Paramètre | Valeur |
|---|---|
| **Nom du projet** | RapidPieces |
| **Type de plateforme** | Marketplace multi-vendeurs — Freemium → Commission + Abonnement |
| **Marché cible** | Afrique francophone & anglophone — B2B & B2C |
| **Catalogue** | Pièces neuves, reconditionnées & occasion — tous types d'engins |
| **Paiement** | Carte bancaire + Mobile Money (Wave, Orange, MTN, Moov) |
| **Langues** | Français (principal) + Anglais |
| **Budget Phase 1** | 500 000 FCFA (MVP) |
| **Délai MVP** | 2 semaines — Sprint intensif |
| **KPI principal** | 50+ vendeurs actifs · 500+ références produits à J+90 |

---

## 1. Contexte & Problématique

### 1.1 Contexte du marché

Le marché africain des pièces détachées représente plusieurs milliards de dollars annuels, dominé par des circuits informels, des importateurs locaux et des réseaux de distribution fragmentés. En Afrique de l'Ouest notamment, particuliers, garages et professionnels subissent quotidiennement des dysfonctionnements structurels.

### 1.2 Principaux défis identifiés

- Difficulté à identifier et localiser une pièce compatible avec un véhicule précis
- Absence de centralisation des stocks entre fournisseurs — délais de recherche élevés
- Risques importants d'erreurs (mauvaise référence, incompatibilité)
- Manque de confiance entre acheteurs et vendeurs non certifiés
- Transactions peu sécurisées, absence de traçabilité des commandes
- Connectivité internet instable — nécessité d'un mode offline
- Aucune plateforme unifiée et fiable au niveau panafricain

### 1.3 Opportunité stratégique

L'absence d'un acteur numérique dominant crée une fenêtre d'opportunité pour faire de **RapidPieces** la référence africaine de la vente de pièces détachées — le « Jumia des pièces auto » — en connectant sur une seule plateforme clients, garages, vendeurs, importateurs et livreurs.

### 1.4 Objectifs stratégiques

| Réf. | Objectif |
|---|---|
| OBJ-01 | Créer la première marketplace panafricaine de pièces détachées multi-engins |
| OBJ-02 | Digitaliser et sécuriser les transactions entre vendeurs et acheteurs |
| OBJ-03 | Proposer une expérience optimale même avec une connexion faible (PWA Offline) |
| OBJ-04 | Générer des revenus via un modèle Freemium évolutif vers Commission + Abonnement |
| OBJ-05 | Couvrir l'Afrique francophone et anglophone dès le lancement |
| OBJ-06 | Intégrer un module IA (identification photo, chatbot, diagnostic) en version Premium |

### 1.5 KPIs de succès

| KPI | Cible |
|---|---|
| Vendeurs actifs à J+90 | > 50 inscrits et actifs |
| Références produits | > 500 à J+90 |
| Temps de chargement | < 2 secondes (3G) |
| Disponibilité SLA | > 99,5% |
| Taux de conversion visiteur → acheteur | > 3% au 3ème mois |
| NPS utilisateur | > 40 à 6 mois |
| Transactions mensuelles à M+6 | > 200/mois |

---

## 2. Utilisateurs & Parcours

### 2.1 Profils utilisateurs

| Profil | Type | Accès & Fonctionnalités clés |
|---|---|---|
| **Acheteur B2C** | Particulier | Navigation, recherche, achat, suivi commande, messagerie, avis |
| **Acheteur B2B** | Garage, transporteur... | Achat en volume, tarifs pro, compte multi-utilisateurs, facturation auto |
| **Vendeur Standard** | Particulier / petit pro | Listing gratuit limité, gestion stock basique, tableau de bord simplifié |
| **Vendeur Premium** | Professionnel abonné | Listing illimité, boost visibilité, analytics avancés, import CSV, API stock |
| **Livreur** | Partenaire logistique | Consultation missions par zone, mise à jour statuts, validation remise, GPS |
| **Administrateur** | Équipe plateforme | Gestion complète : utilisateurs, KYC, litiges, commissions, statistiques globales |

---

### 2.2 Parcours Acheteur — Recherche & Achat

```
1. Arrivée sur RapidPieces (web / mobile / PWA) — aucune inscription requise
2. Recherche par marque/modèle OU référence OEM OU catégorie OU mot-clé libre
3. Consultation des résultats filtrés (prix, état, localisation, note vendeur)
4. Sélection d'une pièce — fiche détaillée (photos HD, compatibilités, garantie, avis)
5. Vérification du vendeur : note, certifications, badge KYC, localisation
6. Ajout au panier — choix du mode de livraison (standard / express / retrait)
7. Paiement sécurisé (CB ou Mobile Money) — compte créé automatiquement (Guest Checkout)
8. Confirmation — suivi en temps réel via notifications push/SMS à chaque étape
9. Réception + dépôt d'avis — invitation à activer le compte complet
```

---

### 2.3 Parcours Vendeur — Publication & Vente

```
1. Inscription + soumission documents KYC (pièce d'identité, registre de commerce)
2. Validation KYC par l'équipe admin sous 24h — activation de l'espace boutique
3. Création d'annonces : photos (max 10), description, référence OEM, état, prix, stock
4. Validation par l'algorithme de modération — publication dans le catalogue
5. Réception d'une commande — notification push/SMS — acceptation ou refus
6. Préparation & expédition — coordination livreur partenaire — mise à jour statuts
7. Virement automatique sous 7 jours ouvrés après confirmation de livraison
```

---

### 2.4 Parcours Administrateur

```
1. Validation KYC des nouveaux vendeurs — activation ou rejet (avec justification)
2. Modération du catalogue — traitement des signalements d'annonces
3. Gestion des litiges — arbitrage sous 48h — déclenchement remboursements / pénalités
4. Supervision financière — configuration commissions — validation reversements
5. Tableau de bord global : statistiques, top produits, taux de conversion, exports
```

---

## 3. Programme Fonctionnel

### 3.1 Périmètre MVP — Phase 1 (In-Scope)

| Module | Fonctionnalités clés |
|---|---|
| **M1 — Comptes & Auth** | Inscription Guest Checkout + activation différée, KYC vendeurs, OAuth 2.0, 2FA optionnel, récupération SMS/email |
| **M2 — Catalogue & Recherche** | Recherche OEM / marque-modèle-année / catégorie / mot-clé, filtres avancés, autocomplétion, garage virtuel, compatibilités |
| **M3 — Annonces & Stock** | Création annonces (10 photos max), import CSV (Premium), gestion stock temps réel, alertes rupture, boost visibilité payant |
| **M4 — Commandes & Paiement** | Panier, codes promo, CB (Stripe) + Mobile Money (MTN, Wave, Orange, Moov), escrow, paiement à la livraison, facturation auto |
| **M5 — Livraison & Suivi** | Livraison vendeur ou transporteur partenaire, 7 statuts, notifications push/SMS/email, suivi GPS livreur |
| **M6 — Confiance & Avis** | Notation 5 étoiles (produit / livraison / vendeur), avis vérifiés post-achat, badge KYC certifié, anti-contrefaçon |
| **M7 — Litiges** | Ouverture litige J+7 après réception, médiation admin sous 48h, remboursement automatique |
| **M8 — Messagerie** | Chat temps réel client ↔ vendeur, envoi de photos, historique conversations, modération admin |
| **M9 — Tableaux de bord** | Dashboard vendeur (ventes, revenus, stock) + Dashboard admin global (KPIs, exports CSV/PDF) |
| **M10 — Interface bilingue** | Français (principal) + Anglais — mobile-first — mode sombre natif |

### 3.2 Fonctionnalités Phase 2 (Out-of-Scope MVP)

- Module IA : identification pièce par photo, chatbot diagnostic 24h/24, suggestions personnalisées
- Géolocalisation vendeurs & cartographie des stocks à proximité
- Extension pays : Togo, Côte d'Ivoire, Sénégal, Cameroun
- Application vendeur dédiée iOS / Android
- Intégration ERP (Sage, Odoo, SAP) & API fournisseurs
- Module enchères pour pièces rares — Programme de fidélité & cashback
- Réseau de garages partenaires, diagnostic OBD, vente de véhicules d'occasion

---

## 4. Architecture Technique

### 4.1 Stack technologique

| Composant | Technologie | Justification |
|---|---|---|
| Frontend Web | React.js / Next.js + Vite | SSR/SEO, PWA native, performance optimale |
| Application Mobile | React Native | iOS & Android — 80% de code partagé |
| PWA Offline | Service Workers + IndexedDB | Navigation & recherche hors connexion |
| Backend API | Node.js + Express | API REST scalable, écosystème riche |
| Base de données | PostgreSQL | ACID, robuste pour catalogue & transactions |
| Cache & Sessions | Redis | Performance, sessions, recherche rapide |
| Stockage images | Cloudinary / AWS S3 | CDN intégré, optimisation auto |
| Temps réel | WebSocket (Socket.io) | Messagerie, suivi GPS, statuts commandes |
| Authentification | JWT + OAuth 2.0 (Google) | Sécurité, SSO, gestion sessions 30 jours |
| Paiement CB | Stripe / Flutterwave | Standard international + spécialiste Afrique |
| Mobile Money | MTN MoMo + Wave + Orange + Moov | Couverture Bénin & Afrique de l'Ouest |
| Notifications | Firebase + Africa's Talking / Twilio | Push iOS/Android + SMS panafricain |
| Recherche avancée | MeiliSearch / Elasticsearch | Full-text ultra-rapide, suggestions |
| DevOps | Docker + GitHub Actions CI/CD | Déploiement continu, environnements isolés |
| Hébergement | AWS / DigitalOcean (région Afrique) | Latence réduite pour utilisateurs africains |
| KYC Identité | Smile Identity | Spécialiste vérification identité Afrique |

### 4.2 Sécurité & Conformité

- Chiffrement HTTPS/TLS 1.3 en transit — AES-256 au repos
- JWT avec rotation de tokens — OAuth 2.0 — 2FA optionnel
- Protection OWASP Top 10 : injection SQL, XSS, CSRF — rate limiting API
- Escrow : fonds sécurisés jusqu'à confirmation de réception client
- Aucune donnée CB stockée en clair — conformité PCI-DSS
- RGPD : consentement explicite, droit à l'oubli, export données, DPO désigné
- KYC vendeurs obligatoire + conformité Mobile Money (UEMOA, CEMAC)
- Backup quotidien automatique — rétention 30 jours — RTO < 4h / RPO < 24h

---

## 5. Contraintes Non-Fonctionnelles

| Paramètre | Exigence |
|---|---|
| Chargement page | < 2 secondes sur connexion 3G africaine |
| Temps de réponse API | < 500ms pour 95% des requêtes |
| Utilisateurs simultanés | 1 000 (Phase 1) → 10 000 (Phase 2) |
| Disponibilité SLA | > 99,5% — maintenance en heures creuses |
| Catalogue produits | Jusqu'à 500 000 références en Phase 2 |
| Navigateurs web | Chrome 90+, Safari 14+, Firefox 88+, Edge 90+ |
| Systèmes mobiles | Android 8.0+ / iOS 13+ |
| Résolution écran | Responsive 320px → 2560px — mobile-first |
| Connexion minimum | Fonctionnel sur 2G/3G — mode offline via PWA |
| Accessibilité | WCAG 2.1 niveau AA — 3 clics max pour toute fonctionnalité clé |
| Langues | Français + Anglais (Portugais prévu Phase 2) |

---

## 6. Budget & Modèle Économique

### 6.1 Budget Phase 1 — MVP

**Budget total : 500 000 FCFA**

Ce budget couvre l'ensemble des postes nécessaires à la livraison du MVP en 2 semaines, incluant :

- Design UI/UX & maquettes Figma (wireframes, design system)
- Développement Backend (API REST, base de données, authentification, catalogue, moteur de recherche)
- Développement Frontend Web (React/Next.js, PWA)
- Application Mobile iOS & Android (React Native)
- Tests, recette & déploiement
- Infrastructure cloud pour la durée du sprint (hébergement, CDN, nom de domaine)

### 6.2 Modèle de revenus

| Phase | Période | Modèle |
|---|---|---|
| **Freemium** | Mois 1–2 | Inscription et listing gratuit — fonctionnalités premium payantes (boost, analytics, import CSV) |
| **Commission** | Mois 3–6 | 5% à 12% sur les ventes selon catégorie de produit |
| **Abonnement Pro** | Mois 3+ | 20€ à 50€/mois par vendeur selon le pays |
| **Expansion** | +6 mois | Publicité native, partenariats assureurs, extension géographique, module IA Premium |

---

## 7. Planning MVP — Sprint Intensif 2 Semaines

> L'application mobile native (React Native) est livrée en J+30 (sprint suivant). Le MVP J+14 livre la version **web responsive + PWA**, déjà pleinement fonctionnelle sur mobile.

### 7.1 Vue globale — 14 jours

| Jours | Phase | Livrables | Responsable |
|---|---|---|---|
| J1–J2 | Cadrage & Setup | Validation périmètre, wireframes basse fidélité, setup DEV/STAGING, repo Git | PO + Tech Lead |
| J2–J4 | Design UI/UX | Maquettes Figma : accueil, recherche, fiche produit, panier, paiement, dashboard vendeur | Designer UI/UX |
| J3–J8 | Dev Backend Core | API REST, BDD PostgreSQL, authentification, catalogue, moteur de recherche, gestion stock | Dev Backend (×2) |
| J5–J10 | Dev Frontend Web | Intégration UI React/Next.js, PWA, panier, paiement (Stripe + MTN MoMo), notifications | Dev Frontend (×2) |
| J6–J11 | Dev Mobile | App React Native (iOS + Android) — écrans principaux, paiement mobile, push | Dev Mobile (×1) |
| J10–J12 | Intégration & Tests | Tests fonctionnels, tests de charge, corrections bugs critiques, audit sécurité de base | QA + Équipe |
| J13–J14 | Mise en production | Déploiement PROD, monitoring (Sentry + Datadog), formation équipe client, go-live | DevOps + PO |

### 7.2 KPIs de succès à J+14

| KPI | Cible |
|---|---|
| Vendeurs actifs inscrits & validés KYC | > 10 vendeurs |
| Références produits en ligne | > 100 références |
| Temps de chargement | < 2 secondes sur 3G |
| Disponibilité plateforme | > 99,5% |
| Transactions de test validées | ≥ 5 commandes end-to-end |
| Score NPS interne | > 7/10 (recette client) |

### 7.3 Hypothèses & Risques

| Hypothèse / Risque | Mitigation |
|---|---|
| Équipe disponible full-time (5–6 personnes) | Valider les disponibilités avant démarrage — no context-switching |
| Retours client en < 4h sur les maquettes | Point daily obligatoire — canal Slack/WhatsApp dédié |
| APIs Mobile Money (MTN MoMo, Wave) disponibles | Obtenir les clés API sandbox dès J1 — fallback paiement à la livraison |
| Scope figé après J2 (aucune nouvelle feature) | Backlog priorisé et signé avant démarrage |
| Mobile = web-mobile responsive en 2 semaines | Prioriser PWA — app native livrée en sprint 3 (J+30) |

---

## 8. Livrables Attendus

| Livrable | Description |
|---|---|
| Code source complet | Dépôt GitHub/GitLab privé — branches DEV / STAGING / PROD |
| Application web | URL de production avec certificat SSL — React/Next.js + PWA installable |
| Application mobile | APK (Android) + IPA (iOS) pour soumission stores |
| Back-office admin | Interface de gestion : utilisateurs, KYC, litiges, finances, statistiques |
| Documentation API | Swagger/OpenAPI — tous les endpoints documentés |
| Guide utilisateur | Guide acheteur + Guide vendeur (FR + EN) |
| Guide administrateur | Manuel de gestion back-office complet |
| Rapport de tests | Recette fonctionnelle + audit de sécurité |
| Formation équipe | Session de prise en main (2h) + enregistrement vidéo |

---

## 9. Glossaire

| Terme | Définition |
|---|---|
| **MVP** | Minimum Viable Product — version minimale fonctionnelle du produit |
| **PWA** | Progressive Web App — application web installable, fonctionnant offline |
| **OEM** | Original Equipment Manufacturer — référence pièce d'origine constructeur |
| **KYC** | Know Your Customer — vérification d'identité réglementaire des vendeurs |
| **B2B** | Business to Business — transactions entre professionnels |
| **B2C** | Business to Consumer — transactions entre professionnel et particulier |
| **SLA** | Service Level Agreement — engagement contractuel de disponibilité |
| **API** | Application Programming Interface — interface de communication entre systèmes |
| **CDN** | Content Delivery Network — réseau de distribution de contenu géographique |
| **JWT** | JSON Web Token — standard d'authentification sécurisée stateless |
| **Escrow** | Compte séquestre sécurisant les fonds entre paiement et reversement vendeur |
| **FCFA** | Franc CFA — monnaie utilisée en Afrique de l'Ouest (UEMOA) |
| **RTO** | Recovery Time Objective — délai maximum de reprise après incident |
| **RPO** | Recovery Point Objective — perte de données maximale acceptable |

---

## 10. Roadmap & Vision Long Terme

### 10.1 Vue d'ensemble — 3 phases

```
Phase 1 — MVP       │ J+0  → J+14   │ Lancement plateforme (web + PWA)
Phase 2 — Expansion │ M+1  → M+6    │ Mobile natif + Extension pays + IA
Phase 3 — Écosystème│ M+7  → M+24   │ Plateforme automobile complète
```

---

### 10.2 Phase 1 — MVP (J+0 à J+14)

Objectif : disposer d'une plateforme fonctionnelle, sécurisée et prête à accueillir les premiers vendeurs et acheteurs.

| Livrable | Statut |
|---|---|
| Plateforme web responsive + PWA | ✅ Sprint 2 semaines |
| Catalogue multi-catégories avec moteur de recherche | ✅ Sprint 2 semaines |
| Paiement CB + Mobile Money (MTN MoMo, Wave) | ✅ Sprint 2 semaines |
| Gestion commandes, livraison & notifications | ✅ Sprint 2 semaines |
| Back-office admin (KYC, litiges, commissions) | ✅ Sprint 2 semaines |
| Application mobile native iOS & Android | 🔄 Sprint suivant (J+30) |

---

### 10.3 Phase 2 — Expansion (Mois 1 à 6)

Objectif : consolider la base utilisateurs, étendre la couverture géographique et enrichir la plateforme avec des fonctionnalités différenciantes.

**Expansion géographique**
- Lancement au Mali, Sénégal, Côte d'Ivoire, Togo
- Intégration des opérateurs Mobile Money locaux par pays
- Interface adaptée aux spécificités réglementaires de chaque marché

**Nouvelles fonctionnalités**
- Module IA Phase 1 : identification de pièce par photo, suggestions basées sur l'historique
- Chatbot assistant 24h/24 pour les questions clients fréquentes
- Comparateur de prix entre vendeurs pour une même référence
- Géolocalisation des vendeurs — cartographie des stocks disponibles à proximité
- Application vendeur dédiée iOS & Android
- Suivi GPS livreur en temps réel partagé avec le client
- Import catalogue en masse via CSV/Excel (vendeurs Premium)
- Programme de parrainage vendeurs (growth hacking)

**Modèle économique**
- Activation des commissions sur ventes (5% à 12% selon catégorie)
- Lancement des abonnements vendeur Pro (20€ à 50€/mois)
- Premiers partenariats livreurs régionaux

---

### 10.4 Phase 3 — Écosystème Automobile Complet (Mois 7 à 24)

Objectif : faire de RapidPieces la super-app de référence pour tout ce qui touche à l'automobile en Afrique.

**Services additionnels**
- Réseau de garages partenaires : prise de rendez-vous en ligne, devis instantané
- Diagnostic automobile assisté par IA (lecture de codes OBD via l'app)
- Vente de véhicules d'occasion entre particuliers (C2C)
- Location de véhicules courte durée
- Assistance routière géolocalisée

**Partenariats stratégiques**
- Compagnies d'assurance : souscription et gestion de sinistres directement via RapidPieces
- Importateurs & distributeurs officiels : intégration catalogues constructeurs
- Établissements de crédit : financement d'achats de pièces pour les garages B2B

**Fonctionnalités avancées**
- Module enchères pour pièces rares et collector
- Programme de fidélité & cashback (points RapidPieces)
- Intégration ERP externe (Sage, Odoo, SAP) pour les grands comptes
- APIs fournisseurs pour synchronisation catalogue automatique
- Support langues supplémentaires : Arabe, Portugais, Wolof, Bambara

**Expansion continentale**
- Couverture Afrique centrale (Cameroun, RDC, Congo)
- Couverture Afrique de l'Est (Kenya, Tanzanie, Éthiopie)
- Couverture Afrique du Nord (Maroc, Tunisie)

---

### 10.5 Synthèse Roadmap

| Phase | Période | Objectif clé | KPI cible |
|---|---|---|---|
| **Phase 1 — MVP** | J+0 → J+14 | Plateforme live, premiers vendeurs | 10 vendeurs · 100 références |
| **Phase 2 — Expansion** | M+1 → M+6 | Extension pays + IA + mobile natif | 500 vendeurs · 5 pays |
| **Phase 3 — Écosystème** | M+7 → M+24 | Super-app automobile africaine | 5 000 vendeurs · 15 pays |

---

*— Fin du document —*
*RapidPieces · Confidentiel · Mai 2026*
