# VAULT

Application web de préparation aux situations d’urgence : stock et autonomie, checklist 72 h, numéros d’urgence français, guides, profil et mode Low Profile.

Lien public : https://arise-detox.github.io/vault/

## Inventaire alimentaire et nutrition

Dans Stock / Autonomie, sélectionner « Par aliment — mon inventaire ». Ajouter le nombre d’unités, le poids consommable par unité et les valeurs de l’étiquette pour 100 g : calories, protéines, glucides, lipides, fibres et sel. Les nutriments facultatifs laissés vides sont inconnus ; les totaux incomplets sont signalés.

Cocher « En stock » pour compter une ligne ; les aliments décochés restent dans la liste d’achats. Le filtre « sans cuisson » exclut les aliments nécessitant une cuisson. Les dates sont des rappels à vérifier, sans certification de sécurité alimentaire. Modifier, supprimer ou ajuster les unités actualise les calculs.

Le calcul par aliment remplace la saisie globale, sans additionner les deux. Les anciens stocks restent en mode global lors de la mise à jour. Les apports par personne et par jour correspondent à une répartition des réserves sur l’objectif choisi ; ils ne représentent pas une recommandation nutritionnelle. L’autonomie alimentaire reste une estimation calorique. Vitamines et minéraux ne sont pas évalués.

## Guides par situation

Dix parcours : panne électrique, eau indisponible, inondation, incendie, alerte industrielle, forte chaleur, grand froid, séisme, préparation d’un départ et réseau indisponible. Cinquante étapes et vingt-deux questions avec plusieurs réponses orientent les actions. Retour à l’étape précédente, redémarrage, actions à cocher et raccourcis vers les modules ou les secours.

Les coches des guides ne sont conservées que dans la session courante et sont effacées en changeant de situation ou en recommençant. Les consignes locales et celles des secours priment. Les sources officielles sont liées dans chaque parcours ; leur consultation demande une connexion. Les textes des parcours sont inclus dans le cache hors ligne.

## Signal Morse

Émission par flashes de l’écran. Réception des bips au microphone ou des flashes avec la caméra. Vitesse du point réglable et traduction de points/traits saisis. Le lecteur a été testé sur des signaux simulés ; un échange réel entre téléphones reste à valider.

## Écoute acoustique

Analyse spectrale locale du niveau du microphone, de la fréquence dominante et des harmoniques. Cette analyse expérimentale ne confirme ni n’exclut la présence d’un drone ; des moteurs, ventilateurs et véhicules peuvent produire des signatures proches.

## Confidentialité et utilisation

Les réserves, la checklist et le profil restent dans le stockage local du navigateur (`vaultState`). Aucun compte applicatif nécessaire. Les signaux reçus ne sont pas conservés après rechargement. Aucun son ni aucune image ne sont enregistrés ou envoyés.

Microphone et caméra : accès seulement après action explicite et autorisation du navigateur. Arrêt automatique en quittant le module ou en masquant la page. HTTPS ou localhost nécessaire.

Les modules sont mis en cache pour l’utilisation hors ligne après un premier chargement réussi. Les appels et SMS nécessitent un service téléphonique disponible. Le signal émis utilise l’écran, pas la torche.

## GitHub Pages

Publication de la branche `main`, dossier `/ (root)`. Le fichier `.nojekyll` permet de servir directement les fichiers statiques.

Sur iPhone : ouvrir le site dans Safari, puis Partager → Sur l’écran d’accueil.

Une nouvelle adresse possède son propre stockage : les données enregistrées dans l’aperçu localhost ne sont pas transférées automatiquement sur GitHub Pages.
