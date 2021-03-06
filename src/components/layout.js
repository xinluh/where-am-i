import React, { useState } from "react"
import { Link } from "gatsby"
import NewBlogEntryLink from "../components/NewBlogEntryLink"

import { rhythm, scale } from "../utils/typography"

const Layout = ({ location, title, children }) => {
  const [hiddenButtonClicked, setHiddenButtonClicked] = useState(false)

  const rootPath = `${__PATH_PREFIX__}/`
  let header

  if (location.pathname === rootPath) {
    header = (
      <h1
        style={{
          ...scale(1.5),
          marginBottom: rhythm(1.5),
          marginTop: 0,
        }}
      >
        <Link
          style={{
            boxShadow: `none`,
            textDecoration: `none`,
            color: `inherit`,
          }}
          to={`/`}
        >
          {title}
        </Link>
      </h1>
    )
  } else {
    header = (
      <h3
        style={{
          fontFamily: `Montserrat, sans-serif`,
          marginTop: 0,
        }}
      >
        <Link
          style={{
            boxShadow: `none`,
            textDecoration: `none`,
            color: `inherit`,
          }}
          to={`/`}
        >
          {title}
        </Link>
      </h3>
    )
  }
  return (
    <div
      style={{
        marginLeft: `auto`,
        marginRight: `auto`,
        maxWidth: rhythm(30),
        padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
      }}
    >
      <header>{header}</header>
      <main>{children}</main>
      <footer
        style={{
          color: `lightgray`,
          fontFamily: `monospace`,
        }}
      >
        <span onClick={e => setHiddenButtonClicked(!hiddenButtonClicked)}>
          © Xinlu Huang {new Date().getFullYear()}
        </span>

        <span>
          {" "}
          Built using Gatsbyjs{" "}
          <a
            href="https://github.com/xinluh/where-am-i"
            style={{ color: `inherit` }}
          >
            [GitHub]
          </a>
        </span>
        {hiddenButtonClicked && <NewBlogEntryLink />}
      </footer>
    </div>
  )
}

export default Layout
