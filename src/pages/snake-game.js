import React from "react"

import Layout from "../components/Layout"
import Head from "../components/Head"
import Snake from "../projects/Snake"

const SnakeGame = ({ location }) => {
  const title = "Snake Game"

  return (
    <Layout title={title} projectName="Snake" location={location}>
      <Head title={title} />
      <Snake />
    </Layout>
  )
}

export default SnakeGame
