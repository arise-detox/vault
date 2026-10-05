# VAULT

Application web de préparation aux situations d’urgence : stock et autonomie, checklist 72 h, numéros d’urgence français, guides, profil et mode Low Profile.

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
