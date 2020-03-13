const API_KEY = "AIzaSyApgm2nFzwLrOyISptqXF9RbiHyq1Josbk"
const SHEET_ID = "115_n7jB4DH062_OW9zcOHeezJi-MLRqUfeR8V1dpzhQ"

export function fetchItinerary() {
  const TAB = "itinerary"
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${TAB}?key=${API_KEY}`
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      if (!data.values) {
        throw "Failed to load google sheet"
      }
      const header = data.values[0]
      // discard first 2 rows; also drop rows without first column
      const rows = data.values.slice(2).filter(d => d[0])
      const now = new Date()

      return rows.map(row => {
        const values = Object.fromEntries(
          row.map((value, colIdx) => [header[colIdx], value])
        )

        const formattedDate = new Date(`${values.date}/2020`)
        return {
          ...values,
          dateFormatted: formattedDate,
          isToday: values.date === `${now.getMonth() + 1}/${now.getDate()}`,
          isFuture: formattedDate > now,
          isPast: formattedDate < now,
          lat: parseFloat(values.lat),
          lon: parseFloat(values.lon),
        }
      })
    })
}

export function fetchLatlon() {
  const TAB = "latlon"
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${TAB}?key=${API_KEY}`
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      if (!data.values) {
        throw "Failed to load google sheet"
      }
      const header = data.values[0]
      // discard first 1 rows; also drop rows without first column
      const rows = data.values.slice(1).filter(d => d[0])

      const formattedRows = rows
        .map(row => {
          const values = Object.fromEntries(
            row.map((value, colIdx) => [header[colIdx], value])
          )

          return {
            lat: parseFloat(values.lat),
            lon: parseFloat(values.lon),
            ...values,
          }
        })
        .filter(row => row.lat && row.lon)

      // return { "Palo Alto, CA": { location: "Palo Alto, CA", lat: ..., lon: ...}}
      return Object.fromEntries(formattedRows.map(v => [v.location, v]))
    })
}
