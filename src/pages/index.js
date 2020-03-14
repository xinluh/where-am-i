import React, { useState, useEffect } from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"
import { fetchItinerary } from "../utils/google_sheet"
import MapChart from "../components/map"
import ErrorBoundary from "../components/ErrorBoundary"
import ItinerarySummary from "../components/ItinerarySummary"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allMarkdownRemark.edges

  const [itinerary, setItinerary] = useState([])
  useEffect(() => {
    fetchItinerary().then(iti => {
      setItinerary(iti)
    })
  }, [])

  const mapItinerary = itinerary
    .filter(
      (d, idx) =>
        d.nightAt &&
        (idx === 0 || itinerary[idx - 1].nightAt !== itinerary[idx].nightAt)
    )
    .filter(l => l.lat && l.lon)

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="All posts" />

      <ItinerarySummary itinerary={itinerary} />
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
