import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { useItinerary } from "../utils/data"
import MapChart from "../components/map"
import ErrorBoundary from "../components/ErrorBoundary"
import ItinerarySummary from "../components/ItinerarySummary"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allMarkdownRemark.edges

  const { itinerary, error, loading } = useItinerary()

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Home | Where is Xinlu" />
      <div
        style={{
          border: `solid orange 1px`,
          padding: 10,
          margin: `10px 0px`,
          borderRadius: 5,
          background: `#ffa50014`,
        }}
      >
        Trip has ended! Everything here are frozen as of last day of the trip,
        March 31, 2020.
      </div>

      {error && <div>Ooopsy, couldn't load itinerary</div>}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <ItinerarySummary itinerary={itinerary} />
          <ErrorBoundary errorMessage={null}>
            <MapChart itinerary={itinerary} />
          </ErrorBoundary>
          <div
            style={{
              fontSize: `x-small`,
              color: `lightgray`,
              fontStyle: `italic`,
            }}
          >
            Generated automatically from my{" "}
            <a
              href="https://docs.google.com/spreadsheets/d/115_n7jB4DH062_OW9zcOHeezJi-MLRqUfeR8V1dpzhQ/edit?usp=sharing"
              style={{ color: `inherit` }}
            >
              planning spreadsheet
            </a>
            , which is updated regularly.
          </div>
        </>
      )}

      <ol style={{ listStyle: `none` }}>
        {posts.map(({ node: post }) => {
          const title = post.frontmatter?.title || post.fields.slug

          return (
            <li key={post.fields.slug}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h2>
                    <Link to={post.fields.slug} itemProp="url">
                      <span itemProp="headline">{title}</span>
                    </Link>
                  </h2>
                  <small>{post.frontmatter.date}</small>
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: post.frontmatter.description || post.excerpt,
                    }}
                    itemProp="description"
                  />
                </section>
              </article>
            </li>
          )
        })}
      </ol>
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
