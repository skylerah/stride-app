import React, { PureComponent } from 'react';
import AP from 'simple-xdm/dist/iframe';
import Btn from '@atlaskit/button';

export default class DiscussButton extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            active: null
        };
    }

    getQueryParam = (name, url) => {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    
    invokeMessage = () => {
        if (this.state.active !== true) {
            this.setState({active: true});
            var link = this.props.link;
            AP.user
                .getCurrentUser()
                .then((user) => {
                    console.log(user);
                    var body = {
                        userId: user.id,
                        opportunityUrl: link
                    }

                    var options = {
                        method: 'POST',
                        body: JSON.stringify(body)
                    };

                    AP.auth.withToken((err, token) => {
                        if (err) {
                            console.error(err);
                            this.setState({ active: false });
                        } else {
                            studio.invokeFlo(41364, { userId: user.id, opportunityUrl: link, jwt: token }, (err, data) => { // eslint-disable-line
                                if (err) {
                                    console.error(err);
                                    this.setState({ active: false });
                                } else {
                                    this.setState({active: false});
                                    console.log('invoked');
                                }
                            });
                        }
                    })

                    //FLO ID: 41364
                    // fetch('https://api.azuqua.com/flo/6575ef19f9834040a0a28a529bf97cc5/invoke?clientToken=4dd8307a8e296d9173f27b34a8ad380dfd821625425d93002930414b7686487c', options)
                    //     .then((res) => res.json()
                    //         .then((data) => {
                    //             console.log('invoked');
                    //         }));
                });
            }
    }

    render() {
        return (
            <Btn appearance="default" onClick={this.invokeMessage}>Discuss</Btn>
        )
    }
}