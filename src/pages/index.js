import React from "react"
import { Link, graphql } from "gatsby"
import "../styles/global.css"
import CheckIn from "../components/timeline-checkin";
import Post from "../components/timeline-post";
import ReactMapGL, {Marker, FlyToInterpolator} from 'react-map-gl';
import pin from '../../static/pin.png';
import PolylineOverlay from "../components/line-overlay";
import getPathLength from 'geolib/es/getPathLength';
import getBounds from 'geolib/es/getBounds';
import WebMercatorViewport from 'viewport-mercator-project';
import { Helmet } from "react-helmet"

class BlogIndex extends React.Component {
  mapBoxToken = 'pk.eyJ1IjoiamFtZXNiZW5ucyIsImEiOiJjazB1bjI2ZnQwMGh6M2xxdjVmNjdlN3FxIn0.tpcyfL3ZMj552DADyRP1bQ';
  mapContainer = React.createRef();
  state = {
    coordinates: this.props.data.allMarkdownRemark.edges.map(({node}) => ({
      latitude: parseFloat(node.frontmatter.lat),
      longitude: parseFloat(node.frontmatter.lon),
      slug: node.fields.slug
    })),
    posts: this.props.data.allMarkdownRemark.edges,
    viewport: {
      width: '100%',
      height: '100%'
    }
  };

  componentDidMount() {
    const bounds = getBounds(this.state.coordinates);
    const { longitude, latitude, zoom } = new WebMercatorViewport({width: this.mapContainer.current.clientWidth, height: this.mapContainer.current.clientHeight})
      .fitBounds([
        [bounds['maxLng'], bounds['maxLat']],
        [bounds['minLng'], bounds['minLat']]
      ], {
        padding: this.mapContainer.current.clientWidth < 900 ? 50 : 150
      });
    this.setState({
      viewport: {
        ...this.state.viewport,
        longitude,
        latitude,
        zoom
      }
    });
  }

  render() {
    return (
      <main>
        <Helmet>
          <title>Follow Inshala!</title>
          <script src='https://identity.netlify.com/v1/netlify-identity-widget.js'></script>
        </Helmet>
        <div className={'line'}></div>
        <div className={'posts'}>
          <div className={'title'}>
            <h3 className={'no-margin'}>Sailing yacht</h3>
            <h1 className={'no-margin'}>Inshala</h1>
            <h3 className={'no-margin mileage'}>
              <div className={'ring-container'}>
                <div className={'ringring'}></div>
                <div className={'circle'}></div>
              </div>
              {parseInt(getPathLength(this.state.coordinates) * 0.000539957)} nautical miles so far
            </h3>
          </div>
          {this.state.posts.map( ({ node }) => {
            const title = node.frontmatter.title;
            const date = node.frontmatter.date;
            const coordinates = {
              latitude: parseFloat(node.frontmatter.lat),
              longitude: parseFloat(node.frontmatter.lon)
            };
            const description = node.frontmatter.description;
            return (
              <div key={node.fields.slug} onMouseEnter={() => this.setState({
                viewport: {
                  ...this.state.viewport,
                  ...coordinates,
                  zoom: 10,
                  transitionInterpolator: new FlyToInterpolator(),
                  transitionDuration: 2000
                }
              })}>
              {
                !title ? <CheckIn date={date}></CheckIn> :
                <Link to={node.fields.slug}>
                  <Post date={date} title={title} description={description}></Post>
                </Link>
              }
              </div>
            )
          })}
        </div>
        <div className={'map'} ref={this.mapContainer}>
          <ReactMapGL 
            {...this.state.viewport}
            mapboxApiAccessToken={this.mapBoxToken}
            onViewportChange={(viewport) => this.setState({viewport})}
          >
            <PolylineOverlay points={this.state.coordinates.map(({latitude, longitude}) => [latitude, longitude])}></PolylineOverlay>
            {this.state.coordinates.map(({latitude, longitude, slug}) => 
              <Marker offsetTop={-30} offsetLeft={-9} key={slug} latitude={latitude} longitude={longitude}><img height={'30px'} src={pin} alt=''/></Marker>
            )}
          </ReactMapGL>
        </div>
      </main>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
            lat
            lon
          }
        }
      }
    }
  }
`
