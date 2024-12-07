# README

Este repositorio contiene dos scripts destinados a trabajar conjuntamente para extraer datos de visibilidad orgánica de un dominio específico y mostrarlos en una hoja de Google Sheets.

## Descripción general

1. **app-script.js (Google Apps Script)**  
   Este script se ejecuta en un entorno de Google Apps Script (asociado a un documento de Google Sheets).  
   - Lee el dominio, el país y el idioma desde la hoja "Buscar" (en la fila 2).  
   - Envía una petición a un endpoint PHP (el SCRIPT2) que obtiene datos de visibilidad orgánica de un dominio.  
   - Recibe la respuesta en formato JSON y la vierte en una nueva hoja dentro del mismo Spreadsheet (creándola si no existe).  
   - Ordena los datos recibidos según el volumen de búsqueda, formatea las celdas y ajusta la tabla para una mejor visualización.

2. **curl.php (PHP)**  
   Este script funciona en un servidor web con soporte para PHP.  
   - Recibe parámetros GET (dominio, país, idioma) y construye una URL de consulta a la API de Authoritas.  
   - Realiza la petición a la API, devuelve el JSON recibido sin alterar y, en caso de error, muestra un mensaje indicando el código HTTP de respuesta o el error específico de cURL.

## Requisitos

- **app-script.js (Google Apps Script):**
  - Debes contar con un documento de Google Sheets.  
  - Añade el script en el editor de Apps Script integrado en Google Sheets.  
  - En la hoja "Buscar" coloca en la celda A2 el dominio, en B2 el código de país (ej: `es`), en C2 el idioma (ej: `es`).

- **curl.php (PHP):**
  - Debes disponer de un servidor con PHP 7 o superior.  
  - Permisos para ejecutar peticiones cURL (normalmente disponible por defecto en la mayoría de entornos).  
  - Sube el archivo PHP a tu servidor.  
  - Asegúrate de sustituir la URL de "app-script.js" por la URL pública donde se encuentre curl.php.

## Uso

1. Configura en la hoja "Buscar" los datos necesarios:  
   - `A2`: dominio (ejemplo: `example.com`)  
   - `B2`: código de país (ejemplo: `es`)  
   - `C2`: idioma (ejemplo: `es`)

2. En el código de Google Apps Script (app-script.js), asegúrate de que la variable `url` apunte al endpoint correcto de curl.php:  
   ```javascript
   const url = `https://tuservidor.com/visibility-explorer.php?dominio=${domain}&pais=${countryCode.toLowerCase()}&idioma=${language}`;
