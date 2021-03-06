import React, { useState } from "react"
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
} from "react-simple-maps"
import ReactTooltip from "react-tooltip"
import { useLatLonLookup } from "../utils/data"

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"

const MapChart = ({ itinerary }) => {
  const [tooltipContent, setTooltipContent] = useState("")

  const { latLonLookup } = useLatLonLookup()

  const locations = itinerary
    .filter(
      (d, idx) =>
        d.nightAt &&
        (idx === 0 || itinerary[idx - 1].nightAt !== itinerary[idx].nightAt)
    )
    .filter(l => l.lat && l.lon)

  if (locations.length === 0) return null

  const tooltipContentText = itineraryDay =>
    `Day ${itineraryDay.dayOfTrip} (${itineraryDay.date}) ${itineraryDay.nightAt}` +
    (itineraryDay.isFuture ? " (date/location subject to change!)" : "")

  return (
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

        {locations.map((iti, idx) => (
          <React.Fragment key={iti.nightAt}>
            {!iti.justPassingBy && (
              <Marker
                coordinates={[iti.lon, iti.lat]}
                onMouseEnter={() => {
                  setTooltipContent(tooltipContentText(iti))
                }}
                onMouseLeave={() => setTooltipContent("")}
                style={{ hover: { cursor: `pointer` } }}
              >
                <g
                  fill="#ffffff"
                  stroke={iti.isFuture ? "#808080" : "#FF5533"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  transform="translate(-12, -24)"
                >
                  <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
                </g>
                <text
                  textAnchor="middle"
                  stroke={iti.isFuture ? "#808080" : "#FF5533"}
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
            )}

            {latLonLookup &&
              iti.stoppingPoints.length > 0 &&
              iti.stoppingPoints.map(loc => {
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
                          `Visit: ${loc} - Day ${iti.dayOfTrip} (${iti.date})` +
                            (iti.isFuture
                              ? " (date/location subject to change!)"
                              : "")
                        )
                      }}
                      onMouseLeave={() => setTooltipContent("")}
                      style={{ hover: { cursor: `pointer` } }}
                    >
                      <circle
                        r={5}
                        fill={iti.isFuture ? "#808080" : "#FF5533"}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    </Marker>
                  )
                )
              })}

            {iti.drivingDirectionOverviewLine && (
              <Line
                coordinates={iti.drivingDirectionOverviewLine}
                stroke={iti.isFuture ? "#80808060" : "#FF553360"}
                strokeWidth={2}
              />
            )}
          </React.Fragment>
        ))}
      </ComposableMap>
      <ReactTooltip>{tooltipContent}</ReactTooltip>
    </div>
  )
}

export default MapChart
