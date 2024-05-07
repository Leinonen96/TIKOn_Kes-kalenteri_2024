document.addEventListener('DOMContentLoaded', function() {
    const gridContainer = document.getElementById('calendar-grid');
    const totalCells = 33;

    // Viikko grid solu generointi for loopilla
    for (let i = 21; i <= totalCells; i++) {
        const cell = document.createElement('div');
        cell.classList.add('calendar-cell');

        // Viikko solun teksti
        cell.textContent = `Viikko ${i}`;

        // Viikko solun klikkaus eventti
        cell.onclick = function() {
            openDialog(i - 21);  // Kutsu openDialogia viikon indeksillä, indeksi alkaa nollasta
        };

        gridContainer.appendChild(cell);
    }

    // Oletetaan, että sinulla on määriteltynä sulje-painike dialogissasi
    document.querySelector('.close-button').addEventListener('click', function() {
        document.getElementById('event-dialog').classList.replace('dialog-visible', 'dialog-hidden');
    });
});

// openDialog-funktio määritelty täällä tai muualla scriptissä
function openDialog(weekIndex) {
    var eventInfo = {
        title: `Tapahtumat viikolle ${weekIndex + 21}`, // Lisätään 21 saadaksemme oikean viikon numeron
        description: "Tapahtuman kuvaus tähän...",
        imageUrl: "image_url.jpg",
        location: { lat: 60.192059, lng: 24.945831 } // Esimerkkikoordinaatit
    };

    document.getElementById('event-title').textContent = eventInfo.title;
    document.getElementById('event-description').textContent = eventInfo.description;
    document.getElementById('event-image').src = eventInfo.imageUrl;

    document.getElementById('event-dialog').classList.replace('dialog-hidden', 'dialog-visible');

    // Oletetaan, että loadMap on määritelty ja käytät Google Maps API:a
    loadMap(eventInfo.location);
}

// Esimerkkikoodi kartan lataamiselle (loadMap-funktio)
function loadMap(location) {
    var map = new google.maps.Map(document.getElementById('event-map'), {
        center: location,
        zoom: 15
    });

    new google.maps.Marker({
        position: location,
        map: map
    });
}
