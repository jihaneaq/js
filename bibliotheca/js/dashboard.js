document.addEventListener("DOMContentLoaded", () => {
    const livres = getData("livres") || [];
    const auteurs = getData("auteurs") || [];

    // --- 1. Mise à jour des KPI ---
    document.getElementById("nbLivres").textContent = livres.length;
    document.getElementById("nbAuteurs").textContent = auteurs.length;

    const genresUniques = [...new Set(livres.map(l => l.genre).filter(g => g))];
    document.getElementById("nbGenres").textContent = genresUniques.length;

    if (livres.length > 0) {
        const annees = livres.map(l => parseInt(l.annee)).filter(a => !isNaN(a));
        document.getElementById("anneeRecente").textContent = annees.length > 0 ? Math.max(...annees) : "—";
    }

    // --- 2. Calcul pour Chart.js ---
    const stats = {};
    livres.forEach(l => {
        const g = l.genre || "Inconnu";
        stats[g] = (stats[g] || 0) + 1;
    });

    const ctx = document.getElementById('genreChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut', // Type de graphique (Cercle)
        data: {
            labels: Object.keys(stats),
            datasets: [{
                data: Object.values(stats),
                backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
});