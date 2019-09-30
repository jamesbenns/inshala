import React from "react"
import { Link, graphql } from "gatsby"
import ReactMapGL, {Marker} from 'react-map-gl';
import pin from '../../static/pin.png';
import { Helmet } from "react-helmet"

class BlogPostTemplate extends React.Component {
  mapBoxToken = 'pk.eyJ1IjoiamFtZXNiZW5ucyIsImEiOiJjazB1bjI2ZnQwMGh6M2xxdjVmNjdlN3FxIn0.tpcyfL3ZMj552DADyRP1bQ';
  posts = this.props.data.allMarkdownRemark.edges.map(({node}) => node).filter(post => !!post.frontmatter.description);
  currentIndex = this.posts.findIndex(post => post.fields.slug === this.props.pathContext.slug);
  post = this.props.data.markdownRemark;
  state = {
    viewport: {
      latitude: parseFloat(this.props.data.markdownRemark.frontmatter.lat),
      longitude: parseFloat(this.props.data.markdownRemark.frontmatter.lon),
      zoom: 10
    }
  }
  render() {
    const nextPost = this.posts[this.currentIndex - 1];
    const previousPost = this.posts[this.currentIndex + 1];
    return (
      <div>
        <div className={'home-container'}>
          <Link to='/'>
            <h1>Inshala</h1>
          </Link>
        </div>
        <Helmet>
          <title>⛵- {this.post.frontmatter.title}</title>
        </Helmet>
        {!!nextPost && <Link to={nextPost.fields.slug} rel="next">
          <div className={'next arrow'}>←</div>
        </Link>}
        {!!previousPost && <Link to={previousPost.fields.slug} rel="previous">
          <div className={'previous arrow'}>→</div>
        </Link>}
        <ReactMapGL
          width={'100%'}
          height={400}
          {...this.state.viewport}
          mapboxApiAccessToken={this.mapBoxToken}
          onViewportChange={({zoom, ...viewport}) => this.setState({viewport: {...this.state.viewport, zoom}})}
        >
          <Marker offsetTop={-60} offsetLeft={-18} latitude={parseFloat(this.props.data.markdownRemark.frontmatter.lat)} longitude={parseFloat(this.props.data.markdownRemark.frontmatter.lon)}>
            <img height={'60px'} src={pin} alt=''/>
          </Marker>
        </ReactMapGL>
        <article className={'blog-post'}>
          <div className={'line'}></div>
          <header>
              <h3 className={'no-margin'}>{this.post.frontmatter.date}</h3>
              <h1 className={'no-margin'}>{this.post.frontmatter.title}</h1>
          </header>
          <section dangerouslySetInnerHTML={{ __html: this.post.html }} />
        </article>
      </div>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        lat
        lon
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            description
          }
        }
      }
    }
  }
`
