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
    const weather_codes = await fetch('js-resources/weather-codes.json')
        .then(response => response.json())
        .catch(error => console.log(error));

    console.log(weather_codes["0"]["day"]["description"])


function populateFilter(weather_codes){
 let blocc_filtri = document.getElementById("filters")
    for (const [weather_code, body_weather_code] of Object.entries(weather_codes)) {
    blocc_filtri.innerHTML+="<button class=\"filtro\" valorefiltro=\""+weather_code+"\"><img style=\"width: 20px; height: 20px;\" src=\""+body_weather_code["day"]["image"]+"\"></img> </button>"
    }

}
populateFilter(weather_codes)

    function popolaTabella(dati, tabella) {
        // creo td data
        let td_data = document.createElement("td");
        let date = new Date(dati.time)
        td_data.innerText = week_day[date.getDay()] + " " + date.toLocaleString()

        // creo td temperatura
        let td_temperatura = document.createElement("td");
        td_temperatura.innerText = dati.temp + " " + dati_meteo.hourly_units.temperature_2m

        // creo td temperatura
        let td_wcode = document.createElement("td");
        // td_wcode.innerText = weather_codes[dati.wcode][ dati.isnight? "night" : "day"]["description"]
        // td_wcode.innerHTML = "<img src='"++"'></img>"
        let img_meteo = document.createElement("img")
        img_meteo.src = weather_codes[dati.wcode][dati.isnight ? "night" : "day"]["image"]
        // img_meteo.setAttribute("src",weather_codes[dati.wcode][ dati.isnight? "night" : "day"]["image"] )

        td_wcode.append(img_meteo)

        // creo riga tabella e ci appendo i tre td in ordine
        let tr_data_temperatura = document.createElement("tr");
        tr_data_temperatura.append(td_data)
        tr_data_temperatura.append(td_temperatura)
        tr_data_temperatura.append(td_wcode)

        //aggiungo il tr al body tabella
        tabella.children[1].append(tr_data_temperatura)

    }


    let result = await fetch("https://api.open-meteo.com/v1/forecast?latitude=45.408&longitude=11.8859&daily=sunset,sunrise&timezone=Europe/Rome&hourly=temperature_2m,relative_humidity_2m,weather_code&forecast_days=16")



    let dati_meteo = await result.json()

    class DatiMeteo {

        constructor(time, temp, wcode) {
            this.time = time
            this.temp = temp
            this.wcode = wcode

            // dati_meteo["daily"]["sunset"]


            let day = this.time.slice(0, this.time.indexOf("T"))

            let sunset_day = dati_meteo["daily"]["sunset"].filter((dayily_sunset_tm) => dayily_sunset_tm.indexOf(day) != -1)[0]
            let sunrise_day = dati_meteo["daily"]["sunrise"].filter((dayily_sunrise_tm) => dayily_sunrise_tm.indexOf(day) != -1)[0]

            let time_parsato = new Date(this.time)
            let sunset_day_parsato = new Date(sunset_day)
            let sunrise_day_parsato = new Date(sunrise_day)

            //    console.log(this.time)
            //    console.log(sunset_day)
            //    console.log(( time_parsato<sunrise_day_parsato && time_parsato>sunset_day_parsato) ? "giorno":"notte")

            this.isnight = (time_parsato > sunset_day_parsato || time_parsato < sunrise_day_parsato)
        }


        toString() {
            let date = new Date(this.time)
            return week_day[date.getDay()] + " " + date.toLocaleString() + " " + this.temp + " " + dati_meteo.hourly_units.temperature_2m
        }
    }

    let array_meteo = []
   

    dati_meteo.hourly.time.forEach((time, index) => {
        let temp_attuale = dati_meteo.hourly.temperature_2m[index]
        let meteo_attuale = dati_meteo.hourly.weather_code[index]
        array_meteo.push(new DatiMeteo(time, temp_attuale, meteo_attuale))

    })


const date_univoche = []
    array_meteo.map((element) => {

        datestring = new Date(element.time).toDateString()
        if (date_univoche.indexOf(datestring) == -1) {
            date_univoche.push(datestring)
        }

    })


 let current_array_meteo = structuredClone(array_meteo)

    let tabella = document.getElementById("tabellameteo")

    current_array_meteo = array_meteo.filter((oggetto_meteo) => {
        return new Date(oggetto_meteo.time).toDateString() == date_univoche[0]
    })

    current_array_meteo.forEach((dati) => {
        popolaTabella(dati, tabella)
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

        current_array_meteo = array_meteo.filter((oggetto_meteo) => {
            return new Date(oggetto_meteo.time).toDateString() == date_univoche[event.target.value]
        })

        current_array_meteo.forEach((dati) => {
            popolaTabella(dati, tabella)
        })

    })

Array.prototype.forEach.call(document.getElementsByClassName("filtro"), function(button) {

    button.addEventListener("click", (e)=>{
  
         current_array_meteo = array_meteo.filter((oggetto_meteo) => {
            return new Date(oggetto_meteo.time).toDateString() == date_univoche[slider.value]
        }).filter((oggetto_meteo) => {

            return oggetto_meteo.wcode == button.getAttribute("valorefiltro")
        })

        tabella.children[1].innerHTML = "<tr></tr>"
        current_array_meteo.forEach((dati) => {
            popolaTabella(dati, tabella)
        })

    })

      
            
    });



})