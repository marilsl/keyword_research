function solicitarDatosDesdeURL() {
  // Obtén la hoja de cálculo y los datos de la hoja de "Petición"
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Buscar");
  const data = sheet.getDataRange().getValues();
  const domain = data[1][0]; 
  const countryCode = data[1][1];
  const language = data[1][2];

  // Configura la URL de RapidAPI
  const url = `https://davidarmento.com/visibility-explorer.php?dominio=${domain}&pais=${countryCode.toLowerCase()}&idioma=${language}`;

  try {
    // Configuración de la solicitud
    const options = {
      method: "get",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
        "Accept": "application/json",
        "Connection": "keep-alive"
      },
      followRedirects: true // Sigue automáticamente redirecciones
    };

    // Realizar la solicitud
    const response = UrlFetchApp.fetch(url, options);

    // Procesar el JSON
    const dataReceived = JSON.parse(response.getContentText());

    // Intenta obtener la hoja de resultados; si no existe, créala
    let resultSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(domain);
    if (!resultSheet) {
      resultSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(domain);

      // Mueve la hoja recién creada al final
      resultSheet.activate();
      SpreadsheetApp.getActiveSpreadsheet().moveActiveSheet(SpreadsheetApp.getActiveSpreadsheet().getSheets().length);

      resultSheet.appendRow(['keyword', 'searchVolume', 'universalRank', 'fullUrl', 'kwResultTypes', 'resultType', 'visibilityIndexShare', 'universalRankDeltas', 'potentialVisibilityScoreInc']);
      resultSheet.getRange("A1:I1")
      .setFontWeight("bold")
      .setBackground("#000000")  // Fondo negro
      .setFontColor("#FFFFFF");  // Fuente blanca

    }

    // Procesa los datos recibidos y organiza los valores en el formato adecuado para Google Sheets
    const rows = dataReceived.items.map(item => [
      item.keyword,
      item.searchVolume,
      item.universalRank,
      item.fullUrl,
      item.searchVolume,
      item.resultType,
      item.visibilityIndexShare,
      item.universalRankDeltas,
      item.potentialVisibilityScoreInc
    ]);

    // Encuentra la primera fila vacía en la hoja de resultados y agrega los datos
    const lastRow = resultSheet.getLastRow();
    resultSheet.getRange(lastRow + 1, 1, rows.length, rows[0].length).setValues(rows);

    // Ajuste de diseño:
    // 1. Ensancha las columnas automáticamente
    resultSheet.autoResizeColumns(1, 9);
    for (let i = 1; i <= 9; i++) {  // Recorre de la columna A a la I
      let currentWidth = resultSheet.getColumnWidth(i);
      resultSheet.setColumnWidth(i, currentWidth + 20);  // Añade 20 píxeles a cada ancho de columna
    }

    // 2. Ordena por la columna "Volume" (segunda columna), de mayor a menor
    resultSheet.getRange("A2:G" + resultSheet.getLastRow()).sort({column: 2, ascending: false});
    resultSheet.getRange("B2:B" + resultSheet.getLastRow()).setNumberFormat("#,##0");
    resultSheet.getDataRange().setVerticalAlignment("middle");

    // Ajusta la altura de las filas para más espacio visual
    resultSheet.setRowHeights(1, resultSheet.getLastRow(), 25);


  } 
  catch (error) {
    Logger.log(`Error al realizar la solicitud: ${error.message}`);
  }
}
