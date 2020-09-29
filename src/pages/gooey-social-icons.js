import React from "react"

import Layout from "../components/Layout"
import Head from "../components/Head"
import GooeySocialIcons from "../projects/GooeySocialIcons"

const GooeySocialIconsPage = ({ location }) => {
  return (
    <Layout title="Gooey Social Icons" location={location}>
      <Head title="Gooey Social Icons - just for fun" />
      <GooeySocialIcons />
    </Layout>
  )
}

export default GooeySocialIconsPage
