# Suivi de construction du site

1. J'ai créé les fichiers suivant: index.html, maps.json, README.md et style.css et comme dossier assets maps et toute les images de chaque maps.
2. Ensuite j'ai construit la base en html et j'ai attribué une identité javascript a chacune des photos présentes dans mon dossier assets into maps.
3. J'ai créé un fichier app.js et attribué une identité "maps" à une balise div.
4. J'ai alors créé un fichier maps.js, un petit cerveau qui servira a toute les opérations lié aux images maps. Il servira notamment à charger maps.json (maps.json étant seulement une boite sans âme et inactive qui ne sert qu'à stocker mes images).
5. J'ai créé une variable dans mon fichier app.js et j'y ai rentré la section div maps d'html.
6. Toujours dans maps.js j'ai chargé le fichier maps.json avec la commande
   fetch("maps.json").
7. Ensuite j'ai écrit .then((response) => response.json()) qui transforme la réponse brute en données utilisables (tableau d’objets)
8. et .then((maps) => {
   console.log(maps);
   });
   En gros c'est la que je vais coder toute mes variables si j'ai bien compris.
9. J'ai vérifié dans la console du navigateur et je vois bien mon tableau json!
10. J'ai donc écrit à l'intérieur un paragraphe de code qui, pour chaque map, crée un paragraphe (p) et qui se renomme selon le nom de la map et ensuite ce paragraphe est ajouté dans la section div id="maps" aka #maps en javascript.
    Résultat: Je vois une liste des noms de maps s’afficher dans la page (en <p>)
    Premier affichage dynamique réussi!
11. Bon la 10. c'était juste pour tester que j'arrivais bien à parcourir le fichier maps.json, et que les noms de maps s'affichaient bien dans l'HTML.
12. Maintenant on va supprimer (p) et on va écrire la ligne suivante: const mapCard = document.createElement("div"); qui va créer un encadré js sous la forme d'une balise div.
13. Ensuite j'écris mapCard.classList.add("map-card"); pour créer une classe de cette balise div que je viens de créer. C'est exactement comme si j'avais écrit < div class="map-card" > en html. Mais alors pourquoi faire ça dans mon fichier javascript? Et bien pour <strong>automatiser</strong> la création d'encadré pour chaque map.
14. Passons-y à l'étape d'automatisation justement parce que pour l'instant nous n'avons que créé une balise et attribué à cette dernière une classe. N'importe qui aurait pu faire ça en html.
    On écrit donc:
    const img = document.createElement("img");
    img.src = map.image;
    img.alt = map.name;
    equivalent de < img src="x" alt="x" >
    Et const title = document.createElement("p");
    title.textContent = map.name;
    équivalent de < p textContent="x" >
15. mapCard.appendChild(img);
    mapCard.appendChild(title);
    mapsContainer.appendChild(mapCard);
    Ici, title et img sont les enfants de mapCard qui lui même est l'enfant de maps.Container
    Résultat: Mes images s'affichent automatiquement dans ma page html!
16. Ensuite j'ai ajouté une image de fond (toute les explications en \*/)
17. En css j'ai resize les dimensions du cadre et des photos.
18. J'ai également créé un petit encadré en bas pour le texte donc et ai ajouté la font bluenight.
19. quelques modifs concernant justify-content: left pour les cadres et minimisé l'espace entre les cartes et ajouté en css dans #maps {display: flex;} ce qui active un flexbox et ainsi les cartes passent à la ligne selon taille ecran.
20. Ensuite j'ai commencé à m'attaquer au tableau de tiers liste donc j'ai créé un nouveau fichier js que j'ai appelé tierlist.js. J'ai créé mon tableau en faisant const tiers = [ A B C D ]
21. J'ai relié ce tableau à ma div html "tier-list"
22. puis j'ai créé une boucle qui crée a chaque tour:
    tierRow comme une étagère entière
    tierTitle comme l’étiquette de l’étagère (“S”, “A”, “B”…)
    tierCards comme l’espace où tu poses les livres, ici les cartes de maps!
23. Enfin, j'ai créé une hierarchie en mettant le titre et l'espace pour les carte comme enfant de l'étagère et j'ai set l'étagère comme enfant de ListContainer qui serait ici la maison.
24. Evidemment ne pas oublier:< script src="js/tierlist.js"> pour lier dans html le fichier js !
25. ensuite j'ai créé un fichier css pour mon tableau tier list et ça commence à s'afficher élément par élément.
26. J'ai delete l'appendChild de title, la fonction pour nommer a partir du site les images et j'ai stylisé dans photoshop directement le nom dans l'image et j'en ai profité pour custom un peu l'image des cartes.
27. J'ai modifié le tableau en supprimant les marges, modifié size texte boxs et obligé un retour à la ligne qd ça dépasse la box.
28. Rendu le fond du tableau transparent et background flou que sous le tableau.
29. Concernant le drag:
    -J'ai ajouté dans maps.js un attribut draggable true
    -J'ai ajouté un écouteur d'evenement (if dragstart)
    -J'ai attribué un id unique pour chaque carte map
30. Concernant le drop:
    -J'ai ensuite créé une ligne pour récupérer l'id
    -Une pour récupérer l'élément HTML
    -Et enfin une pour déplacer la carte
31. Ensuite j'ai fait en sorte de pouvoir deplacer les cartes à gauche et à droite au sein même du tableau en fonction de la position du curseur lors du dragging
32. J'ai ajouté un bouton qui permet de sauvegarder la tier list sous le format d'une image png.
33. J'ai créé un tableau json pour héberger ma 2ème tier list qui concernera les bows.
34. Je duplique l'index.html de la page maps puis je le personalise pour héberger dans le futur ma bow tier list.
35. Je crée mes boutons icones puis je relie les deux pages via ces boutons nav à l'interieur du dvi container du tableau tier list pour pouvoir le centrer.
36. Enfin, j'écris la ligne const pageName = window.location.pathname.split("/").pop().toLowerCase(); pour détecter automatiquement la page de mon site et me permettre d'ensuite mettre une condition: si nom de la page = bow-tier alors appliquer le tableau bows.json sinon appliquer maps.json par defaut.
37. Ajout 3ème Tier-list des melees.
38. Ajouté les alt maps.
39. Ajouté des textes a gauches des boutons des tier list et à droite du bouton download.
40. Ajouté tier list arrows
41. Ajouté la tier list skins + modifié fond cartes arrows
42. J’ai restructuré tout mon site pour obtenir des URLs propres sans .html.J’ai créé un dossier /pages à la racine, et dedans j’ai mis :
/pages/map-tierlist/, /pages/bow-tierlist/, /pages/melee-tierlist/, /pages/arrow-tierlist/, /pages/skin-tierlist/, chacun contenant un index.html.
43. J’ai mis à jour mon index.html principal pour qu’il redirige automatiquement vers la page d’accueil propre :
/*<meta http-equiv="refresh" content="0; url=/pages/map-tierlist/" />*/
44. J’ai corrigé tous les chemins dans mes pages HTML pour qu’ils fonctionnent depuis un sous-dossier : CSS → /css/style.css JS → /js/nav.js, /js/tierlist.js, /js/cards.js
Images → /assets/... Tous les chemins sont maintenant absolus, ce qui évite les erreurs 404.
45. J’ai réécrit entièrement mon nav.js pour qu’il génère automatiquement la navigation avec les bons liens : /pages/map-tierlist/, /pages/bow-tierlist/, etc.
Plus besoin de répéter le menu dans chaque page.
46. J’ai corrigé mon cards.js pour qu’il fonctionne depuis n’importe quel dossier :
    -Les JSON sont maintenant chargés via des chemins absolus (/js/maps.json, etc.)
    -Les images sont automatiquement corrigées pour pointer vers /assets/...
    -Le drag & drop mobile + desktop continue de fonctionner parfaitement.
47. J’ai vérifié que mes tier lists (maps, bows, melees, arrows, skins) se chargent correctement depuis leurs nouveaux dossiers /pages/.../index.html.
48. J’ai validé que les cartes s’affichent à nouveau correctement après la restructuration, grâce aux corrections dans cards.js et aux chemins absolus.
49. J’ai maintenant une architecture propre, scalable et professionnelle, avec :
    -des URLs propres
    -une navigation centralisée
    -des scripts et assets accessibles depuis n’importe où
    -un code beaucoup plus facile à maintenir et à faire évoluer.
50. Début du backend : création de la base MySQL n1tier et de la table users.
51. Ajout d’un popup de connexion dynamique permettant de choisir la méthode d’authentification (Discord pour l’instant), entièrement généré et contrôlé en JavaScript.
52. Création de discord-login.php pour lancer l’authentification OAuth2 Discord.
53. Création de discord-callback.php pour récupérer le token, les infos utilisateur, insérer ou mettre à jour l’utilisateur en base, puis créer la session PHP.
54. Création de me.php, endpoint JSON permettant au front de connaître l’état de connexion.
55. Création de logout.php pour détruire la session et renvoyer vers le front.
56. Mise en place de auth.js pour gérer automatiquement le bouton LOGIN/LOGOUT selon la session.
57. Injection dynamique du bouton dans nav.js pour garantir l’ordre d’exécution.
58. Activation de Access-Control-Allow-Credentials dans tous les fichiers backend.
59. Validation du flux complet : bouton LOGIN → pop up choix connexion → login Discord → callback → session → retour front → bouton LOGOUT.
60. Refonte complète des pages de tierlist pour une cohérence totale (map/bow/arrow/skin/melee).
61. Implémentation de l’authentification Discord OAuth2 avec stockage de l’URL complète de l’avatar.
62. Ajout du workflow SHARE (html2canvas → API → écrasement automatique en base).
63. Création du tableau de bord communautaire avec aperçu en direct des tierlists.
64. Correction des problèmes de CORS, de routage et de types MIME sur l’ensemble du projet.
65. Ajout du système de votes en temps réel (upvote/downvote) avec icônes SVG et états actifs.
66. Implémentation de la mise à jour dynamique du score sans rechargement de page (frontend + backend synchronisés).
67. Correction des problèmes de désynchronisation du score en normalisant les valeurs numériques au chargement.
69. Amélioration du système de dropdown custom pour les filtres (catégorie/tri) avec synchronisation automatique.
70. Ajout de la logique d’écrasement automatique par type de tierlist (map/bow/arrow/skin/melee).
77. Normalisation du score au chargement pour éviter les concaténations de chaînes (“11”, “02”, etc.).
81. Mise en place du tri Popular par défaut pour améliorer l’expérience utilisateur sur le dashboard.


