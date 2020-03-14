import React, { useState, useEffect } from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"
import { fetchItinerary } from "../utils/google_sheet"
import MapChart from "../components/map"
import ErrorBoundary from "../components/ErrorBoundary"

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

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allMarkdownRemark.edges

  const [itinerary, setItinerary] = useState([])
  useEffect(() => {
    fetchItinerary().then(iti => {
      setItinerary(iti)
    })
  }, [])

  const todayItinerary = itinerary.find(i => i.isToday)
  const tomorrowItinerary = itinerary.find(i => i.isFuture)
  const mapItinerary = itinerary
    .filter(
      (d, idx) =>
        d.nightAt &&
        (idx === 0 || itinerary[idx - 1].nightAt !== itinerary[idx].nightAt)
    )
    .filter(l => l.lat && l.lon)

  const nextItinerary = itinerary
    .filter(i => i.isFuture)
    .find(i => i.nightAt !== todayItinerary.nightAt)

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="All posts" />

      <div
        style={{
          fontSize: `small`,
          color: `gray`,
          fontStyle: `italic`,
        }}
      >
        Following are automatically generated from my{" "}
        <a href="https://docs.google.com/spreadsheets/d/115_n7jB4DH062_OW9zcOHeezJi-MLRqUfeR8V1dpzhQ/edit?usp=sharing">
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
                {nextItinerary.date}.
              </span>
            )}
        </div>
      )}

      <ErrorBoundary errorMessage={null}>
        {mapItinerary.length > 0 && <MapChart locations={mapItinerary} />}
      </ErrorBoundary>

      {posts.map(({ node }) => {
        const title = node.frontmatter.title || node.fields.slug
        return (
          <article key={node.fields.slug}>
            <header>
              <h3
                style={{
                  marginBottom: rhythm(1 / 4),
                }}
              >
                <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                  {title}
                </Link>
              </h3>
              <small>{node.frontmatter.date}</small>
            </header>
            <section>
              <p
                dangerouslySetInnerHTML={{
                  __html: node.frontmatter.description || node.excerpt,
                }}
              />
            </section>
          </article>
        )
      })}
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`
