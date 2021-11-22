import React, { useState } from "react"

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

const joinWords = (arr) => {
  if (arr.length === 0) return ""
  if (arr.length === 1) return arr[0]
  return arr.slice(0, -1).join(",") + ", and " + arr.slice(-1)
}

const ItinerarySummary = ({ itinerary }) => {
  const [expandedFuture, setExpandedFuture] = useState(false)
  const [expandedPast, setExpandedPast] = useState(false)

  const todayItinerary = itinerary.find((i) => i.isToday)
  const tomorrowItinerary = itinerary.find((i) => i.isFuture)

  const dedupedFutureItinerary = itinerary
    .filter((i) => parseFloat(i.drivingDistance) > 0)
    .filter((i) => i.isFuture)

  const nextItinerary =
    dedupedFutureItinerary.length > 0 ? dedupedFutureItinerary[0] : null

  const drivenMiles = itinerary
    .filter((i) => i.isPast)
    .map((i) => parseFloat(i.drivingDistance) || 0)
    .reduce((a, b) => a + b, 0)

  const drivenHours = itinerary
    .filter((i) => i.isPast)
    .map((i) => parseFloat(i.drivingHours) || 0)
    .reduce((a, b) => a + b, 0)

  return (
    <>
      {todayItinerary && (
        <div>
          Today ({todayItinerary.date}), I'm spending the night at{" "}
          <LocationDisplay name={todayItinerary.nightAt} />
          {todayItinerary.stoppingPoints.length > 0 && (
            <span>
              , after stopping by {joinWords(todayItinerary.stoppingPoints)}{" "}
              during the day
            </span>
          )}
          . This is day {todayItinerary.dayOfTrip} of my trip; so far I have
          driven <b>{drivenMiles}</b> miles in total of{" "}
          <b>{Math.round(drivenHours)}</b> hours.{" "}
          <a
            onClick={(_) => setExpandedPast(!expandedPast)}
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
              onClick={(_) => setExpandedPast(!expandedPast)}
              style={{ fontSize: `small` }}
              href="#"
            >
              Hide
            </a>
          </h5>
          <table className="itinerary-table">
            <tbody>
              {itinerary
                .filter((i) => i.isPast)
                .map((i) => (
                  <tr key={i.date}>
                    <td>{i.date}</td>
                    <td>{i.nightAt}</td>
                    <td>
                      {i.stoppingPoints.length > 0 && (
                        <span>via {i.stoppingPoints.join(", ")}</span>
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

      {tomorrowItinerary && tomorrowItinerary.nightAt !== "" && (
        <div style={{ marginTop: 10 }}>
          Tomorrow ({tomorrowItinerary.date}), I'm planning to spend the night
          at <LocationDisplay name={tomorrowItinerary.nightAt} />
          {tomorrowItinerary.stoppingPoints.length > 0 && (
            <span>
              , after stopping by {joinWords(tomorrowItinerary.stoppingPoints)}
            </span>
          )}
          .{" "}
          {nextItinerary &&
            nextItinerary.nightAt !== tomorrowItinerary.nightAt && (
              <span>
                Next location is likely{" "}
                <LocationDisplay name={nextItinerary.nightAt} /> on{" "}
                {nextItinerary.date}.{" "}
              </span>
            )}
          <a
            onClick={(_) => setExpandedFuture(!expandedFuture)}
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
              onClick={(_) => setExpandedFuture(!expandedFuture)}
              style={{ fontSize: `small` }}
              href="#"
            >
              Hide
            </a>
          </h5>
          <table className="itinerary-table">
            <tbody>
              {dedupedFutureItinerary.map((i) => (
                <tr key={i.nightAt}>
                  <td>{i.date}</td>
                  <td>{i.nightAt}</td>
                  <td>
                    {i.stoppingPoints.length > 0 && (
                      <span>via {i.stoppingPoints.join(", ")}</span>
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
