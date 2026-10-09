# Vérifications de VAULT 2

Ce document dit ce qui a été contrôlé, comment, et ce qui ne l’a **pas** été. Il est généré à partir des données de l’application (06/10/2026).

## 1. Contrôles automatiques : 117 au total, tous réussis

### Tests unitaires (57) — logique pure, sans navigateur

| Domaine | Tests | Ce qui est contrôlé |
| --- | ---: | --- |
| Données et calculs | 16 | Reprise d’une sauvegarde de la V1 (une V1 jamais modifiée repart de zéro au lieu d’afficher des réserves d’exemple), état vierge sans réserve supposée, saisies hostiles nettoyées, enregistrement, stockage plein, calculs identiques à la V1 (score, autonomie), règles DLC / DDM, besoins du foyer, cohérence des 27 guides (étapes atteignables, numéros valides, sources en https) et du catalogue d’aliments (calories cohérentes avec les macronutriments). |
| Code Morse | 18 | Encodage, durées (point 1, trait 3, pauses 1 / 3 / 7), signaux de procédure, traduction, décodage adaptatif de 80 à 700 ms avec variations de durée, parasites et échantillonnage de caméra, plusieurs messages, vitesse mal réglée. |
| Position | 11 | Distance et cap (Paris–Lyon, points cardinaux), formats de coordonnées, cap de la boussole téléphone à plat ou à la verticale, lissage ; analyse acoustique (jamais de conclusion sur la source). |
| Détection de bips et de flashs | 9 | Signal audio simulé passé dans une vraie FFT : bips propres, dans le bruit, bruit fort au départ (seuil qui ne se fige pas), de 100 à 1 200 ms le point, hauteur qui dérive, seuil manuel, flashs de caméra. |
| Contrastes | 3 | Rapports de contraste WCAG calculés pour les 6 ambiances (sombre, clair, nuit, et chacune en Low Profile) : texte ≥ 4,5:1 partout ; texte atténué et pastilles ≥ 4,5:1 en sombre et clair, ≥ 3,5:1 en nuit et Low Profile ; boutons ≥ 4,5:1. |

### Tests de navigateur (60) — Microsoft Edge piloté par Playwright

| Domaine | Tests | Ce qui est contrôlé |
| --- | ---: | --- |
| Navigation, mise en page, accessibilité, stock, kit, plan, guides, urgences, réglages, sauvegarde, migration | 28 | Les 15 adresses s’affichent sans erreur ni violation de la politique de sécurité ; aucun débordement horizontal à 320, 360, 390, 768 et 1 280 px, ni avec le texte à 140 % ; noms accessibles, un seul titre h1 par écran, cibles tactiles ≥ 36 px, fenêtre modale au clavier (focus piégé, Échap) ; saisies du stock, inventaire (ajout, modification, suppression, filtres), DLC dépassée jamais comptée, liste d’achats ; kit, contacts, plan ; recherche des guides et parcours de chacun jusqu’au bout, réponse par réponse, retour compris ; message aux secours, SMS 114, fiche vitale ; première ouverture honnête (aucune réserve supposée, « Premiers pas ») ; impression d’un guide étape par étape et dossier papier assemblé ; thèmes ; export, restauration, fichiers invalides ou hostiles, effacement ; reprise des données de la V1 ; données corrompues ou stockage bloqué. |
| Outils | 24 | Lampe simulée : chronologie des commandes conforme au Morse (écart < 45 ms), arrêt, caméra libérée, lampe trop lente, caméra refusée, torche absente ; son (volume programmé) et vibration (motif) ; lecture au microphone et à la caméra avec de faux périphériques (SOS, AIDE bruité, bruit fort au départ) ; alarme ; écoute acoustique ; écran gardé allumé pendant l’émission, la réception, l’écoute, le GPS et la boussole, puis libéré ; GPS simulé, points enregistrés, distance et cap, boussole (Android et iPhone simulés) ; arrêt de tout quand l’écran est quitté ou la page masquée. |
| Hors ligne et installation | 8 | Service worker, démarrage et fonctionnement sans réseau (aucune requête atteint le serveur), retour du réseau, mise à jour annoncée puis appliquée sur demande (ancien cache supprimé, données conservées), passage de la V1 à la V2 avec les vrais fichiers de la V1 (la V2 prend le relais seule, données reprises), site servi dans un sous-dossier comme sur GitHub Pages, manifeste et icônes, ouverture directe du fichier index.html, aucune requête externe, aucun style en ligne. |

### Autres mesures

- Poids du site : environ 790 Ko (code 394 Ko, feuille de styles 49 Ko, icônes 360 Ko), mis en cache en entier au premier chargement.
- Volume maximal accepté (300 aliments, 30 contacts, 50 points) : une modification de quantité prend environ 35 ms sur ordinateur ; la liste ne recrée que les lignes modifiées.
- Impressions (kit, plan, fiche d’urgence, liste d’achats) relues en aperçu : noir sur blanc, lisibles.
- Contenu : 27 guides, 128 étapes, 43 questions, 31 sources distinctes ; 35 modèles d’aliments ; 12 éléments de kit de base, 15 compléments, 6 contrôles périodiques.

## 2. Sources officielles des guides

Chaque consigne a été relue dans les textes officiels ci-dessous le 05/10/2026 ; les guides « guerre et conflit » et « Les numéros ne répondent pas » l’ont été le 09/10/2026 d’après le guide « Tous responsables » (info.gouv.fr). Le 06/10/2026 (09/10/2026 pour la source ajoutée), les 31 adresses répondaient (17 par un contrôle automatique, 14 ouvertes dans un navigateur : ces sites refusent les robots). Ces textes peuvent évoluer : en cas de différence, la source officielle prime.

| Source | Guides concernés |
| --- | --- |
| [Sécurité civile — incendie domestique](https://www.securite-civile.interieur.gouv.fr/reagir/risques-de-vie-courante/incendie-domestique) | Feu ou fumée |
| [GRDF — que faire en cas de fuite de gaz](https://www.grdf.fr/particuliers/urgence-depannage-fuite-gaz) | Odeur de gaz |
| [Sécurité civile — monoxyde de carbone](https://www.securite-civile.interieur.gouv.fr/reagir/risques-de-vie-courante/intoxication-au-monoxyde-de-carbone) | Monoxyde de carbone |
| [info.gouv.fr — réagir en cas d’attaque terroriste](https://www.info.gouv.fr/risques/reagir-en-cas-dattaque-terroriste) | Attaque ou fusillade, Produit toxique ou fumées |
| [Croix-Rouge — arrêt cardiaque](https://www.croix-rouge.fr/les-gestes-de-premiers-secours/arret-cardiaque) | Arrêt cardiaque |
| [Croix-Rouge — défibrillateur](https://www.croix-rouge.fr/les-gestes-de-premiers-secours/defibrillateur) | Arrêt cardiaque |
| [Ministère de l’Intérieur — gestes qui sauvent](https://www.interieur.gouv.fr/content/download/105174/832517/file/2022%20GQS.pdf) | Arrêt cardiaque, Saignement abondant, Personne inconsciente |
| [Croix-Rouge — hémorragie](https://www.croix-rouge.fr/les-gestes-de-premiers-secours/hemorragie) | Saignement abondant |
| [Croix-Rouge — inconscience](https://www.croix-rouge.fr/les-gestes-de-premiers-secours/inconscience) | Personne inconsciente |
| [Croix-Rouge — étouffement](https://www.croix-rouge.fr/les-gestes-de-premiers-secours/etouffement) | Étouffement |
| [Ministère de l’Intérieur — référentiel PSC1](https://www.interieur.gouv.fr/content/download/111131/888067/file/2022%20PSC1.pdf) | Étouffement, Brûlure |
| [Croix-Rouge — brûlure](https://www.croix-rouge.fr/les-gestes-de-premiers-secours/que-faire-en-cas-de-brulure) | Brûlure |
| [Géorisques — inondation](https://www.georisques.gouv.fr/me-preparer-me-proteger/que-faire-en-cas-d-inondation) | L’eau monte |
| [Sécurité civile — inondation](https://www.securite-civile.interieur.gouv.fr/reagir/risques-majeurs/inondations) | L’eau monte |
| [Sécurité civile — séisme](https://www.securite-civile.interieur.gouv.fr/reagir/risques-majeurs/seisme) | Secousses |
| [Sécurité civile — tempête et cyclone](https://www.securite-civile.interieur.gouv.fr/reagir/risques-majeurs/tempete-et-cyclone) | Tempête ou orage |
| [Météo-France — vigilance](https://vigilance.meteofrance.fr/) | Tempête ou orage |
| [Sécurité civile — feu de forêt](https://www.securite-civile.interieur.gouv.fr/reagir/risques-majeurs/feu-de-foret) | Feu de forêt |
| [Santé publique France — canicule](https://www.santepubliquefrance.fr/linfo-accessible-a-tous/canicule) | Forte chaleur |
| [Santé publique France — bons réflexes](https://www.santepubliquefrance.fr/index.php/les-actualites/les-fortes-chaleurs-nous-concernent-tous-adoptons-les-bons-reflexes) | Forte chaleur |
| [Ministère de la Santé — grand froid](https://sante.gouv.fr/sante-et-environnement/risques-climatiques/article/grand-froid-information-du-public) | Grand froid |
| [Service public — solutions d’hébergement (115)](https://www.service-public.gouv.fr/particuliers/vosdroits/F2003) | Grand froid |
| [Enedis — dépannage et urgences](https://www.enedis.fr/aide-contact/depannage-et-urgences) | Plus d’électricité |
| [Ministère de la Santé — eau du robinet](https://sante.gouv.fr/sante-et-environnement/eaux/article/eau-du-robinet) | Eau indisponible |
| [Sécurité civile — kit d’urgence 72 h](https://www.securite-civile.interieur.gouv.fr/reagir/comment-se-preparer-face-aux-risques/kit-durgence) | Eau indisponible, Réseau indisponible, Préparer un départ |
| [Service public — numéros d’urgence](https://www.service-public.gouv.fr/particuliers/vosdroits/F33954) | Réseau indisponible, Les numéros ne répondent pas |
| [info.gouv.fr — guide « Tous responsables » et kit d’urgence](https://www.info.gouv.fr/risques/se-preparer-a-une-situation-durgence) | Les numéros ne répondent pas, Tir de missile, frappe ou bombardement, Conflit armé : que faire ?, Choisir son abri à l’avance |
| [Sécurité civile — système d’alerte des populations](https://www.securite-civile.interieur.gouv.fr/reagir/comment-se-preparer-face-aux-risques/systeme-dalerte-des) | Sirène ou FR-Alert, Tir de missile, frappe ou bombardement, Conflit armé : que faire ?, Choisir son abri à l’avance |
| [FR-Alert](https://fr-alert.gouv.fr) | Sirène ou FR-Alert |
| [Sécurité civile — accident industriel](https://www.securite-civile.interieur.gouv.fr/reagir/risques-majeurs/accident-industriel) | Alerte industrielle |
| [Sécurité civile — accident nucléaire](https://www.securite-civile.interieur.gouv.fr/reagir/risques-majeurs/accident-nucleaire) | Accident nucléaire |

## 3. Ce qui n’a PAS été vérifié

- **Téléphones réels.** Aucun essai sur un vrai téléphone : ni la lampe (torche de la caméra), ni la vibration, ni la lecture de vrais bips ou de vrais flashs entre deux téléphones, ni le GPS et les capteurs d’orientation réels. Ces fonctions ont été vérifiées avec des signaux, des périphériques et des capteurs simulés. La lampe est le point le plus incertain : elle dépend du téléphone et du navigateur, et sur iPhone elle est le plus souvent indisponible.
- **Safari et iPhone.** Le moteur WebKit n’est pas disponible dans l’environnement de test : le comportement sur iPhone (installation, stockage, boutons de partage, capteurs) a été prévu d’après la documentation et simulé, pas observé.
- **Lecteurs d’écran.** Les noms, titres et le clavier sont contrôlés automatiquement ; VoiceOver et TalkBack n’ont pas été essayés.
- **Site publié.** Ce document décrit la version construite localement ; le comportement sur l’adresse publique doit être revérifié après chaque publication.
- **Nutrition.** Les valeurs du catalogue d’aliments sont des moyennes indicatives, non certifiées.

## 4. Principes de sécurité de l’information

Aucun envoi de données, aucune bibliothèque externe, politique de sécurité (CSP) sans exception dangereuse, sauvegardes assainies à l’import, micro, caméra et position arrêtés en quittant l’outil ou quand la page est masquée.
