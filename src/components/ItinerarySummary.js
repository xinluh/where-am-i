import React, { useState } from "react"
import { rhythm, scale } from "../utils/typography"

const LocationDisplay = ({ name }) => {
  return (
    <a
      href={`https://www.google.com/maps/search/?api=1&query=${encodeURI(
        name
      )}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {name}
    </a>
  )
}

const ItinerarySummary = ({ itinerary }) => {
  const [expanded, setExpanded] = useState(false)

  const todayItinerary = itinerary.find(i => i.isToday)
  const tomorrowItinerary = itinerary.find(i => i.isFuture)

  const dedupedFutureItinerary = itinerary
    .filter(
      (d, idx) =>
        d.nightAt &&
        (idx === 0 || itinerary[idx - 1].nightAt !== itinerary[idx].nightAt)
    )
    .filter(i => i.isFuture)

  const nextItinerary =
    dedupedFutureItinerary.length > 0 ? dedupedFutureItinerary[0] : null

  return (
    <>
      <div
        style={{
          fontSize: `small`,
          color: `gray`,
          fontStyle: `italic`,
        }}
      >
        Following are automatically generated from my{" "}
        <a
          href="https://docs.google.com/spreadsheets/d/115_n7jB4DH062_OW9zcOHeezJi-MLRqUfeR8V1dpzhQ/edit?usp=sharing"
          style={{ color: `inherit` }}
        >
          planning spreadsheet
        </a>
        , which is updated regularly:{" "}
      </div>
      {todayItinerary && (
        <div>
          Today ({todayItinerary.date}), I'm spending the night at{" "}
          <LocationDisplay name={todayItinerary.nightAt} />.
        </div>
      )}

      {tomorrowItinerary && (
        <div>
          Tomorrow ({tomorrowItinerary.date}), I'm planning to spend the night
          at <LocationDisplay name={tomorrowItinerary.nightAt} />.{" "}
          {nextItinerary &&
            nextItinerary.nightAt !== tomorrowItinerary.nightAt && (
              <span>
                Next location is likely{" "}
                <LocationDisplay name={nextItinerary.nightAt} /> on{" "}
                {nextItinerary.date}.{" "}
                <a
                  onClick={_ => setExpanded(!expanded)}
                  style={{ fontSize: `small` }}
                  href="#"
                >
                  {" "}
                  {expanded ? "Show less" : "Show more"}
                </a>
              </span>
            )}
        </div>
      )}

      {expanded && (
        <div>
          <h5>
            Upcoming desinations (planned and subject to change!){" "}
            <a
              onClick={_ => setExpanded(!expanded)}
              style={{ fontSize: `small` }}
              href="#"
            >
              Hide
            </a>
          </h5>
          <table
            style={{
              fontSize: `small`,
            }}
          >
            <tbody>
              {dedupedFutureItinerary.map(i => (
                <tr key={i.nightAt}>
                  <td>{i.date}</td>
                  <td>{i.nightAt}</td>
                  <td>
                    {i.stoppingPoints && i.stoppingPoints.trim() !== "" && (
                      <span>via {i.stoppingPoints.split("|").join(",")}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default ItinerarySummary
