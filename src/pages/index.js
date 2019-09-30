import React from "react"
import { Link, graphql } from "gatsby"
import "../styles/global.css"
import CheckIn from "../components/timeline-checkin";
import Post from "../components/timeline-post";
import ReactMapGL, {Marker, FlyToInterpolator} from 'react-map-gl';
import pin from '../../static/pin.png';
import postPin from '../../static/post-pin.png';
import PolylineOverlay from "../components/line-overlay";
import getPathLength from 'geolib/es/getPathLength';
import getBounds from 'geolib/es/getBounds';
import WebMercatorViewport from 'viewport-mercator-project';
import { Helmet } from "react-helmet"

class BlogIndex extends React.Component {

  mapBoxToken = 'pk.eyJ1IjoiamFtZXNiZW5ucyIsImEiOiJjazB1bjI2ZnQwMGh6M2xxdjVmNjdlN3FxIn0.tpcyfL3ZMj552DADyRP1bQ';
  mapContainer = React.createRef();
  mediaBreakpoint = 1000;

  coordinates = this.props.data.allMarkdownRemark.edges.map(({node}) => ({
    latitude: parseFloat(node.frontmatter.lat),
    longitude: parseFloat(node.frontmatter.lon),
    slug: node.fields.slug,
    post: !!node.frontmatter.description
  }));

  posts = this.props.data.allMarkdownRemark.edges.map(({node}) => ({
    slug: node.fields.slug,
    title: node.frontmatter.title,
    date: node.frontmatter.date,
    coordinates: {
      latitude: parseFloat(node.frontmatter.lat),
      longitude: parseFloat(node.frontmatter.lon)
    },
    description: node.frontmatter.description,
    ref: React.createRef()
  }));

  state = {
    mapFixed: false,
    highlightedPin: '',
    viewport: {
      width: '100%',
      height: '100%'
    }
  };

  componentDidMount() {
    window.addEventListener('scroll', () => this.setState({mapFixed: window.pageYOffset >= 200}));
    window.addEventListener('resize', () => this.setState({viewport: {
      ...this.state.viewport,
      width: window.innerWidth - (window.innerWidth > this.mediaBreakpoint ? 400 : 0),
      height: window.innerWidth > this.mediaBreakpoint ? window.innerHeight : 300
    }}));
    const bounds = getBounds(this.coordinates);
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

  scrollToPost = slug => {
    this.setState({highlightedPin: slug});
    window.scrollTo({
      top: this.posts.find(post => post.slug === slug).ref.current.offsetTop - (window.innerWidth > this.mediaBreakpoint ? 50 : 350),
      behavior: 'smooth'
    })
  }

  clearPin = () => this.setState({highlightedPin: ''});

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
              {parseInt(getPathLength(this.coordinates) * 0.000539957)} NM so far
            </h3>
          </div>
          {this.posts.map( ({slug, coordinates, description, date, title, ref}) => {
            return (
              <div ref={ref} className={this.state.highlightedPin === slug ? 'active' : ''} key={slug} onMouseLeave={this.clearPin} onMouseEnter={() => this.setState({
                viewport: {
                  ...this.state.viewport,
                  ...coordinates,
                  zoom: 10,
                  transitionInterpolator: new FlyToInterpolator(),
                  transitionDuration: 1000
                },
                highlightedPin: slug
              })}>
              {
                !description ? <CheckIn date={date} title={title}></CheckIn> :
                <Link to={slug}>
                  <Post date={date} title={title} description={description}></Post>
                </Link>
              }
              </div>
            )
          })}
        </div>
        <div className={`map ${this.state.mapFixed ? 'fixed' : ''}`} ref={this.mapContainer}>
          <ReactMapGL
            {...this.state.viewport}
            mapboxApiAccessToken={this.mapBoxToken}
            onViewportChange={(viewport) => this.setState({viewport})}
          >
            <PolylineOverlay points={this.coordinates.map(({latitude, longitude}) => [latitude, longitude])}></PolylineOverlay>
            {this.coordinates.map(({latitude, longitude, slug, post}) => {
              if(post) {
                return <div key={slug} onMouseEnter={() => this.scrollToPost(slug)} onMouseLeave={this.clearPin}><Link to={slug}>
                  <Marker offsetTop={-25} offsetLeft={-35} latitude={latitude} longitude={longitude}>
                    <img className={this.state.highlightedPin === slug ? 'enlarge post-pin' : 'post-pin'}  style={{cursor: 'pointer'}} height={'25px'} src={postPin} alt=''/>
                  </Marker>
                </Link></div>
              } else {
                return <div key={slug} onMouseEnter={() => this.scrollToPost(slug)} onMouseLeave={this.clearPin}>
                  <Marker offsetTop={-20} offsetLeft={-5} latitude={latitude} longitude={longitude}>
                    <img className={this.state.highlightedPin === slug ? 'enlarge checkin-pin' : 'checkin-pin'} height={'20px'} src={pin} alt=''/>
                  </Marker>
                </div>
              }
            }
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
