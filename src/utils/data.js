import { useState, useEffect } from "react"
const API_KEY = "AIzaSyApgm2nFzwLrOyISptqXF9RbiHyq1Josbk"
const SHEET_ID = "115_n7jB4DH062_OW9zcOHeezJi-MLRqUfeR8V1dpzhQ"

function _fetchItinerary() {
  const TAB = "itinerary"
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${TAB}?key=${API_KEY}`
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      if (!data.values) {
        throw new Error("Failed to load google sheet")
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
          stoppingPoints: (values.stoppingPoints || "")
            .split("|")
            .map(s => s.trim()),
          drivingDirectionOverviewLine:
            !values.drivingDirectionOverviewLine ||
            values.drivingDirectionOverviewLine === ""
              ? null
              : // input is [[lat, lon]]; converting to [[lon, lat]]
                JSON.parse(values.drivingDirectionOverviewLine).map(row => [
                  row[1],
                  row[0],
                ]),
        }
      })
    })
}

export function useItinerary() {
  const [itinerary, setItinerary] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    _fetchItinerary()
      .then(iti => {
        setItinerary(iti)
        setLoading(false)
      })
      .catch(error => {
        setError(error)
        setLoading(false)
      })
  }, [])

  return { itinerary, loading, error }
}

function _fetchLatlon() {
  const TAB = "latlon"
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${TAB}?key=${API_KEY}`
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      if (!data.values) {
        throw new Error("Failed to load google sheet")
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

export function useLatLonLookup() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    _fetchLatlon()
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(error => {
        setError(error)
        setLoading(false)
      })
  }, [])

  return { latLonLookup: data, loading, error }
}
