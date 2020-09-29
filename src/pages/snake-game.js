import React from "react"

import Layout from "../components/Layout"
import Head from "../components/Head"
import Snake from "../projects/Snake"

const SnakeGame = ({ location }) => {
  return (
    <Layout
      title="Snake Game"
      repoLink="https://github.com/kimlianlopez/code-lab/blob/master/src/projects/Snake.js"
      location={location}
    >
      <Head title="Snake Game" />
      <Snake />
    </Layout>
  )
}

export default SnakeGame
