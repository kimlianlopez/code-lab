import React from "react"

import Layout from "../components/Layout"
import Head from "../components/Head"
import Snake from "../projects/Snake"

const SnakeGame = ({ location }) => {
  return (
    <Layout title="Snake Game" location={location}>
      <Head title="Snake Game - just for fun" />
      <Snake />
    </Layout>
  )
}

export default SnakeGame
