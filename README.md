# MMM-AuvasaTracker

MMM-AuvasaTracker es un módulo para MagicMirror² que muestra información en tiempo real sobre los autobuses de AUVASA.

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

## Ejemplo de uso

![Foto del ejemplo de uso del modulo MMM-AuvasaTracker para MagicMirror](https://i.ibb.co/Fb4Qcnkk/image.png)

## Contribuciones
Las contribuciones son bienvenidas. Por favor, abre una issue o una pull request.

## Licencia
Este proyecto está licenciado bajo la Licencia [MIT](https://opensource.org/license/mit).