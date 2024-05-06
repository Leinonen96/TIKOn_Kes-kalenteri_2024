document.addEventListener('DOMContentLoaded', function() {
    const gridContainer = document.getElementById('calendar-grid');
    const totalCells = 25;

    // Viikko grid solu generointi for loopilla
    for (let i = 13; i <= totalCells; i++) {
        const cell = document.createElement('div');
        cell.classList.add('calendar-cell');

        // Viikko solun teksti
        cell.textContent = `Viikko ${i}`;
        // Viikko solun klikkaus eventti
        // Tämän sisälle laitettaan tapahtuman kutsu
        cell.onclick = function() { alert(`Tapahtumat viikolle ${i}`); }; 

        gridContainer.appendChild(cell);
    }
});