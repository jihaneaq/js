const formAuteur = document.getElementById("formAuteur");
const listeAuteurs = document.getElementById("listeAuteurs");

// --- AFFICHAGE DE LA LISTE (CRUD Simplifié) ---
function afficherAuteurs() {
    const auteurs = getData("auteurs") || [];
    listeAuteurs.innerHTML = "";

    auteurs.forEach((auteur, index) => {
        listeAuteurs.innerHTML += `
            <li class="card" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span><strong>${auteur.nom}</strong> (${auteur.nationalite || 'N/C'})</span>
                <button onclick="supprimerAuteur(${index})" class="btn-delete">🗑️</button>
            </li>
        `;
    });
}

// --- AJOUT D'UN AUTEUR ---
formAuteur.addEventListener("submit", function (e) {
    e.preventDefault();
    
    const nomAuteur = document.getElementById("nomAuteur").value.trim();
    const nationalite = document.getElementById("nationalite").value.trim();

    if (!nomAuteur) return;

    const auteurs = getData("auteurs") || [];
    
    // Vérification des doublons
    
    if (auteurs.some(a => a.nom.toLowerCase() === nomAuteur.toLowerCase())) {
        alert("Cet auteur existe déjà !");
        return;
    }

    auteurs.push({
        nom: nomAuteur,
        nationalite: nationalite
    });

    saveData("auteurs", auteurs);
    formAuteur.reset();
    afficherAuteurs();
});

// --- SUPPRESSION D'UN AUTEUR ---
window.supprimerAuteur = function(index) {
    if (confirm("Supprimer cet auteur ? Cela ne supprimera pas ses livres déjà enregistrés.")) {
        const auteurs = getData("auteurs") || [];
        auteurs.splice(index, 1);
        saveData("auteurs", auteurs);
        afficherAuteurs();
    }
};

// Lancement initial
afficherAuteurs();