import React, { useState, useEffect } from "react"
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps"
import ReactTooltip from "react-tooltip"
import { fetchLatlon } from "../utils/google_sheet"

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <p>
          {this.props.errorMessage
            ? this.props.errorMessage
            : "Something went wrong."}
        </p>
      )
    }

    return this.props.children
  }
}

const MapChart = ({ locations }) => {
  const [tooltipContent, setTooltipContent] = useState("")

  const [latLonLookup, setLatLonLookup] = useState([])
  useEffect(() => {
    fetchLatlon().then(d => {
      setLatLonLookup(d)
    })
  }, [])

  return (
    <ErrorBoundary errorMessage="Failed to load map">
      <div>
        <ComposableMap data-tip="" projection="geoAlbersUsa">
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#EAEAEC"
                  stroke="#D6D6DA"
                />
              ))
            }
          </Geographies>

          {locations
            .filter(l => l.lat)
            .filter(l => !l.justPassingBy)
            .map(
              (
                {
                  nightAt,
                  lat,
                  lon,
                  isFuture,
                  date,
                  dayOfTrip,
                  stoppingPoints,
                },
                idx
              ) => (
                <React.Fragment key={nightAt}>
                  <Marker
                    coordinates={[lon, lat]}
                    onMouseEnter={() => {
                      setTooltipContent(
                        `Day ${dayOfTrip} (${date}) ${nightAt}` +
                          (isFuture
                            ? " (date/location subject to change!)"
                            : "")
                      )
                    }}
                    onMouseLeave={() => setTooltipContent("")}
                  >
                    <g
                      fill="none"
                      stroke={isFuture ? "#808080" : "#FF5533"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      transform="translate(-12, -24)"
                    >
                      <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
                    </g>
                    <text
                      textAnchor="middle"
                      stroke={isFuture ? "#808080" : "#FF5533"}
                      style={{
                        fontFamily: "system-ui",
                        fill: "#5D5A6D",
                        fontSize: 10,
                      }}
                      y={-10}
                    >
                      {idx + 1}
                    </text>
                  </Marker>

                  {latLonLookup &&
                    stoppingPoints &&
                    stoppingPoints.trim() !== "" &&
                    stoppingPoints.split("|").map(loc => {
                      return (
                        latLonLookup[loc] && (
                          <Marker
                            key={loc}
                            coordinates={[
                              latLonLookup[loc].lon,
                              latLonLookup[loc].lat,
                            ]}
                            onMouseEnter={() => {
                              setTooltipContent(
                                `Visit: ${loc} - Day ${dayOfTrip} (${date})` +
                                  (isFuture
                                    ? " (date/location subject to change!)"
                                    : "")
                              )
                            }}
                            onMouseLeave={() => setTooltipContent("")}
                          >
                            <circle
                              r={5}
                              fill={isFuture ? "#808080" : "#FF5533"}
                              stroke="#fff"
                              strokeWidth={2}
                            />
                          </Marker>
                        )
                      )
                    })}
                </React.Fragment>
              )
            )}
        </ComposableMap>
        <ReactTooltip>{tooltipContent}</ReactTooltip>
      </div>
    </ErrorBoundary>
  )
}

export default MapChart
