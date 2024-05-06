document.addEventListener('DOMContentLoaded', function() {
    const gridContainer = document.getElementById('calendar-grid');
    const totalCells = 25; // Esimerkissä 13 viikkoa kesäkalenterille

    for (let i = 13; i <= totalCells; i++) {
        const cell = document.createElement('div');
        cell.classList.add('calendar-cell');

        cell.textContent = `Viikko ${i}`;
        cell.onclick = function() { alert(`Tapahtumat viikolle ${i}`); };
        
        gridContainer.appendChild(cell);
    }
});