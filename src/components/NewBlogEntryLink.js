import React, { useState } from "react"

const NewBlogEntryLink = () => {
  const [title, setTitle] = useState("")

  const template = `---
title: ${title}
date: "${new Date().toISOString()}"
description: ""
---

content`

  const filename = title
    .toLowerCase()
    .replace(" ", "-")
    .replace(/[^a-z0-9-]*/gi, "")
  const commitMessage = `[blog] ${title}`

  const url = `https://github.com/xinluh/where-am-i/new/master/content/blog/?filename=blog/${filename}/index.md&value=${encodeURI(
    template
  )}&message=${commitMessage}`

  return (
    <div>
      <input
        type="text"
        name="name"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <a href={url} target="_blank" rel="noopener noreferrer">
        {" "}
        New Entry
      </a>
    </div>
  )
}

export default NewBlogEntryLink
