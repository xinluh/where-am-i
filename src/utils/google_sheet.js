const API_KEY = "AIzaSyApgm2nFzwLrOyISptqXF9RbiHyq1Josbk"
const TAB = "itinerary"
const SHEET_ID = "115_n7jB4DH062_OW9zcOHeezJi-MLRqUfeR8V1dpzhQ"

export default function fetchSheet() {
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
        }
      })
    })
}
