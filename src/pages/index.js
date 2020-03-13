import React, { useState, useEffect } from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"
import fetchSheet from "../utils/google_sheet"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allMarkdownRemark.edges

  const [itinerary, setItinerary] = useState([])
  useEffect(() => {
    fetchSheet().then(iti => {
      setItinerary(iti)
    })
  }, [])

  const today = new Date()
  console.log(`${today.getMonth()}/${today.getDate()}`)
  const todayItinerary = itinerary.find(i => i.isToday)
  const tomorrowItinerary = itinerary.find(i => i.isFuture)

  console.log(itinerary)
  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="All posts" />

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
