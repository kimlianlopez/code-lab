import React from "react"

import Layout from "../components/Layout"
import Head from "../components/Head"
import GooeySocialIcons from "../projects/GooeySocialIcons"

const GooeySocialIconsPage = ({ location }) => {
  const title = "Gooey Social Icons"

  return (
    <Layout title={title} projectName="GooeySocialIcons" location={location}>
      <Head title={title} />
      <GooeySocialIcons />
    </Layout>
  )
}

export default GooeySocialIconsPage
