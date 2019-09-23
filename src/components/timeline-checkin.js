import React from "react";
import pin from '../../static/pin.png';

class CheckIn extends React.Component {

    render() {
        return (
            <article className={'check-in'}>
                <img alt={''} src={pin}/>
                <header>
                    <h3 className={'no-margin'}>{this.props.date}</h3>
                    <h1 className={'no-margin'}>Auto check-in</h1>
                </header>
            </article>
        );
    }
}

export default CheckIn;