require('dotenv').config()

module.exports = {
  siteMetadata: {
    title: "Edward Elric's Blog",
    name: `Edward Elric`,
    siteUrl: `https://edward40.com`,
    description: `Stay Hungry Stay Foolish`,
    hero: {
      heading: `Stay Hungry Stay Foolish`,
      maxWidth: 652
    },
    social: [
      {
        name: `twitter`,
        url: `https://twitter.com/sasuke688848`
      },
      {
        name: `github`,
        url: `https://github.com/sasuke40`
      },
      {
        name: `linkedin`,
        url: `https://www.linkedin.com/in/sasuke/`
      }
    ]
  },
  plugins: [
    {
      resolve: '@narative/gatsby-theme-novela',
      options: {
        contentPosts: 'content/posts',
        contentAuthors: 'content/authors',
        basePath: '/',
        authorsPage: true,
        mailchimp: true,
        sources: {
          local: true
          // contentful: true,
        }
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Edward Elric\'s Blog`,
        short_name: `Edward`,
        start_url: `/`,
        background_color: `#fff`,
        theme_color: `#fff`,
        display: `standalone`,
        icon: `src/assets/favicon.jpg`
      }
    },
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-46826341-2'
      }
    },
    {
      resolve: 'gatsby-plugin-mailchimp',
      options: {
        endpoint:
          'https://edward.us10.list-manage.com/subscribe/post?u=faa3997806ecfab79672c4208&amp;id=f12d75e448'
      }
    }
    // {
    //   resolve: 'gatsby-source-contentful',
    //   options: {
    //     spaceId: process.env.CONTENTFUL_SPACE_ID,
    //     accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
    //   },
    // },
  ]
}
