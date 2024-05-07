document.addEventListener('DOMContentLoaded', function () {
    const gridContainer = document.getElementById('calendar-grid');
    const totalCells = 33;

    // Generate week grid cells
    for (let i = 21; i <= totalCells; i++) {
        const cell = document.createElement('div');
        cell.classList.add('calendar-cell');
        cell.textContent = `Viikko ${i}`;

        // Bind a click handler that checks condition before opening dialog
        cell.onclick = function () {
            checkConditionAndApplyImage(i, cell);
            openDialog(i);
        };

        gridContainer.appendChild(cell);
    }

    document.querySelector('.close-button').addEventListener('click', function () {
        closeDialog();
    });
});

// Checks a condition and applies an image to the cell if the condition is true
function checkConditionAndApplyImage(index, cell) {
    let boolean1 = true;
    if (boolean1) {
        applyImageToCell(cell, index);
    }
}

// Applies an image to the given cell
function applyImageToCell(cell, index) {
    const datePicker = document.getElementById('fake-date-picker');
    const selectedDate = new Date(datePicker.value);
    const selectedWeekNumber = getCurrentWeekNumber(selectedDate);
    const currentWeekNumber = getCurrentWeekNumber(new Date());

    let dateOk = selectedWeekNumber >= currentWeekNumber;

    if (dateOk) {
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
    dateOk = false;
}

// Opens a dialog with event information for the given week number
function openDialog(weekNumber) {
    let dateOk = true;
    if (dateOk || getCurrentWeekNumber() === weekNumber) {
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

}

// Closes the dialog
function closeDialog() {
    const dialog = document.getElementById('event-dialog');
    dialog.classList.replace('dialog-visible', 'dialog-hidden');
}

// Loads a map with the given coordinates
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

function getCurrentWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear + ((firstDayOfYear.getDay() + 6) % 7 * 86400000)) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay()) / 7);
}

document.getElementById('fake-date-toggle').addEventListener('change', function() {
    const datePicker = document.getElementById('fake-date-picker');
    datePicker.disabled = !this.checked;
});