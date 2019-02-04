import React from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { StaticQuery, graphql } from 'gatsby';
import './reset.css';

const GridContainer = styled.main`
  display: grid;
  place-content: center;
  height: 100vh;

  font-family: 'Roboto Mono', monospace;
  background: #444;
  color: white;
  input,
  select,
  textarea,
  button {
    font-family: inherit;
  }
`;

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <>
        <Helmet
          title={data.site.siteMetadata.title}
          meta={[
            { name: 'description', content: 'Tinyseq tracker' },
            { name: 'keywords', content: 'tinyseq, tracker' },
            {
              name: 'viewport',
              content: 'width=device-width, initial-scale=1',
            },
          ]}
        >
          <link
            href="https://fonts.googleapis.com/css?family=Roboto+Mono"
            rel="stylesheet"
          />
        </Helmet>
        <GridContainer>{children}</GridContainer>
      </>
    )}
  />
);

export default Layout;
