import React, { useState } from "react"
import { Link } from "gatsby"
import NewBlogEntryLink from "../components/NewBlogEntryLink"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  const [hiddenButtonClicked, setHiddenButtonClicked] = useState(false)
  let header

  if (isRootPath) {
    header = (
      <h1 className="main-heading">
        <Link to="/">{title}</Link>
      </h1>
    )
  } else {
    header = (
      <Link className="header-link-home" to="/">
        {title}
      </Link>
    )
  }

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">{header}</header>
      <main>{children}</main>
      <footer>
        Built using Gatsbyjs{" "}
        <a
          href="https://github.com/xinluh/where-am-i"
          style={{ color: `inherit` }}
        >
          [GitHub]
        </a>{" "}
        <span onClick={(e) => setHiddenButtonClicked(!hiddenButtonClicked)}>
          © Xinlu Huang {new Date().getFullYear()}
        </span>
        {hiddenButtonClicked && <NewBlogEntryLink />}
      </footer>
    </div>
  )
}

export default Layout
