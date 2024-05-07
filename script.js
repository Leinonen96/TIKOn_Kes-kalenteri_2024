// Tämä on JavaScript-tiedosto, joka sisältää kaiken tarvittavan toiminnallisuuden kalenterin luomiseen ja tapahtumien käsittelyyn.
document.addEventListener("DOMContentLoaded", function () {
  const gridContainer = document.getElementById("calendar-grid");
  const totalCells = 33;

  // Generoi viikkoruudut
  for (let i = 21; i <= totalCells; i++) {
    const cell = document.createElement("div");
    cell.classList.add("calendar-cell");
    cell.textContent = `Viikko ${i}`;

    // Liitä klikkaustapahtumankäsittelijä, joka tarkistaa ehtoa ennen dialogin avaamista
    cell.onclick = function () {
      applyImageToCell(cell, i);
      openDialog(i);
    };

    gridContainer.appendChild(cell);
  }

  document
    .querySelector(".close-button")
    .addEventListener("click", function () {
      closeDialog();
    });
});

// Aseta kuva soluun, jos nykyinen viikko on suurempi tai yhtä suuri kuin indeksi
function applyImageToCell(cell, index) {
  const currentWeekNumber = getCurrentWeekNumber(new Date());
  // Tarkista valintaruudun tila oikein
  let dateOk = document.getElementById("fake-date-toggle").checked;

  // Ehto, joka tarkistaa, onko nykyinen viikkonumero suurempi tai yhtä suuri kuin indeksi tai onko valintaruutu valittuna
  if (currentWeekNumber >= index || dateOk) {
    // Lisää kuva soluun
    const imageUrl = `Kalenteri_kuvat/${index}.png`; // Olettaen, että tämä on oikea polku
    const imgElement = document.createElement("img");
    imgElement.src = imageUrl;
    imgElement.alt = "Kuva viikolle " + index;

    // Aseta CSS varmistaaksesi, että kuva mahtuu soluun
    imgElement.style.width = "100%"; // Kuva leveys on yhtä suuri kuin solun leveys
    imgElement.style.height = "auto"; // Kuva korkeus säilyy suhteellisena
    imgElement.style.maxHeight = "100%"; // Kuva korkeus ei ylitä solun korkeutta
    imgElement.style.borderRadius = "20px"; /* Adds rounded corners */
    imgElement.style.border = "1px solid #ccc"; /* Adds a subtle border */

    cell.innerHTML = ""; // Tyhjennä solun sisältö
    cell.appendChild(imgElement); // Aseta solun kuva kuva-elementtiin
  }
}

// Avaa dialogi tapahtumatiedoin annetulle viikkonumerolle
function openDialog(weekNumber) {
  const currentWeekNumber = getCurrentWeekNumber(new Date());
  let dateOk = document.getElementById("fake-date-toggle").checked;
  if (currentWeekNumber >= weekNumber || dateOk) {
    fetch("events.json")
      .then((response) => response.json())
      .then((data) => {
        const eventInfo = data.events.find((event) => event[weekNumber]);
        const { title, description, coordinates } = eventInfo[weekNumber];

        document.getElementById("event-title").textContent = title;
        document.getElementById("event-description").textContent = description;
        document.getElementById("event-image").src =
          "Kalenteri_kuvat/" + weekNumber + ".png";

        document
          .getElementById("event-dialog")
          .classList.replace("dialog-hidden", "dialog-visible");
        loadMap(coordinates);
      })
      .catch((error) =>
        console.error("Virhe tapahtumatietojen lataamisessa:", error)
      );
  }
}

// Sulje dialogi
function closeDialog() {
  const dialog = document.getElementById("event-dialog");
  dialog.classList.replace("dialog-visible", "dialog-hidden");
}

// Lataa kartta annetuilla koordinaateilla
async function loadMap(coordinates) {
  const [lat, lng] = coordinates.split(", ");
  const position = { lat: parseFloat(lat), lng: parseFloat(lng) };

  // Pyytää tarvittavat kirjastot.
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  // Kartta, keskitettynä annettuihin koordinaatteihin
  map = new Map(document.getElementById("event-map"), {
    zoom: 15,
    center: position,
    mapId: "DEMO_MAP_ID",
  });

  // Merkki, sijoitettuna annettuihin koordinaatteihin
  const marker = new AdvancedMarkerElement({
    map: map,
    position: position,
    title: "Tapahtuman sijainti",
  });
}

// Palauttaa nykyisen viikon numeron annetulle päivämäärälle
function getCurrentWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear =
    (date - firstDayOfYear + ((firstDayOfYear.getDay() + 6) % 7) * 86400000) /
    86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay()) / 7);
}
