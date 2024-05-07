document.addEventListener('DOMContentLoaded', function() {
    const gridContainer = document.getElementById('calendar-grid');
    const totalCells = 33;

    // Viikko grid solu generointi for loopilla
    for (let i = 21; i <= totalCells; i++) {
        const cell = document.createElement('div');
        cell.classList.add('calendar-cell');
        cell.textContent = `Viikko ${i}`;
        cell.onclick = function() {
            openDialog(i);
        };
        gridContainer.appendChild(cell);
    }

    document.querySelector('.close-button').addEventListener('click', function() {
        document.getElementById('event-dialog').classList.replace('dialog-visible', 'dialog-hidden');
    });
});

function openDialog(weekNumber) {
    fetch('events.json')
    .then(response => response.json())
    .then(data => {
        const eventInfo = data.events.find(event => event[weekNumber]);
        const { title, description, coordinates } = eventInfo[weekNumber];

        document.getElementById('event-title').textContent = title;
        document.getElementById('event-description').textContent = description;
        document.getElementById('event-image').src = "path_to_images/" + weekNumber + ".jpg"; // esimerkki kuvapolusta

        document.getElementById('event-dialog').classList.replace('dialog-hidden', 'dialog-visible');
        loadMap(coordinates);
    })
    .catch(error => console.error('Error loading the event data:', error));
}

async function loadMap(coordinates) {
    const [lat, lng] = coordinates.split(", ");
    const position = { lat: parseFloat(lat), lng: parseFloat(lng) };

    // Request needed libraries.
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    // The map, centered at position
    map = new Map(document.getElementById("event-map"), {
        zoom: 15,
        center: position,
        mapId: "DEMO_MAP_ID",  // Vaihda DEMO_MAP_ID sopivaan arvoon
    });

    // The marker, positioned at position
    const marker = new AdvancedMarkerElement({
        map: map,
        position: position,
        title: "Event Location"  // Voit mukauttaa otsikkoa
    });
}