document.getElementById('ausgabeForm').addEventListener('submit', (e) => {
    e.preventDefault(); // verhindert Neuladen der Seite

    const name = document.getElementById('name').value;
    const datum = document.getElementById('datum').value;
    const kosten = parseFloat(document.getElementById('kosten').value);
    const kategorie = document.getElementById('kategorie').value;

    neueAusgabe(name, datum, kosten, kategorie);
    console.log(`Neue Ausgabe: ${name}, Datum: ${datum}, Kosten: ${kosten}, Kategorie: ${kategorie}`);
    // Ansicht aktualisieren
    document.querySelector("#ausgabenImMonat").innerHTML = `${ausgabenMonat()} €`;
    zeigeAusgaben();

    // Optional: Formular zurücksetzen
    e.target.reset();
});

const neueAusgabe = (name, datum, kosten, kategorie) => {

    const neuesAusgabenJSONobejekt = {
        name,
        datum,
        kosten: parseFloat(kosten),
        kategorie,
    }

    const aktuelleAusgaben = window.localStorage.getItem('ausgaben') ? Array.from(JSON.parse(window.localStorage.getItem('ausgaben'))) : []
    aktuelleAusgaben.push(neuesAusgabenJSONobejekt)
    window.localStorage.setItem("ausgaben", JSON.stringify(aktuelleAusgaben))

}

const ausgabenMonat = () => {

    const alleAusgaben = window.localStorage.getItem('ausgaben') ? Array.from(JSON.parse(window.localStorage.getItem('ausgaben'))) : []
    const date = new Date().getTime()
    const monat = 60 * 60 * 24 * 30


    const neuesAusgabenJSONobejekt = alleAusgaben.filter(value => {

        const valueDate = new Date(value.datum).getTime()
        return (date - monat) <= valueDate && valueDate <= date

    })
    return neuesAusgabenJSONobejekt.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.kosten
    }, 0)

}

const letzten5Ausgaben = () => {

    const alleAusgaben = window.localStorage.getItem('ausgaben') ? Array.from(JSON.parse(window.localStorage.getItem('ausgaben'))) : []
    const sort = alleAusgaben.sort((a, b) => {
        return a > b
    })

    return sort.slice(0, 5)

}


// Funktion zum Anzeigen der letzten 5 Ausgaben
const zeigeAusgaben = () => {
    const ausgaben = letzten5Ausgaben();
    const liste = document.getElementById('ausgabenListe');
    liste.innerHTML = ''; // alte Einträge löschen

    ausgaben.forEach(eintrag => {
        const html = `
            <li class="list-group-item">
                <div class="row align-items-center no-gutters">
                    <div class="col col-xxl-2"><span>${eintrag.datum}</span></div>
                    <div class="col col-xxl-4 me-2">
                        <h6 class="mb-0"><strong>${eintrag.name}</strong></h6>
                    </div>
                    <div class="col col-xxl-2"><span>${eintrag.kosten.toFixed(2)} €</span></div>
                    <div class="col-auto col-xxl-2"><span>${eintrag.kategorie}</span></div>
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
    li.className = "list-item";
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    // Checkbox zum Entfernen
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "form-check-input me-2";
    checkbox.addEventListener("change", function() {
        if (this.checked) {
            li.remove();
        }
    });

    const label = document.createElement("label");
    label.innerHTML = `<strong>${name}</strong> – ${kosten} €`;

    li.appendChild(label);
    liste.appendChild(li);
    li.appendChild(checkbox);



    form.reset();
    popupModal.style.display = "none";
});
