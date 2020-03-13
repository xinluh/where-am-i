import React, { useState, useEffect } from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"
import fetchSheet from "../utils/google_sheet"
import MapChart from "../components/map"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allMarkdownRemark.edges

  const [itinerary, setItinerary] = useState([])
  useEffect(() => {
    fetchSheet().then(iti => {
      setItinerary(iti)
    })
  }, [])

  const todayItinerary = itinerary.find(i => i.isToday)
  const tomorrowItinerary = itinerary.find(i => i.isFuture)
  const dedupedItinerary = itinerary.filter(
    (d, idx) =>
      d.nightAt &&
      (idx === 0 || itinerary[idx - 1].nightAt !== itinerary[idx].nightAt)
  )

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
          {todayItinerary.nightAt}.
        </div>
      )}

      {tomorrowItinerary && (
        <div>
          Tomorrow ({tomorrowItinerary.date}), I'm planning to spend the night
          at {tomorrowItinerary.nightAt}.
        </div>
      )}

      {dedupedItinerary.length > 0 && <MapChart locations={dedupedItinerary} />}

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
