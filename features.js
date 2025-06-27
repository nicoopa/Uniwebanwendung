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
    aktualisiereKategorienChart();

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
    aktualisiereKategorienChart();
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

// Beispielhafte Einnahmen für den Monat
document.getElementById("einnahmenMonat").textContent = 4300 + " €";

// Berechnung des Saldos für den letzten Monat
const saldoletzterMonat = () => {
    const ausgaben = ausgabenMonat();
    const einnahmen =parseFloat(document.getElementById("einnahmenMonat").textContent) // Beispielwert für Einnahmen
    const saldo = (einnahmen - ausgaben).toFixed(2);
    document.getElementById("saldo").textContent = saldo + " €";
}

let kategorienChartInstance; // Globale Chart-Instanz

const aktualisiereKategorienChart = () => {
    const rawData = JSON.parse(window.localStorage.getItem("ausgaben")) || [];

    const kategorienMap = {
        1: "Wohnen",
        2: "Ernährung",
        3: "Mobilität",
        4: "Medien",
        5: "Sonstiges"
    };

    const kategorienSumme = {
        "Wohnen": 0,
        "Ernährung": 0,
        "Mobilität": 0,
        "Medien": 0,
        "Sonstiges": 0
    };

    rawData.forEach(ausgabe => {
        const katName = kategorienMap[ausgabe.kategorie];
        if (katName) {
            kategorienSumme[katName] += parseFloat(ausgabe.kosten) || 0;
        }
    });

    const labels = Object.keys(kategorienSumme);
    const daten = Object.values(kategorienSumme);

    const ctx = document.getElementById("kategorienChart").getContext("2d");

    // Falls bereits ein Chart existiert → zerstören
    if (kategorienChartInstance) {
        kategorienChartInstance.destroy();
    }

    kategorienChartInstance = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [{
                data: daten,
                backgroundColor: ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e", "#e74a3b"],
                borderColor: ["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"],
                borderWidth: 2
            }]
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    });
};

//Erschaffen des Charts für den Ausgabenverlauf
document.addEventListener("DOMContentLoaded", function ()
    {
    const ctx = document.getElementById("saldoChart").getContext("2d");

    // Hole Daten aus localStorage
    const rawData = localStorage.getItem("saldoVerlauf");
    let saldoData = [];

    try {
    saldoData = JSON.parse(rawData) || [];
} catch (e) {
    console.error("Fehler beim Laden der Saldo-Daten:", e);
}

    const labels = saldoData.map(e => e.monat);
    const data = saldoData.map(e => e.saldo);

    new Chart(ctx, {
    type: 'line',
    data: {
    labels: labels,
    datasets: [{
    label: "Saldo",
    data: data,
    fill: true,
    backgroundColor: "rgba(78, 115, 223, 0.05)",
    borderColor: "rgba(78, 115, 223, 1)",
    tension: 0.4
}]
},
    options: {
    maintainAspectRatio: false,
    scales: {
    x: {
    ticks: { color: "#858796" },
    grid: {
    drawBorder: false,
    drawOnChartArea: false
}
},
    y: {
    ticks: { color: "#858796" },
    grid: {
    borderDash: [2],
    zeroLineBorderDash: [2]
}
}
},
    plugins: {
    legend: {
    display: false
}
}
}
});
});

const saldenLetzte6Monate = () => {
    const alleAusgaben = window.localStorage.getItem('ausgaben')
        ? JSON.parse(window.localStorage.getItem('ausgaben'))
        : [];

    const jetzt = new Date();

    // Array der letzten 6 Monate im Format "YYYY-MM"
    let monate = [];
    for(let i = 5; i >= 0; i--) {
        const d = new Date(jetzt.getFullYear(), jetzt.getMonth() - i, 1);
        monate.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    }

    // Objekt für Salden mit Monatsnamen als Key
    let saldoMap = {};
    monate.forEach(m => saldoMap[m] = 0);

    // Alle Ausgaben durchgehen und nach Monat summieren
    alleAusgaben.forEach(({datum, kosten}) => {
        // Monat aus dem Datum extrahieren
        const d = new Date(`${datum}T00:00:00`);
        const monatStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

        if (saldoMap.hasOwnProperty(monatStr)) {
            saldoMap[monatStr] += kosten;
        }
    });

    // Ergebnis als Array mit Monat und Saldo in der Reihenfolge der letzten 6 Monate
    return monate.map(monat => ({monat, saldo: saldoMap[monat]}));
}


const saldoVerlauf = saldenLetzte6Monate();
console.log(saldoVerlauf); // z. B. [{monat: "Jan", saldo: 800}, ...]

localStorage.setItem("saldoVerlauf", JSON.stringify(saldoVerlauf));



