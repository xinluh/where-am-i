import { useState, useEffect } from "react"
import promiseRetry from "promise-retry"
import { trackCustomEvent } from "gatsby-plugin-google-analytics"
import { frozenData, frozenLatLonLookup } from "./frozenData"

const API_KEY = "AIzaSyApgm2nFzwLrOyISptqXF9RbiHyq1Josbk" // this is restricted to localhost and github.io/xinluh domain
const SHEET_ID = "115_n7jB4DH062_OW9zcOHeezJi-MLRqUfeR8V1dpzhQ"

function _fetchItinerary() {
  const fetchedData = new Promise(resolve => resolve(frozenData)) // just use the frozen data instead of loading from spreadsheet since it is no longer refreshed

  /*
   * const TAB = "itinerary"
   * const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${TAB}?key=${API_KEY}`
   * const fetchedData = fetch(url).then(response => response.json())
   */

  return fetchedData.then(data => {
    if (!data.values) {
      throw new Error("Failed to load google sheet")
    }
    const header = data.values[0]
    // discard first 2 rows; also drop rows without first column
    const rows = data.values.slice(2).filter(d => d[0])

    // frozen to 3/31/2020
    const now = new Date("3/31/2020")

    return rows.map(row => {
      const values = Object.fromEntries(
        row.map((value, colIdx) => [header[colIdx], value])
      )

      const formattedDate = new Date(`${values.date}/2020`)

      let drivingDirectionLine = null
      try {
        // input is [[lat, lon]]; converting to [[lon, lat]]
        drivingDirectionLine = JSON.parse(
          values.drivingDirectionOverviewLine
        ).map(row => [row[1], row[0]])
      } catch {}

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
          .map(s => s.trim())
          .filter(s => s !== ""),
        drivingDirectionOverviewLine: drivingDirectionLine,
      }
    })
  })
}

export function useItinerary() {
  const [itinerary, setItinerary] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    promiseRetry(
      (retry, number) => {
        console.log("attempt number", number)

        return _fetchItinerary().catch(err => {
          if (err.message === "Failed to load google sheet") {
            retry(err)
          } else {
            throw err
          }
        })
      },
      { retries: 3 }
    ).then(
      ret => {
        setItinerary(ret)
        setLoading(false)
      },
      err => {
        setError(err)
        console.log(err)
        setLoading(false)
        trackCustomEvent({
          category: "itinerary",
          action: "page_load",
          // label: "some label",
        })
      }
    )
  }, [])

  return { itinerary, loading, error }
}

function _fetchLatlon() {
  const fetchedData = new Promise(resolve => resolve(frozenLatLonLookup)) // just use the frozen data instead of loading from spreadsheet since it is no longer refreshed

  /*
   * const TAB = "latlon"
   * const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${TAB}?key=${API_KEY}`
   * const fetchedData = fetch(url).then(response => response.json())
   */

  return fetchedData.then(data => {
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
