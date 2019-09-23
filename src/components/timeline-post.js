import React from "react";

class Post extends React.Component {

    render() {
        return (
            <article>
                <header>
                    <h3 className={'no-margin'}>{this.props.date}</h3>
                    <h1 className={'no-margin'}>{this.props.title}</h1>
                </header>
                <section>
                    <p dangerouslySetInnerHTML={{__html: this.props.description}}/>
                </section>
            </article>
        );
    }
}

export default Post;