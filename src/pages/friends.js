import React from 'react'
import { graphql } from 'gatsby'
import Image from 'gatsby-image'

import Layout from '../components/layout'
import RouterTabs from '../components/RouterTabs'
import SEO from '../components/seo'

import '../style/friend.css'

const FriendPage = (props) => {
  const { data } = props
  const siteTitle = data.site.siteMetadata.title

  const avatars = data.avatars.edges.filter(
    avatar => /^friend/.test(avatar.node.relativePath))
    .map(avatar => avatar.node)

  return (
    <Layout location={props.location} title={siteTitle}>
      <SEO title='Friends'/>
      <RouterTabs
        routers={data.site.siteMetadata.menuLinks}
        currentPage='/friends'
      />
      <ul className='friends'>
        {data.site.siteMetadata.friendship.map(friend => {
          const image = avatars.find(
            v => new RegExp(friend.image).test(v.relativePath))
          return (
            <li
              key={friend.name}
              className='friend-card'
              onClick={() => window.open(friend.url)}
            >
              <Image
                alt={props.alt}
                fluid={image.childImageSharp.fluid}
                style={{
                  flex: 1,
                  maxWidth: 50,
                  borderRadius: '100%'
                }}
                imgStyle={{
                  borderRadius: '50%'
                }}
              />
              <div className='friend-card-content'>
                <span>{friend.name}</span>
              </div>
            </li>
          )
        })}
      </ul>
    </Layout>
  )
}

export default FriendPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        menuLinks {
          name
          link
        }
        friendship {
          name
          url
          image
        }
      }
    }
    avatars: allFile {
      edges {
        node {
          relativePath
          name
          childImageSharp {
            fluid(maxWidth: 100) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`
