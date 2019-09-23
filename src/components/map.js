import React from "react"
import ReactMapGL, {Marker} from 'react-map-gl';
import pin from '../../static/pin.png';

class Map extends React.Component {
    mapBoxToken = 'pk.eyJ1IjoiamFtZXNiZW5ucyIsImEiOiJjazB1bjI2ZnQwMGh6M2xxdjVmNjdlN3FxIn0.tpcyfL3ZMj552DADyRP1bQ';
    state = {
        viewport: {
            zoom: 10,
            latitude: 0.951741,
            longitude: 0.765364
        }
    };

    onViewportChange = ({viewport}) => {
        const {width, height, ...etc} = viewport;
        this.setState({viewport: etc})
    }

    componentWillReceiveProps() {
        console.log('highlightedpin',this.props.highlightedPin);
        // const coordinates = {
        //     latitude: 0.951741,
        //     longitude: 0.765364
        // };

        if(!!this.props.highlightedPin) {
            const coordinates = {};
            const {lat, lon} = this.props.pins.find(marker => marker.slug === this.props.highlightedPin);
            coordinates.latitude = lat;
            coordinates.longitude = lon;
            this.setState({viewport: {...this.state.viewport, ...coordinates}});
        }
        // console.log(coordinates);
        // this.setState({viewport: {...this.state.viewport, ...coordinates}});
    }

    render() {
        return (
        <ReactMapGL
            width='100%'
            height='100%'
            {...this.state.viewport}
            mapboxApiAccessToken={this.mapBoxToken}
            onViewportChange={(viewport) => this.onViewportChange({viewport})}
        >
            {this.props.pins.map(marker => <Marker latitude={marker.lat} longitude={marker.lon}><img width={'20px'} src={pin} alt/></Marker>)}
        </ReactMapGL>
        );
    }
}

export default Map;