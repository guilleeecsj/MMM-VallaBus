Module.register("MMM-AuvasaTracker", {
    defaults: {
        headerText: "Buses de AUVASA",
        headerParada: true,
        parada: "000",
        resultados: 10,
        apiIP: "localhost", 
        apiPort: "3000",
    },

    start: function() {
        setInterval(() => {
            this.updateDom();
        }, 10000); // Se actualiza el DOM cada 10 segundos
    },

    getStyles() {
        return ['MMM-AuvasaTracker.css'];
    },

    getHeader() {
        if (this.config.headerParada === true) {
            const parada = this.config.parada != "000" ? "&nbsp - &nbspPARADA " + this.config.parada : "";
            return this.config.headerText+parada;
        } else {
            return this.config.headerText;
        }
    },

    obtenerInformacionParada(data) {
        return data.lineas
        .filter(linea => linea.horarios.length > 0)
        .map(linea => {
            const horarioValido = linea.horarios.find(horario => parseInt(horario.tiempoRestante) >= 0);
            return {
                linea: linea.linea,
                destino: linea.destino,
                tiempo: horarioValido ? horarioValido.tiempoRestante : "N/A"
            };
        })
        .filter(bus => parseInt(bus.tiempo) >= 0)
        .sort((a, b) => {
            const tiempoA = parseInt(a.tiempo);
            const tiempoB = parseInt(b.tiempo);
            return tiempoA - tiempoB;
        });
    },
        

    getDom: async function() {
        
        const wrapper = document.createElement('div');
        wrapper.style = "display: grid; grid-template-columns: 3;";
        
        try {
            const response = await fetch(`http://${this.config.apiIP}:${this.config.apiPort}/v2/parada/${this.config.parada}`);
            const data = await response.json();
            const paradas = this.obtenerInformacionParada(data).slice(0, this.config.resultados);
            
            paradas.forEach(parada => {
                const buselement = document.createElement('article');
                buselement.style = "display: grid; grid-template-columns: .5fr 2fr 1fr; justify-content: center; align-items: center; padding-top: 5px; padding-bottom: 5px;";
                
                const lineabus = `l${parada.linea}`;
                const elementolinea = `<b class="num" id="${lineabus}" style="margin-right: 30px; display: flex; justify-content: center">${parada.linea}</b>`;
                const elementobus = `<span class="bus" style="text-align: center; margin: 0 20px">${parada.destino}</span>`;
                const tiempoMostrado = parseInt(parada.tiempo) > 30 ? "+30" : parada.tiempo;
                const elementotiempo = `<span class="tiempo">${tiempoMostrado} min</span>`;

                
                buselement.innerHTML = `${elementolinea}${elementobus}${elementotiempo}`;
                wrapper.appendChild(buselement);
            });
        } catch (error) {
            console.error('Error:', error);
            const errorElement = document.createElement('div');
            errorElement.textContent = 'Error al cargar los datos de la parada';
            wrapper.appendChild(errorElement);
        }

        return wrapper;
    }
});
