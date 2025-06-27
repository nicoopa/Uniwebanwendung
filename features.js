document.getElementById('ausgabeForm').addEventListener('submit', (e) => {
    e.preventDefault(); // verhindert Neuladen der Seite

    const name = document.getElementById('name').value;
    const datum = document.getElementById('datum').value;
    const kosten = parseFloat(document.getElementById('kosten').value);
    const kategorie = document.getElementById('kategorie').value;

    neueAusgabe(name, datum, kosten, kategorie);
    // Ansicht aktualisieren

    document.querySelector("#ausgabenImMonat").innerHTML = `${ausgabenMonat()} €`;
    zeigeAusgaben();
    saldoletzterMonat();
    // Optional: Formular zurücksetzen
    e.target.reset();
});
window.addEventListener("DOMContentLoaded", () => {
    // Ausgaben im Monat direkt anzeigen
    const monatSumme = ausgabenMonat().toFixed(2);
    document.getElementById("ausgabenImMonat").textContent = `${monatSumme} €`;
    // Auch die letzten 5 Einträge anzeigen
    zeigeAusgaben();
    saldoletzterMonat();
});
const neueAusgabe = (name, datum, kosten, kategorie) => {

    const neuesAusgabenJSONobjekt = {
        name,
        datum,
        kosten: parseFloat(kosten),
        kategorie,
    }

    const aktuelleAusgaben = window.localStorage.getItem('ausgaben') ? Array.from(JSON.parse(window.localStorage.getItem('ausgaben'))) : []
    aktuelleAusgaben.push(neuesAusgabenJSONobjekt)
    window.localStorage.setItem("ausgaben", JSON.stringify(aktuelleAusgaben))

}
//Berechnung der Ausgaben vom letzten Monat
const ausgabenMonat = () => {

    const alleAusgaben = window.localStorage.getItem('ausgaben') ? Array.from(JSON.parse(window.localStorage.getItem('ausgaben'))) : []
    const date = new Date().getTime()
    const monat = 60 * 60 * 24 * 30* 1000

    const neuesAusgabenJSONobjekt = alleAusgaben.filter(value => {
        const valueDate = new Date(`${value.datum}T00:00:00`).getTime();
        return (date - monat) <= valueDate && valueDate <= date

    })
    return neuesAusgabenJSONobjekt.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.kosten
    }, 0)

}

const letzten5Ausgaben = () => {

    const alleAusgaben = window.localStorage.getItem('ausgaben') ? Array.from(JSON.parse(window.localStorage.getItem('ausgaben'))) : []

    alleAusgaben.sort((a, b) => new Date(b.datum) - new Date(a.datum));

    return alleAusgaben.slice(0, 5)

}

// Funktion zum Anzeigen der letzten 5 Ausgaben
const zeigeAusgaben = () => {
    const ausgaben = letzten5Ausgaben();
    const liste = document.getElementById('ausgabenListe');

    liste.innerHTML = ''; // alte Einträge löschen
    const kategorien = {
        1: "Wohnen",
        2: "Ernährung",
        3: "Mobilität",
        4: "Medien",
        5: "Sonstiges"
    };
    ausgaben.forEach(eintrag => {
        const html = `
            <li class="list-group-item">
                <div class="row align-items-center no-gutters">
                    <div class="col col-xxl-3"><span>${eintrag.datum}</span></div>
                    <div class="col col-xxl-4 me-2">
                        <h6 class="mb-0"><strong>${eintrag.name}</strong></h6>
                    </div>
                    <div class="col col-xxl-2"><span>${eintrag.kosten.toFixed(2)} €</span></div>
                    <div class="col-auto col-xxl-2"><span>${kategorien[eintrag.kategorie]}</span></div>
                </div>
            </li>
        `;
        liste.insertAdjacentHTML('beforeend', html);
    });
};

// Beim Laden der Seite ausführen
window.addEventListener('DOMContentLoaded', zeigeAusgaben);


// Einkaufsliste Hinzufügen und entfernen
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const popupModal = document.getElementById("popupModal");
const form = document.getElementById("popupForm");
const liste = document.getElementById("einkaufsListe");

// Öffnen & Schließen
openModalBtn.addEventListener("click", () => popupModal.style.display = "flex");
closeModalBtn.addEventListener("click", () => popupModal.style.display = "none");


// Formular abschicken
form.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("eintragName").value.trim();
    const kosten = parseFloat(document.getElementById("eintragKosten").value).toFixed(2);

    if (!name || isNaN(kosten)) {
        alert("Bitte gültige Daten eingeben.");
        return;
    }

    const li = document.createElement("li");
    li.className = "list-item-einkauf";
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    // Linke Seite: Name
    const nameSpan = document.createElement("span");
    nameSpan.textContent = name;

    // Rechte Seite: Preis + Checkbox
    const rightSpan = document.createElement("span");

    const preisSpan = document.createElement("span");
    preisSpan.textContent = `${kosten} €`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "form-check-input ms-2"; // Bootstrap-Stil
    checkbox.addEventListener("change", function() {
        if (this.checked) {
            li.remove();
        }
    });

    rightSpan.appendChild(preisSpan);
    rightSpan.appendChild(checkbox);

    li.appendChild(nameSpan);
    li.appendChild(rightSpan);
    liste.appendChild(li);

    form.reset();
    popupModal.style.display = "none";
});

document.getElementById("einnahmenMonat").textContent = 4300 + " €";

const saldoletzterMonat = () => {
    const ausgaben = ausgabenMonat();
    const einnahmen =parseFloat(document.getElementById("einnahmenMonat").textContent) // Beispielwert für Einnahmen
    const saldo = (einnahmen - ausgaben).toFixed(2);
    document.getElementById("saldo").textContent = saldo + " €";
}
