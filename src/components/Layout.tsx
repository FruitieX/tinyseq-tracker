import React from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { StaticQuery, graphql } from 'gatsby';
import './reset.css';

const GridContainer = styled.main`
  display: grid;
  place-content: center;
  height: 100vh;

  font-family: sans-serif;
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
        />
        <GridContainer>{children}</GridContainer>
      </>
    )}
  />
);

export default Layout;
