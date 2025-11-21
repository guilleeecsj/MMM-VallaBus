# MMM-VallaBus

MMM-VallaBus es un módulo para [MagicMirror²](https://github.com/MagicMirrorOrg/MagicMirror) que muestra información en tiempo real sobre los autobuses de diferentes empresas que operan en Valladolid.

## Ejemplo de uso

![Foto del ejemplo de uso del modulo MMM-VallaBus para MagicMirror](https://i.ibb.co/Fb4Qcnkk/image.png)

## Dependencias

- [MagicMirror²](https://github.com/MagicMirrorOrg/MagicMirror)
- [API de Auvasa](https://github.com/VallaBus/api-auvasa), creado originalmente por [DaviidMM](https://github.com/DaviidMM)

## Instalación del módulo



### Despliegue de la API de AUVASA en local

```
cd ~/
git clone https://github.com/VallaBus/api-auvasa.git
cd api-auvasa
mv .env.template .env
npm install
npm start
```

### Integración del módulo en el MagicMirror

```
cd ~/MagicMirror/modules
git clone https://github.com/guilleeecsj/MMM-VallaBus.git
```

Una vez esté el módulo ya puesto en la carpeta de `modules` debes agregar la siguiente configuración al archivo `config.js` de MagicMirror²:

```js
{
    module: "MMM-VallaBus",
    position: "top_right", // La posición donde quieres que aparezca el módulo
    config: {
        headerParada: true, // Mostrar o no la parada configurada en el header
        headerText: "Buses de VALLADOLID",
        parada: "000", // Número de la parada
        resultados: 10, // Número de lineas de buses a mostrar
        apiIP: "localhost", // IP donde se aloja la API
        apiPort: "3000", // Puerto donde se encuentra la API
    }
}
```

| Configuración | Tipo | Valor por defecto | Descripcion |
| --- | --- | --- | --- |
| `headerParada` | `boolean` | true | Activar / Desactivar que se muestre la parada configurada en el header |
| `headerText` | `text` | Buses de VALLADOLID | Poner un texto determinado como header del modulo. |
| `parada` | `number` | 000 | Configurar la parada de la cual quieres sacar la información. |
| `resultados` | `number` | 10 | Limitar el numero de lineas que quieres que salga en el modulo. |
| `apiIP` | `text` | localhost | Configurar el host donde está alojada la API. |
| `apiPort` | `text` | 3000 | Configurar el puerto donde está alojada la API. |

## Contribuciones
Las contribuciones en este proyecto son bienvenidas. Si desea aportar algo, abra una [issue](https://github.com/guilleeecsj/MMM-VallaBus/issues) o una [pull request](https://github.com/guilleeecsj/MMM-VallaBus/pulls).

## Licencia
Este proyecto está licenciado bajo la Licencia [MIT](https://opensource.org/license/mit).
