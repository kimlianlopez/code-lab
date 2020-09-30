import React, { useState } from "react"

import "./style.scss"

// Gooey Link Component
const GooeyLink = ({ i, link, icon, withLinks }) => {
  return withLinks ? (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className="link"
      style={{ fontSize: icon.size }}
    >
      <i className={icon.name}></i>
    </a>
  ) : (
    ""
  )
}

// Gooey Button Component
const GooeyButtons = ({
  withLinks,
  delay,
  gooeys,
  toggleActive,
  isActive,
  dimension,
  gap,
  iconSize,
}) => {
  const gooeyCount = gooeys.length

  return gooeys.map(({ backgroundColor, link, icon }, i) => {
    // button default styles
    const baseStyle = {
      zIndex: gooeyCount - i,
      width: dimension,
      height: dimension,
    }

    // computation for transition delay based on delay prop
    const transitionDelay = `${
      delay * ((Math.abs((!!isActive && gooeyCount) - i) - 1) / 10)
    }s`

    // button position when active
    if (isActive) {
      baseStyle.transform = `translateX(${dimension * i + gap * i}px)`
    }

    return (
      <li
        key={i}
        className={`slidingIcon icon-${i}`}
        onClick={i === 0 ? toggleActive : null}
        style={
          i === 0
            ? baseStyle
            : { ...baseStyle, transitionDelay, backgroundColor }
        }
      >
        <GooeyLink
          i={i}
          link={link}
          icon={{ name: icon, size: iconSize }}
          withLinks={withLinks}
        />
      </li>
    )
  })
}

const GooeySocialIcons = () => {
  const [active, setActive] = useState(false)

  const props = {
    dimension: 54,
    delay: 4,
    gap: 25,
    iconSize: 26,
    icons: [
      {
        link: "https://facebook.com/",
        icon: "fab fa-facebook-f",
        backgroundColor: "#4064AC",
      },
      {
        link: "https://www.instagram.com/",
        icon: "fab fa-instagram",
        backgroundColor: "#C42562",
      },
      {
        link: "https://whatsapp.com",
        icon: "fab fa-whatsapp",
        backgroundColor: "#2ECF49",
      },
    ],
  }

  const { dimension, gap, icons, delay, iconSize } = props
  const gooeys = [{ icon: "fas fa-plus" }, ...icons]
  const width = `${dimension * gooeys.length + gap * icons.length}px`
  const height = `${dimension}px`

  const toggleActive = () => setActive(active => !active)

  return (
    <div
      className={`gooey-wrapper ${active ? "active" : ""}`}
      title="Click here!"
    >
      <div className="menu" style={{ width, height }}>
        <ul className="toggle">
          <GooeyButtons
            withLinks={false}
            delay={delay}
            gooeys={gooeys}
            isActive={active}
            toggleActive={toggleActive}
            dimension={dimension}
            gap={gap}
            iconSize={iconSize}
          />
        </ul>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          width="0"
          height="0"
        >
          <defs>
            <filter id="goo">
              <feGaussianBlur
                in="SourceGraphic"
                result="blur"
                stdDeviation="12"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                result="joint"
              />
            </filter>
          </defs>
        </svg>
      </div>
      <div className="menu-object" style={{ width, height }}>
        <ul className="toggle">
          <GooeyButtons
            withLinks={true}
            delay={delay}
            gooeys={gooeys}
            isActive={active}
            toggleActive={toggleActive}
            dimension={dimension}
            gap={gap}
            iconSize={iconSize}
          />
        </ul>
      </div>
    </div>
  )
}

export default GooeySocialIcons
