# VAULT

Application web de préparation aux situations d’urgence : autonomie en eau, nourriture et énergie, kit 72 h, numéros d’urgence français, guides pas à pas, signal Morse et outils d’orientation. Elle fonctionne **hors ligne** et **rien ne quitte ton téléphone**.

Lien public : https://arise-detox.github.io/vault/

## Ce que contient VAULT 2

| Écran | Contenu |
| --- | --- |
| **Accueil** | Autonomie estimée (anneau eau / nourriture / énergie), score de préparation, actions prioritaires (dates dépassées, contrôles en retard, kit incomplet…), accès rapides. À la première ouverture, rien n’est supposé : l’accueil affiche 0 et propose quatre premiers pas. |
| **Préparer › Stock** | Réserves d’eau, de nourriture et d’énergie comparées à l’objectif en jours. Inventaire alimentaire avec dates DLC / DDM (une DLC dépassée n’est jamais comptée), apports en calories, protéines, glucides, lipides, fibres et sel, modèles d’aliments indicatifs, liste d’achats copiable ou imprimable. |
| **Préparer › Kit 72 h** | Checklist de 12 éléments de base, besoins du foyer (bébé, enfant, senior, animaux, santé), 14 compléments, éléments personnels, contrôles périodiques (eau, dates, piles, batterie, médicaments, documents) avec rappels. |
| **Préparer › Plan** | Contacts à prévenir, points de rendez-vous, emplacement des coupures (gaz, eau, électricité), documents ; plan imprimable. |
| **Guides** | 27 parcours en 6 catégories (danger immédiat, premiers secours, risques naturels, réseaux et ressources, alertes et départ, **guerre et conflit** : tir de missile, conflit armé, choix d’un abri), dont « Les numéros ne répondent pas » pour les catastrophes où les lignes saturent ; 31 sources officielles ; recherche, reprise d’un parcours interrompu, bouton d’appel du 112 sur les gestes vitaux ; impression d’un guide ou **dossier papier** (numéros, fiche d’urgence, plan, gestes qui sauvent) à ranger dans le kit. |
| **Urgences** | 112, 15, 17, 18, 114 par SMS, autres numéros utiles ; message prêt à lire ou à envoyer (nature, adresse, personnes, position GPS) ; fiche vitale (groupe sanguin, allergies, traitements, personne à prévenir) lisible en un geste et imprimable. |
| **Outils › Signal Morse** | Émettre par la lampe, le son et la vibration (ensemble ou séparément), lire des bips au microphone ou des flashs à la caméra, apprendre l’alphabet et traduire. |
| **Outils › Alarme sonore** | Sirène, signal de détresse en montagne (six coups par minute), balise. |
| **Outils › Écoute acoustique** | Niveau, fréquence dominante, spectre et observation prudente (expérimental). |
| **Outils › Position et boussole** | Coordonnées GPS à copier ou partager, boussole, points enregistrés (voiture, camp, point d’eau…) avec distance et cap, sans réseau. |
| **Outils › Codes** | Alphabets d’épellation (français, international), signaux de détresse, signes à tracer au sol. |
| **Réglages** | Thème automatique, sombre, clair, mode nuit (tout en rouge), Low Profile, taille du texte, sauvegarde et restauration, installation, mises à jour. |

## Confidentialité

- Aucun compte, aucune statistique, aucun cookie, aucun serveur : l’application n’envoie rien.
- Les données (stock, kit, contacts, fiche vitale, points) sont enregistrées dans le stockage du navigateur de ton téléphone. **Effacer les données du navigateur ou changer de téléphone efface aussi VAULT** : exporte de temps en temps une sauvegarde (Réglages) et garde-la ailleurs.
- Micro, caméra et position ne servent qu’à l’outil ouvert, après ton autorisation, sans enregistrement. Tout s’arrête en quittant l’outil, en changeant d’onglet ou quand la page est masquée.
- Politique de sécurité stricte (CSP) : aucun script externe, aucune requête vers un autre site.

## Hors ligne, installation, mises à jour

- Après une première visite, toute l’application (code, guides, icônes) est conservée sur le téléphone. Les liens vers les sources officielles demandent une connexion.
- **iPhone** : ouvre le site dans Safari, touche Partager, puis « Sur l’écran d’accueil ». **Android** : menu du navigateur, « Installer l’application ».
- Une nouvelle version est annoncée par un message ; tu choisis quand l’appliquer. Tes données sont conservées.
- Les données de la version précédente de VAULT (même adresse) sont reprises automatiquement.

## Limites à connaître

- **Lampe.** Le contrôle de la torche par un navigateur dépend du téléphone et du navigateur ; sur iPhone il est le plus souvent indisponible. VAULT vérifie la capacité annoncée par la caméra et le résultat des commandes, et le signale. Le son et la vibration restent utilisables (la vibration n’existe pas sur iPhone). L’écran ne clignote jamais.
- **Morse.** L’émission et la lecture ont été vérifiées sur des signaux simulés (chronologie de la lampe, bips et flashs de test, bruit de fond). Un échange réel entre deux téléphones n’a pas encore été validé : fais d’abord un essai avec un proche.
- **GPS et boussole.** Vérifiés avec des positions et des capteurs simulés. La boussole indique le nord magnétique ; en France l’écart avec le nord géographique n’est que de quelques degrés.
- **Guides.** Ils résument les sources officielles citées dans chaque parcours (Sécurité civile, ministère de l’Intérieur, info.gouv.fr, Croix-Rouge, GRDF), vérifiées le 05/10/2026. Ils ne remplacent ni une formation aux gestes qui sauvent (PSC1), ni les consignes des secours ou des autorités, qui priment toujours. En cas de doute ou de danger : 112.
- **Nutrition.** Les valeurs du catalogue d’aliments sont des moyennes indicatives : remplace-les par celles de l’étiquette. Les calories ne décrivent pas une alimentation équilibrée.
- **Écoute acoustique.** Expérimentale : elle ne confirme ni n’exclut la présence d’une source précise (drone, moteur…).

## Accessibilité

Navigation au clavier, fenêtres avec piégeage du focus, noms accessibles sur toutes les commandes, cibles tactiles d’au moins 36 px, texte agrandissable jusqu’à 140 %, respect de la préférence « réduire les animations », contrastes contrôlés dans les quatre ambiances (sombre, clair, nuit, Low Profile).

## Crédits

Icônes [Lucide](https://lucide.dev) (licence ISC). Aucune police ni bibliothèque n’est téléchargée. Voir `VERIFICATION.md` pour le détail des contrôles effectués.
