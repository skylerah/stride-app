import React, { PureComponent } from 'react';
import Button from '@atlaskit/button';
import AP from 'simple-xdm/dist/iframe';

export default class AuthConfiguration extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            authorizeLink: null
        };
    }

    componentWillMount = () => {
    }

    closeDialog = () => {
        AP.dialog.close();
    }

    render() {
        return (    
            <div className="configuration-page">
                <div className="image-container">
                    <img src="https://image.ibb.co/jXLiL6/Salesforce_Azuqua.png" />   
                </div>
                <div className="intro-text">
                    To get started, please complete the configuration process for the app. This dialog window will close once you have begun configuration.
                </div>
                <div className="button-container">
                    <Button onClick={this.closeDialog} appearance="primary" href="https://6188.pg.azu.qa:443/setup" target="_blank">Configure Your App</Button>
                </div>
            </div>
        )
    }
}