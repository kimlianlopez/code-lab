import React from "react"

import Layout from "../components/Layout"
import Head from "../components/Head"
import GooeySocialIcons from "../projects/GooeySocialIcons"

const GooeySocialIconsPage = ({ location }) => {
  return (
    <Layout
      title="Gooey Social Icons"
      repoLink="https://github.com/kimlianlopez/code-lab/blob/master/src/projects/GooeySocialIcons.js"
      location={location}
    >
      <Head title="Gooey Social Icons" />
      <GooeySocialIcons />
    </Layout>
  )
}

export default GooeySocialIconsPage
