import React, { useState } from "react"
import styles from "./ItinerarySummary.module.css"

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
  const [expandedFuture, setExpandedFuture] = useState(false)
  const [expandedPast, setExpandedPast] = useState(false)

  const todayItinerary = itinerary.find(i => i.isToday)
  const tomorrowItinerary = itinerary.find(i => i.isFuture)

  const dedupedFutureItinerary = itinerary
    .filter(i => parseFloat(i.drivingDistance) > 0)
    .filter(i => i.isFuture)

  const nextItinerary =
    dedupedFutureItinerary.length > 0 ? dedupedFutureItinerary[0] : null

  const drivenMiles = itinerary
    .filter(i => i.isPast)
    .map(i => parseFloat(i.drivingDistance) || 0)
    .reduce((a, b) => a + b, 0)

  const drivenHours = itinerary
    .filter(i => i.isPast)
    .map(i => parseFloat(i.drivingHours) || 0)
    .reduce((a, b) => a + b, 0)

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
          <LocationDisplay name={todayItinerary.nightAt} />. This is day{" "}
          {todayItinerary.dayOfTrip} of my trip; so far I have driven{" "}
          <b>{drivenMiles}</b> miles so far in <b>{drivenHours}</b> hours.{" "}
          <a
            onClick={_ => setExpandedPast(!expandedPast)}
            style={{ fontSize: `small` }}
            href="#"
          >
            {" "}
            {expandedPast ? "Show less" : "Show more"}
          </a>
        </div>
      )}

      {expandedPast && (
        <div>
          <h5>
            Where have I been?{" "}
            <a
              onClick={_ => setExpandedPast(!expandedPast)}
              style={{ fontSize: `small` }}
              href="#"
            >
              Hide
            </a>
          </h5>
          <table className={styles.itineraryTable}>
            <tbody>
              {itinerary
                .filter(i => i.isPast)
                .map(i => (
                  <tr key={i.date}>
                    <td>{i.date}</td>
                    <td>{i.nightAt}</td>
                    <td>
                      {i.stoppingPoints && i.stoppingPoints.trim() !== "" && (
                        <span>via {i.stoppingPoints.split("|").join(",")}</span>
                      )}
                    </td>
                    <td>
                      {i.drivingDistance && (
                        <span>
                          {i.drivingDistance} miles / {i.drivingHours} hours
                          driven
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
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
                {nextItinerary.date} b.{" "}
              </span>
            )}
          <a
            onClick={_ => setExpandedFuture(!expandedFuture)}
            style={{ fontSize: `small` }}
            href="#"
          >
            {" "}
            {expandedFuture ? "Show less" : "Show more"}
          </a>
        </div>
      )}

      {expandedFuture && (
        <div>
          <h5>
            Upcoming destinations (planned - subject to change!){" "}
            <a
              onClick={_ => setExpandedFuture(!expandedFuture)}
              style={{ fontSize: `small` }}
              href="#"
            >
              Hide
            </a>
          </h5>
          <table className={styles.itineraryTable}>
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
