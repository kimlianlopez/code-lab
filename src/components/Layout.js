import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import "./Layout.scss"

const Layout = ({ title, children, projectName }) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            repoLink
          }
        }
      }
    `
  )

  const basePath = "/blob/master/src/projects/"
  const repoLink = `${site.siteMetadata.repoLink}${basePath}${projectName}`

  return (
    <div className="main-wrapper d-flex flex-column">
      <header className="main-header container mb-4">
        <div className="row no-gutters align-items-center">
          <div className="col-12 col-xl-6 mb-3 mb-lg-0">
            <h1 className="main-heading mr-3">{title}</h1>
          </div>
          <div className="col-12 col-xl-6 d-flex flex-column flex-sm-row justify-content-xl-end">
            <a
              href="https://thekimlopez.com/portfolio"
              className="mb-3 mb-sm-0 mr-sm-3 btn btn-info project-links"
            >
              View other Projects
            </a>
            {projectName ? (
              <a
                href={repoLink}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary project-links"
              >
                View on Github
              </a>
            ) : (
              ""
            )}
          </div>
        </div>
      </header>
      <main className="container d-flex">
        <div className="row no-gutters w-100 align-items-center">
          {children}
        </div>
      </main>
      <footer className="container">
        <div className="row no-gutters">
          © twentytwenty | <strong className="ml-2">Kim Lopez</strong>
        </div>
      </footer>
    </div>
  )
}

Layout.propTypes = {
  title: PropTypes.string.isRequired,
  projectName: PropTypes.string.isRequired,
}

export default Layout
