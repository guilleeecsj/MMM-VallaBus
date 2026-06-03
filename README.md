# MMM-VallaBus

MMM-VallaBus es un módulo para [MagicMirror²](https://github.com/MagicMirrorOrg/MagicMirror) que muestra información en tiempo real sobre los autobuses urbanos que operan en Valladolid (AUVASA), ordenados por tiempo de llegada.

## Ejemplo de uso

![Foto del ejemplo de uso del modulo MMM-VallaBus para MagicMirror](https://i.ibb.co/9BPVwLc/image.png)

## Dependencias

- [MagicMirror²](https://github.com/MagicMirrorOrg/MagicMirror)
- [API de VallaBus](https://github.com/VallaBus/api-auvasa) (creada originalmente por [DaviidMM](https://github.com/DaviidMM) y [Nukeador](https://github.com/nukeador)

## Instalación del módulo

### Opción A: Usando la API pública (Recomendado y por defecto)
No requiere ningún despliegue adicional. El módulo consultará directamente a la API GTFS pública de VallaBus.

### Opción B: Despliegue de la API de AUVASA en local
Si prefieres alojar la API en tu propio servidor o Raspberry PI para un funcionamiento local:

```bash
cd ~/
git clone https://github.com/VallaBus/api-auvasa.git
cd api-auvasa
cp .env.template .env
npm install
npm start
```

### Integración del módulo en MagicMirror²

Clona este repositorio dentro de la carpeta de módulos de tu MagicMirror:

```bash
cd ~/MagicMirror/modules
git clone https://github.com/guilleeecsj/MMM-VallaBus.git
```

Una vez clonado, agrega la configuración del módulo en el archivo `config/config.js` de MagicMirror²:

```js
{
    module: "MMM-VallaBus",
    position: "top_right", // Posición donde quieres que aparezca el módulo
    config: {
        headerParada: true, // Mostrar la parada configurada en el título
        headerText: "Buses de VALLADOLID", // Texto del título del módulo
        parada: "000", // Número de la parada a consultar
        resultados: 10, // Cantidad máxima de autobuses a mostrar
        mostrarHoras: false, // true para mostrar hora de llegada (ej: 18:30), false para minutos restantes (ej: 5 min)
        localAPI: false, // true para usar la API local, false para usar la API pública oficial de VallaBus
        localAPI_IP: "localhost", // Host o IP de tu API local (solo si localAPI es true)
        localAPI_Port: "3000", // Puerto de tu API local (solo si localAPI es true)
    }
}
```

---

## Opciones de Configuración

| Configuración | Tipo | Valor por defecto | Descripción |
| --- | --- | --- | --- |
| `headerParada` | `boolean` | `true` | Activa o desactiva que se concatene el número de parada configurado en el título. |
| `headerText` | `string` | `"Buses de VALLADOLID"` | Título principal del módulo. |
| `parada` | `string` o `number` | `"000"` | Identificador/Número de la parada de la cual deseas obtener la información. |
| `resultados` | `number` | `10` | Cantidad máxima de líneas de autobuses a listar. |
| `mostrarHoras` | `boolean` | `false` | Si es `true`, muestra la hora exacta estimada (ej. `20:15`). Si es `false`, muestra el tiempo relativo en minutos (ej. `7 min`). Si el tiempo de llegada es menor a 1 minuto (tiempo = 0), muestra el estado animado **`Llegando`** en color verde y con parpadeo suave. |
| `localAPI` | `boolean` | `false` | Si es `true`, el módulo intentará realizar las peticiones a un servidor local de AUVASA API. Si es `false`, utilizará la API pública de VallaBus. |
| `localAPI_IP` | `string` | `"localhost"` | IP o dominio donde está alojada la API de AUVASA local. |
| `localAPI_Port` | `string` | `"3000"` | Puerto de red de la API de AUVASA local. |

---

## Contribuciones

Las contribuciones a este proyecto son bienvenidas. Si deseas aportar una mejora o corregir un fallo, siéntete libre de abrir un [issue](https://github.com/guilleeecsj/MMM-VallaBus/issues) o una [pull request](https://github.com/guilleeecsj/MMM-VallaBus/pulls).

## Licencia

Este proyecto está bajo la Licencia [MIT](https://opensource.org/license/mit).
