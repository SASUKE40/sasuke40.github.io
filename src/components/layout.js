import React, { useEffect, useState } from 'react'
import { Link, graphql, useStaticQuery } from 'gatsby'
import Toggle from './Toggle'
import sun from '../assets/sun.png'
import moon from '../assets/moon.png'
import Helmet from 'react-helmet'

import { rhythm } from '../utils/typography'
import moment from 'moment'

const Layout = props => {
  const [theme, setTheme] = useState(null)
  useEffect(() => {
    setTheme(window.__theme)
    window.__onThemeChange = () => setTheme(window.__theme)
  }, [])

  const { title, children } = props
  const data = useStaticQuery(graphql`
    query LayoutQuery {
      site {
        buildTime
      }
    }
  `)

  const header = (
    <h3
      style={{
        fontFamily: 'Montserrat, sans-serif',
        marginTop: 0,
      }}
    >
      <Link
        style={{
          boxShadow: 'none',
          textDecoration: 'none',
          color: 'inherit',
        }}
        to={'/'}
      >
        {title}
      </Link>
    </h3>
  )
  return (
    <div
      style={{
        color: 'var(--textNormal)',
        background: 'var(--bg)',
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: rhythm(24),
        padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
      }}
    >
      <Helmet
        meta={[
          {
            name: 'theme-color',
            content: theme === 'light' ? '#ffa8c5' : '#282c35',
          },
        ]}
      />
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2.625rem',
        }}
      >
        {header}
        {theme != null ? (
          <Toggle
            icons={{
              checked: (
                <img
                  alt="dark"
                  src={moon}
                  width="16"
                  height="16"
                  role="presentation"
                  style={{ pointerEvents: 'none' }}
                />
              ),
              unchecked: (
                <img
                  alt="light"
                  src={sun}
                  width="16"
                  height="16"
                  role="presentation"
                  style={{ pointerEvents: 'none' }}
                />
              ),
            }}
            checked={theme === 'dark'}
            onChange={e =>
              window.__setPreferredTheme(e.target.checked ? 'dark' : 'light')
            }
          />
        ) : (
          <div style={{ height: '24px' }} />
        )}
      </header>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()}, Built on{' '}
        {moment(data.site.buildTime).format('YYYY-MM-DD HH:mm')} with{' '}
        <a href="https://www.gatsbyjs.org">Gatsby</a>
      </footer>
    </div>
  )
}

export default Layout
