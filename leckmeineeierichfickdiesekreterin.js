//kommt von nico sammito, der fickt seine sekreterin

const neueAusgabe = (name, datum, kosten, kategorie) => {

    const neueSekreterin = {
        name,
        datum,
        kosten,
        kategorie,
    }

    const aktuelleAusgaben = window.localStorage.getItem('ausgaben') ? Array.from(JSON.parse(window.localStorage.getItem('ausgaben'))) : []
    aktuelleAusgaben.push(neueSekreterin)
    window.localStorage.setItem("ausgaben", JSON.stringify(aktuelleAusgaben))

}

const ausgabenMonat = () => {

    const aktuelleSekreterin = window.localStorage.getItem('ausgaben') ? Array.from(JSON.parse(window.localStorage.getItem('ausgaben'))) : []
    const date = new Date().getTime()
    const monat = 60 * 60 * 24 * 30


    const neueSekreterin = aktuelleSekreterin.filter(value => {

        const valueDate = new Date(value.datum).getTime()
        return (date - monat) <= valueDate && valueDate <= date

    })
    return neueSekreterin.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.kosten
    }, 0)


}

const letzten5Ausgaben = () => {

    const aktuelleSekreterin = window.localStorage.getItem('ausgaben') ? Array.from(JSON.parse(window.localStorage.getItem('ausgaben'))) : []
    const sort = aktuelleSekreterin.sort((a, b) => {
        return a > b
    })

    return sort.slice(0, 5)

}


document.querySelector("#AusgabenImMonat").innerHTML = `${ausgabenMonat()} €`

neueAusgabe("Nico", new Date().getTime(), 800, "Flug")