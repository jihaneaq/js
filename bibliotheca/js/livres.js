const formLivre = document.getElementById("formLivre");
const listeLivres = document.getElementById("listeLivres");
const selectAuteur = document.getElementById("auteur");
const inputRecherche = document.getElementById("inputRecherche");

let editIndex = null;

// --- CHARGEMENT DES AUTEURS (Lien avec Module 2) ---
function chargerAuteurs() {
    const auteurs = getData("auteurs") || [];
    selectAuteur.innerHTML = `<option value="">-- Choisir un auteur --</option>`;
    auteurs.forEach(a => {
        selectAuteur.innerHTML += `<option value="${a.nom}">${a.nom}</option>`;
    });
}

// --- AFFICHAGE AVEC RECHERCHE ET TRI (Module 1) ---
function afficherLivres(filtre = "") {
    let livres = getData("livres") || [];

    // 1. Recherche par mot-clé (Titre, Auteur ou Genre)
    if (filtre) {
        livres = livres.filter(l => 
            l.titre.toLowerCase().includes(filtre.toLowerCase()) || 
            l.auteur.toLowerCase().includes(filtre.toLowerCase()) ||
            l.genre.toLowerCase().includes(filtre.toLowerCase())
        );
    }

    // 2. Tri par ordre alphabétique (Cahier des charges)
    livres.sort((a, b) => a.titre.localeCompare(b.titre));

    listeLivres.innerHTML = "";
    livres.forEach((livre, index) => {
        listeLivres.innerHTML += `
            <li class="card">
                <div class="info-livre">
                    <strong>${livre.titre}</strong><br>
                    <small>${livre.auteur} | ${livre.genre || 'Sans genre'}</small>
                </div>
                <div class="actions">
                    <button onclick="voirFiche(${index})" title="Voir fiche">👁️</button>
                    <button onclick="preparerModification(${index})" title="Modifier">✏️</button>
                    <button onclick="supprimerLivre(${index})" class="btn-delete" title="Supprimer">🗑️</button>
                </div>
            </li>
        `;
    });
}

// --- CRÉATION / MODIFICATION (CRUD COMPLET) ---
formLivre.addEventListener("submit", function (e) {
    e.preventDefault();
    const livres = getData("livres") || [];

    const nouveauLivre = {
        titre: document.getElementById("titre").value,
        auteur: document.getElementById("auteur").value,
        genre: document.getElementById("genre").value,
        annee: document.getElementById("annee").value
    };

    if (editIndex !== null) {
        livres[editIndex] = nouveauLivre;
        editIndex = null;
        formLivre.querySelector("button").textContent = "Ajouter le livre";
    } else {
        livres.push(nouveauLivre);
    }

    saveData("livres", livres);
    formLivre.reset();
    afficherLivres();
});

// --- FICHE DÉTAILLÉE (Cahier des charges) ---
window.voirFiche = function(index) {
    const livres = getData("livres");
    const livre = livres[index];
    
    // On utilise une simple alert stylisée ou on peut remplir une modale HTML
    alert(`📖 FICHE DÉTAILLÉE\n\nTitre : ${livre.titre}\nAuteur : ${livre.auteur}\nGenre : ${livre.genre}\nAnnée : ${livre.annee}`);
};

// --- MODIFICATION ---
window.preparerModification = function(index) {
    const livres = getData("livres");
    const livre = livres[index];

    document.getElementById("titre").value = livre.titre;
    document.getElementById("auteur").value = livre.auteur;
    document.getElementById("genre").value = livre.genre;
    document.getElementById("annee").value = livre.annee;

    editIndex = index;
    formLivre.querySelector("button").textContent = "Enregistrer les modifications";
    window.scrollTo(0, 0);
};

// --- SUPPRESSION AVEC CONFIRMATION (Cahier des charges) ---
window.supprimerLivre = function(index) {
    if (confirm("Voulez-vous vraiment supprimer ce livre de votre collection ?")) {
        const livres = getData("livres");
        livres.splice(index, 1);
        saveData("livres", livres);
        afficherLivres();
    }
};

// --- PARTIE ASYNCHRONE : API OPENLIBRARY (Module 3) ---
window.rechercherLivreAPI = function() {
    const query = document.getElementById("apiSearchInput").value;
    if (!query) return alert("Entrez un titre à chercher !");

    fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(query)}&limit=1`)
        .then(res => res.json())
        .then(data => {
            if (data.docs && data.docs.length > 0) {
                const b = data.docs[0];
                document.getElementById("titre").value = b.title;
                document.getElementById("genre").value = b.subject ? b.subject[0] : "";
                alert("✅ Données trouvées sur l'API ! Vérifiez l'auteur dans la liste.");
            } else {
                alert("Aucun résultat sur OpenLibrary.");
            }
        })
        .catch(err => console.error("Erreur API", err));
};

// --- RECHERCHE TEMPS RÉEL ---
if(inputRecherche) {
    inputRecherche.addEventListener("input", (e) => afficherLivres(e.target.value));
}

chargerAuteurs();
afficherLivres();