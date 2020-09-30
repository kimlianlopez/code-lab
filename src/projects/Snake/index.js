import React, { useEffect, useRef, useState } from "react"
import { times, isEqual, head, last } from "lodash"
import "@fortawesome/fontawesome-free/css/all.css"

import "./style.scss"

const getDirectionKeyword = code => {
  switch (code) {
    case "ArrowUp":
      return "top"
    case "ArrowRight":
      return "right"
    case "ArrowDown":
      return "bottom"
    case "ArrowLeft":
      return "left"
    default:
      return "left"
  }
}

const isValidDirection = (requestedDirection, currentDirection) => {
  const isValid = validAddresses => validAddresses.includes(requestedDirection)

  switch (currentDirection) {
    case "top":
    case "bottom":
      return isValid(["right", "left"])
    case "right":
    case "left":
      return isValid(["bottom", "top"])
    default:
      return false
  }
}

const getEqualDirection = direction => {
  switch (direction) {
    case "left":
      return "left"
    case "top":
      return "top"
    case "right":
      return "left"
    case "bottom":
      return "top"
    default:
      return "left"
  }
}

const Mouse = ({ left, top, dimension }) => {
  return (
    <div
      id="mouse"
      style={{ left, top, width: dimension, height: dimension }}
    ></div>
  )
}

const Snake = ({ dimension, bodyPositions }) => {
  return bodyPositions.map(({ left, top }, i) => {
    return (
      <div
        style={{ left, top, width: dimension, height: dimension }}
        key={`body--${i}`}
        className="snake-body"
      ></div>
    )
  })
}

const getNextBodyPosition = (bodyPositions, direction, dimension) => {
  let prevBody = null

  const newBodyPositions = bodyPositions.map((body, i) => {
    let newBody = {}

    if (i === 0) {
      prevBody = { ...body }

      const equalDirection = getEqualDirection(direction)

      if (direction === "left" || direction === "top") {
        newBody = {
          ...body,
          [equalDirection]: body[equalDirection] - dimension,
        }
      } else if (direction === "right" || direction === "bottom") {
        newBody = {
          ...body,
          [equalDirection]: body[equalDirection] + dimension,
        }
      }

      return newBody
    } else {
      newBody = { ...prevBody }
      prevBody = { ...body }

      return newBody
    }
  })

  return newBodyPositions
}

const GameController = ({ gameStatus }) => {
  const buttonController = useRef(null)

  return (
    <div className={`controls d-${gameStatus !== "ONGAME" ? "flex" : "none"}`}>
      <button
        className={`btn btn-primary ${gameStatus !== "OVER" ? "paused" : ""}`}
        id="gameController"
        ref={buttonController}
      >
        <i className="fa fa-play"></i>
        <i className="fa fa-redo"></i>
      </button>
    </div>
  )
}

const GameStatus = ({ score }) => {
  return (
    <div className="game-status d-flex ml-5">
      <div>
        <h1 id="gameScore">{score}</h1>
      </div>
    </div>
  )
}

const getCorrectGameStatus = currentGameStatus => {
  switch (currentGameStatus) {
    case "INIT":
      return "ONGAME"
    case "ONGAME":
      return "PAUSED"
    case "PAUSED":
      return "ONGAME"
    case "OVER":
      return "INIT"
    default:
      return "ONGAME"
  }
}

function getNewMousePosition(
  mouseWasEaten,
  container,
  dimension,
  positions,
  mousePosition = null
) {
  if (!mouseWasEaten) {
    return mousePosition
  }

  const getRandomAxisPosition = n =>
    (Math.floor(Math.random() * n) + 1) * dimension

  const generateNewMousePosition = (xRange, yRange) => {
    // Random left and top positions
    const left = getRandomAxisPosition(xRange)
    const top = getRandomAxisPosition(yRange)

    let isInvalidMousePosition = positions.find(
      b => left === b.left && top === b.top
    )

    if (isInvalidMousePosition) {
      return generateNewMousePosition(xRange, yRange)
    }

    return { left, top }
  }

  // X and Y range
  const xRange = (container.width - dimension) / dimension
  const yRange = (container.height - dimension) / dimension

  return generateNewMousePosition(xRange, yRange)
}

function checkIfCollidedWithBody(direction, positions, dimension, snakeHead) {
  // const { direction, positions } = bodyProps
  const axis = getEqualDirection(direction)
  const collidedWithBody = positions.find((body, i) => {
    if (i !== 0) {
      const addDimension = pos => (pos.includes(direction) ? dimension : 0)
      const headPosition = snakeHead[axis] + addDimension(["right", "bottom"])
      const bodyPosition = body[axis] + addDimension(["top", "left"])

      if (axis === "top") {
        return headPosition === bodyPosition && snakeHead.left === body.left
      }

      if (axis === "left") {
        return headPosition === bodyPosition && snakeHead.top === body.top
      }
    }

    return false
  })

  return !!collidedWithBody
}

const initialState = {
  score: 0,
  bodyCount: 15,
  gameStatus: "INIT",
  direction: "left",
  currentDirection: "left",
  allBodyPos: [],
  mousePosition: {
    left: 150,
    top: 195,
  },
  snakePosition: {
    left: 300,
    top: 255,
  },
  borders: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
}

const SnakeGame = () => {
  const dimension = 15
  const gameContainer = {
    width: 600,
    height: 510,
  }
  const borders = {
    top: 0,
    left: 0,
    right: gameContainer.width - dimension,
    bottom: gameContainer.height - dimension,
  }

  // STATES
  const [score, setScore] = useState(initialState.score)
  const [mousePosition, setMousePosition] = useState(initialState.mousePosition)
  const [gameStatus, setGameStatus] = useState(initialState.gameStatus)
  const [bodyProps, setBodyProps] = useState({
    bodyCount: initialState.bodyCount,
    direction: initialState.direction,
    positions: times(initialState.bodyCount, i => {
      return {
        left: initialState.snakePosition.left + dimension * i,
        top: initialState.snakePosition.top,
      }
    }),
  })

  const snakeHead = head(bodyProps.positions)
  const onEdge =
    snakeHead[getEqualDirection(bodyProps.direction)] ===
    borders[bodyProps.direction]
  const mouseWasEaten = isEqual(snakeHead, mousePosition)
  const bodyDidCollide = checkIfCollidedWithBody(
    bodyProps.direction,
    bodyProps.positions,
    dimension,
    snakeHead
  )

  // Add arrow keys listener
  useEffect(() => {
    // console.log('Effect ArrowListener')
    async function onKeyDown(e) {
      const newDirection = getDirectionKeyword(e.code)
      const acceptedKeyCodes = [
        "ArrowUp",
        "ArrowRight",
        "ArrowDown",
        "ArrowLeft",
      ]

      const isValidKeycode = acceptedKeyCodes.find(code => code === e.code)

      if (e.code === "Enter") {
        setGameStatus(getCorrectGameStatus(gameStatus))
      }

      if (isValidKeycode && gameStatus === "ONGAME") {
        if (isValidDirection(newDirection, bodyProps.direction)) {
          setBodyProps({
            ...bodyProps,
            direction: newDirection,
          })
        }

        // setBodyProps({
        //   ...bodyProps,
        //   direction: newDirection,
        //   positions: getNextBodyPosition(
        //     bodyProps.positions,
        //     newDirection,
        //     dimension
        //   )
        // })
      }
    }

    document.addEventListener("keydown", onKeyDown)

    return function removeKeyDownListener() {
      document.removeEventListener("keydown", onKeyDown)
    }
  })

  // set new mouse position if mouse was eaten
  useEffect(() => {
    setMousePosition(
      getNewMousePosition(
        mouseWasEaten,
        gameContainer,
        dimension,
        bodyProps.positions,
        mousePosition
      )
    )
  }, [mouseWasEaten])

  // reset mouse position
  useEffect(() => {
    if (gameStatus === "INIT") {
      setMousePosition(initialState.mousePosition)
    }
  }, [gameStatus])

  // set new score
  useEffect(() => {
    setScore(score => score + (mouseWasEaten | 0))
  }, [mouseWasEaten])

  // reset score
  useEffect(() => {
    if (gameStatus === "INIT") {
      setScore(0)
    }
  }, [gameStatus])

  // if onEdge, set gameStatus to over
  useEffect(() => {
    // console.log('Effect OnEdge')
    if (onEdge) {
      setGameStatus("OVER")
    }
  }, [onEdge])

  // if collides with body, set gameStatus to over
  useEffect(() => {
    if (bodyDidCollide) {
      setGameStatus("OVER")
    }
  }, [bodyDidCollide])

  // update body count
  useEffect(() => {
    // console.log('Effect BodyProps')
    // Reset Body Props
    if (gameStatus === "INIT") {
      setBodyProps({
        bodyCount: initialState.bodyCount,
        direction: initialState.direction,
        positions: times(initialState.bodyCount, i => {
          return {
            left: initialState.snakePosition.left + dimension * i,
            top: initialState.snakePosition.top,
          }
        }),
      })
    }

    // If mouse was eaten
    if (mouseWasEaten) {
      setBodyProps(bodyProps => {
        const { bodyCount, positions, direction } = bodyProps
        const newBodyCount = bodyCount + +mouseWasEaten

        return {
          direction,
          bodyCount: newBodyCount,
          positions: times(newBodyCount, i => {
            if (i === newBodyCount - 1) {
              const lastBody = last(positions)
              return {
                ...lastBody,
                [direction]: lastBody[direction] + dimension,
              }
            }

            return { ...positions[i] }
          }),
        }
      })
    }
  }, [mouseWasEaten, gameStatus])

  // move snake
  useEffect(() => {
    // console.log('Effect SnakeMover')
    if (gameStatus !== "ONGAME") return

    let moveSnake = setTimeout(() => {
      setBodyProps({
        ...bodyProps,
        positions: getNextBodyPosition(
          bodyProps.positions,
          bodyProps.direction,
          dimension
        ),
      })
    }, 50)

    return () => clearTimeout(moveSnake)
  })

  return (
    <div id="snakeGameContainer" className="d-flex flex-grow-1">
      <div className="snake-main-container">
        <GameController gameStatus={gameStatus} setGameStatus={setGameStatus} />
        <Mouse
          left={mousePosition.left}
          top={mousePosition.top}
          dimension={dimension}
        />
        <Snake dimension={dimension} bodyPositions={bodyProps.positions} />
      </div>
      <GameStatus score={score} />
    </div>
  )
}

export default SnakeGame
