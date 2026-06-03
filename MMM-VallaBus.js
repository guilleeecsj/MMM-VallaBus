Module.register("MMM-VallaBus", {
    // Configuración por defecto del módulo
    defaults: {
        headerText: "Buses de VALLADOLID", // Título principal del módulo
        headerParada: true,               // Si es true, añade el número de parada al título
        parada: "000",                    // ID o número de la parada de autobús a consultar
        resultados: 10,                   // Cantidad máxima de autobuses a mostrar en pantalla
        mostrarHoras: false,              // true para mostrar la hora de llegada, false para minutos restantes
        localAPI: false,                  // true para usar servidor local de API, false para servidor público
        localAPI_IP: "localhost",         // Dirección de red de la API local
        localAPI_Port: "3000",            // Puerto de red de la API local
    },

    // Inicialización del módulo al cargar MagicMirror
    start: function () {
        this.loading = true;           // Bandera para indicar que se están cargando los datos iniciales
        this.apiStatusOk = true;       // Estado del feed en tiempo real de la API de VallaBus
        this.isInitialLoad = true;     // Identifica la primera carga para aplicar animaciones de fade-in
        this.paradas = [];             // Almacén de las paradas procesadas que se van a listar
        this.getBusData();             // Primera consulta inmediata de datos de autobuses

        // Configura el intervalo de actualización periódica (fijo en 10 segundos)
        setInterval(() => this.getBusData(), 10000);
    },

    // Define las dependencias de hojas de estilo CSS
    getStyles() {
        return ['MMM-VallaBus.css'];
    },

    // Genera el encabezado del módulo añadiendo dinámicamente el número de parada
    getHeader() {
        if (this.config.headerParada === true) {
            const paradaText = String(this.config.parada) !== "000" ? "&nbsp - &nbspPARADA " + this.config.parada : "";
            return this.config.headerText + paradaText;
        } else {
            return this.config.headerText;
        }
    },

    // Consulta el estado de salud y disponibilidad del feed GTFS Realtime y GBFS
    checkApiStatus: async function () {
        // Selecciona la URL del estado dependiendo de si es API local o pública
        const url = this.config.localAPI
            ? `http://${this.config.localAPI_IP}:${this.config.localAPI_Port}/status`
            : "https://gtfs.vallabus.com/status/";
        try {
            const response = await fetch(url);
            if (!response.ok) {
                this.apiStatusOk = false;
                return;
            }
            const status = await response.json();
            const rt = status?.gtfs?.realtime?.AUVASA;

            // Valida que todos los componentes clave del servicio en tiempo real estén operativos
            this.apiStatusOk = !!(
                status?.gtfs &&
                status?.gtfs?.static &&
                rt?.vehiclePositions &&
                rt?.tripUpdates &&
                rt?.alerts &&
                status?.gbfs
            );
        } catch (e) {
            Log.error(`[${this.name}] Error checking API status:`, e);
            this.apiStatusOk = false;
        }
    },

    // Filtra, transforma y ordena la información cruda recibida de la parada
    obtenerInformacionParada(data) {
        if (!data || !Array.isArray(data.lineas)) {
            return [];
        }
        return data.lineas
            .map(linea => {
                if (!linea || !Array.isArray(linea.horarios)) return null;
                // Busca la próxima salida con tiempo estimado igual o superior a 0 minutos
                const horarioValido = linea.horarios.find(horario => horario && parseInt(horario.tiempoRestante) >= 0);
                if (!horarioValido) return null;
                return {
                    linea: linea.linea,
                    destino: linea.destino,
                    tiempo: parseInt(horarioValido.tiempoRestante) // Almacena el tiempo como número para facilitar cálculos y orden
                };
            })
            .filter(bus => bus !== null) // Descarta las líneas que no tienen salidas válidas inminentes
            .sort((a, b) => a.tiempo - b.tiempo); // Ordena los autobuses de menor a mayor tiempo de llegada
    },

    // Realiza la obtención asíncrona de datos (estado + parada) en paralelo
    getBusData: async function () {
        // Determina el endpoint de consulta según si es local o remoto
        let urlToFetch = this.config.localAPI
            ? `http://${this.config.localAPI_IP}:${this.config.localAPI_Port}/v2/parada/${this.config.parada}`
            : `https://gtfs.vallabus.com/parada/${this.config.parada}`;

        try {
            // Lanza ambas peticiones simultáneamente mediante Promise.allSettled
            const [statusResult, paradaResponse] = await Promise.allSettled([
                this.checkApiStatus(),
                fetch(urlToFetch).then(res => {
                    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                    return res.json();
                })
            ]);

            // Si la llamada para obtener datos de la parada fue exitosa, procesa los datos
            if (paradaResponse.status === "fulfilled") {
                this.paradas = this.obtenerInformacionParada(paradaResponse.value).slice(0, this.config.resultados);
            } else {
                console.error("Error fetching parada data:", paradaResponse.reason);
                this.paradas = [];
            }
        } catch (error) {
            console.error('Unexpected error in getBusData:', error);
            this.paradas = [];
        } finally {
            this.loading = false; // Detiene el indicador de carga

            // Actualiza el DOM del MagicMirror (aplica transición de fade de 1s solo en la carga inicial)
            if (this.isInitialLoad) {
                this.updateDom(1000);
                this.isInitialLoad = false;
            } else {
                this.updateDom();
            }
        }
    },

    // Construye dinámicamente los elementos HTML para representarlos en pantalla
    getDom: function () {
        const wrapper = document.createElement('div');
        wrapper.className = "vallabus-wrapper";

        // Muestra mensaje de carga si es la primera actualización de datos
        if (this.loading) {
            wrapper.innerHTML = "Cargando horarios...";
            wrapper.className = "dimmed light small";
            return wrapper;
        }

        // Muestra una barra de advertencia amarilla si la API informa de algún fallo en sus feeds
        if (!this.apiStatusOk) {
            const statusWarning = document.createElement("div");
            statusWarning.className = "api-status-warning";
            statusWarning.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="warning-icon">
                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                </svg>
                <span class="separator">|</span>
                <span>Puede que haya datos erróneos</span>`;
            wrapper.appendChild(statusWarning);
        }

        // Muestra un mensaje de error rojo si no se encuentran autobuses ni salidas programadas
        if (this.paradas.length === 0) {
            const statusWarning = document.createElement("div");
            statusWarning.className = "no-data";
            statusWarning.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="error-icon">
                    <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7a1 1 0 1 0-1.41 1.41L10.59 12l-4.89 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z"/>
                </svg>
                <span class="separator">|</span>
                <span style="color: white;">No hay datos de buses disponibles</span>`;
            wrapper.appendChild(statusWarning);
            return wrapper;
        }

        // Genera la lista de filas por cada autobús que se aproxima
        this.paradas.forEach(parada => {
            const buselement = document.createElement('article');
            buselement.className = "vallabus-row";

            // Prepara las clases CSS específicas de cada línea para aplicar su color oficial
            const lineabus = `l${parada.linea}`;
            const elementolinea = `<b class="num ${lineabus}">${parada.linea}</b>`;
            const elementobus = `<span class="bus">${parada.destino}</span>`;

            // Construye y formatea el tiempo estimado de arribo
            let elementotiempo;
            if (this.config.mostrarHoras === true) {
                const minutosRestantes = parada.tiempo;
                if (minutosRestantes === 0) {
                    elementotiempo = `<span class="tiempo llegando">Llegando</span>`;
                } else {
                    const ahora = new Date();
                    ahora.setMinutes(ahora.getMinutes() + minutosRestantes);
                    const horaLlegada = ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    elementotiempo = `<span class="tiempo">${horaLlegada}</span>`;
                }
            } else {
                if (parada.tiempo === 0) {
                    elementotiempo = `<span class="tiempo llegando">Llegando</span>`;
                } else {
                    const tiempoMostrado = parada.tiempo > 30 ? "+30" : parada.tiempo;
                    elementotiempo = `<span class="tiempo">${tiempoMostrado} min</span>`;
                }
            }

            buselement.innerHTML = `${elementolinea}${elementobus}${elementotiempo}`;
            wrapper.appendChild(buselement);
        });

        return wrapper;
    }
});
