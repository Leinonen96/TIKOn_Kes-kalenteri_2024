document.addEventListener('DOMContentLoaded', function() {
    const gridContainer = document.getElementById('calendar-grid');
    const totalCells = 33;

    // Generate week grid cells
    for (let i = 21; i <= totalCells; i++) {
        const cell = document.createElement('div');
        cell.classList.add('calendar-cell');
        cell.textContent = `Viikko ${i}`;

        // Bind a click handler that checks condition before opening dialog
        cell.onclick = function() {
            checkConditionAndApplyImage(i, cell);
            openDialog(i);
        };

        gridContainer.appendChild(cell);
    }

    document.querySelector('.close-button').addEventListener('click', function() {
        closeDialog();
    });
});

function checkConditionAndApplyImage(index, cell) {
    let boolean1 = true
    if (boolean1) {
        applyImageToCell(cell, index);
    }
}

function applyImageToCell(cell, index) {
    // Adding an image to the cell
    const imageUrl = `Kalenteri_kuvat/${index}.png`; // Assume this is the correct path
    const imgElement = document.createElement('img');
    imgElement.src = imageUrl;
    imgElement.alt = 'Kuva viikolle ' + index;

    // Apply CSS to ensure the image fits within the cell
    imgElement.style.width = '100%';   // Makes the image width equal to the cell width
    imgElement.style.height = 'auto';  // Keeps the image height proportional
    imgElement.style.maxHeight = '100%'; // Ensures the image height does not exceed the cell height

    cell.innerHTML = ''; // Clear the cell content
    cell.appendChild(imgElement); // Set the cell image to the image element
}

function openDialog(weekNumber) {
    fetch('events.json')
    .then(response => response.json())
    .then(data => {
        const eventInfo = data.events.find(event => event[weekNumber]);
        const { title, description, coordinates } = eventInfo[weekNumber];

        document.getElementById('event-title').textContent = title;
        document.getElementById('event-description').textContent = description;
        document.getElementById('event-image').src = "Kalenteri_kuvat/" + weekNumber + ".png"; // esimerkki kuvapolusta

        document.getElementById('event-dialog').classList.replace('dialog-hidden', 'dialog-visible');
        loadMap(coordinates);
    })
    .catch(error => console.error('Error loading the event data:', error));
}

function closeDialog() {
    const dialog = document.getElementById('event-dialog');
    dialog.classList.replace('dialog-visible', 'dialog-hidden');
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