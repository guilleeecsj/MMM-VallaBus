# MMM-AuvasaTracker

MMM-AuvasaTracker es un módulo para MagicMirror² que muestra información en tiempo real sobre los autobuses de AUVASA.

## Ejemplo de uso

![Foto del ejemplo de uso del modulo MMM-AuvasaTracker para MagicMirror](https://i.ibb.co/Fb4Qcnkk/image.png)

## Configuración

Para configurar el módulo, agrega la siguiente configuración a tu archivo `config.js` de MagicMirror²:

```js
{
    module: "MMM-AuvasaTracker",
    position: "top_right", // La posición donde quieres que aparezca el módulo
    config: {
        headerParada: true,
        headerText: "Buses de AUVASA",
        parada: "000", // Código de la parada
        resultados: 10, // Número de resultados a mostrar
        apiIP: "localhost", // IP de la API
        apiPort: "3000", // Puerto de la API
    }
}
```

## Dependencias

- [MagicMirror²](https://github.com/MagicMirrorOrg/MagicMirror)
- [API de Auvasa](https://github.com/DaviidMM/api-auvasa), hecho por [DaviidMM](https://github.com/DaviidMM)


| Configuración | Tipo | Valor por defecto | Descripcion |
| --- | --- | --- | --- |
| `headerParada` | `boolean` | true | Activar / Desactivar que se muestre la parada configurada en el header |
| `headerText` | `text` | Buses de AUVASA | Poner un texto determinado como header del modulo. |
| `parada` | `number` | 000 | Configurar la parada de la cual quieres sacar la información. |
| `resultados` | `number` | 10 | Limitar el numero de lineas que quieres que salga en el modulo. |
| `apiIP` | `text` | localhost | Configurar el host donde está alojada la API. |
| `apiPort` | `text` | 3000 | Configurar el puerto donde está alojada la API. |

## Contribuciones
Las contribuciones en este proyecto son bienvenidas. Si desea aportar algo, abra una issue o una pull request.

## Licencia
Este proyecto está licenciado bajo la Licencia [MIT](https://opensource.org/license/mit).