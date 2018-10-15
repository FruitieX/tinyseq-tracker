module.exports = {
  siteMetadata: {
    title: 'tinyseq-tracker',
  },
  plugins: [
    'gatsby-plugin-typescript',
    'gatsby-plugin-styled-components',
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'tinyseq-tracker',
        short_name: 'tracker',
        start_url: '/',
        background_color: '#000000',
        theme_color: '#000000',
        display: 'minimal-ui',
        //icon: 'src/images/gatsby-icon.png', // This path is relative to the root of the site.
      },
    },
    //'gatsby-plugin-offline',
  ],
};
