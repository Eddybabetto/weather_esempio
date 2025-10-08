window.addEventListener("load", async () => {
    const week_day = [
        "Domenica",
        "Lunedi",
        "Martedì",
        "Mercoledì",
        "Giovedì",
        "Venerdì",
        "Sabato"
    ]

    let result = await fetch("https://api.open-meteo.com/v1/forecast?latitude=45.408&longitude=11.8859&hourly=temperature_2m&forecast_days=16")

    let dati_meteo = await result.json()

    class DatiMeteo {

        constructor(time, temp) {
            this.time = time
            this.temp = temp
        }


        toString() {
            let date = new Date(this.time)
            return week_day[date.getDay()] + " " + date.toLocaleString() + " " + this.temp + " " + dati_meteo.hourly_units.temperature_2m
        }
    }

    let array_meteo = []

    dati_meteo.hourly.time.forEach((time, index) => {
        let temp_attuale = dati_meteo.hourly.temperature_2m[index]
        array_meteo.push(new DatiMeteo(time, temp_attuale))

    })


    let tabella = document.getElementById("tabellameteo")
    array_meteo.forEach((dati) => {
        // creo td data
        let td_data = document.createElement("td");
        let date = new Date(dati.time)
        td_data.innerText = week_day[date.getDay()] + " " + date.toLocaleString()

        // creo td temperatura
        let td_temperatura = document.createElement("td");
        td_temperatura.innerText = dati.temp + " " + dati_meteo.hourly_units.temperature_2m

        // creo riga tabella e ci appendo i due td in ordine
        let tr_data_temperatura = document.createElement("tr");
        tr_data_temperatura.append(td_data)
        tr_data_temperatura.append(td_temperatura)

        //aggiungo il tr al body tabella
        tabella.children[1].append(tr_data_temperatura)
    })
    // la tabella è finita





    let date_univoche = []
    array_meteo.map((element) => {

        datestring = new Date(element.time).toDateString()
        if (date_univoche.indexOf(datestring) == -1) {
            date_univoche.push(datestring)
        }

    })

    //attribuisco a slider la lunghezza massima dell'array
    let slider = document.getElementById("data-meteo")
    slider.attributes.max.value = date_univoche.length - 1
    slider.addEventListener("change", (event) => {
        tabella = document.getElementById("tabellameteo")

        // pulisco tabella
        // tabella.children[1].innerHTML = "<tr></tr>"
        tabella.children[1].remove()
        tabella.append(document.createElement("tbody"));

        array_meteo.filter((oggetto_meteo) => {
            return new Date(oggetto_meteo.time).toDateString() == date_univoche[event.target.value]
        }).forEach((dati) => {
            popolaTabella(dati, tabella)
        })

    })


    function popolaTabella(dati, tabella) {
        // creo td data
        let td_data = document.createElement("td");
        let date = new Date(dati.time)
        td_data.innerText = week_day[date.getDay()] + " " + date.toLocaleString()

        // creo td temperatura
        let td_temperatura = document.createElement("td");
        td_temperatura.innerText = dati.temp + " " + dati_meteo.hourly_units.temperature_2m

        // creo riga tabella e ci appendo i due td in ordine
        let tr_data_temperatura = document.createElement("tr");
        tr_data_temperatura.append(td_data)
        tr_data_temperatura.append(td_temperatura)

        //aggiungo il tr al body tabella
        tabella.children[1].append(tr_data_temperatura)
        
    }
})