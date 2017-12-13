import React, { PureComponent } from 'react';
import Button, {ButtonGroup} from '@atlaskit/button'
import AP from 'simple-xdm/dist/iframe';

export default class SalesforceContainer extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            opportunities: null,
            message: null,
            view: null
        }
    }

    componentWillMount() {
        this.generateRecentOpportunities();
        console.log('yah');
    }

    componentDidMount() {
        this.registerEventListener();
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

    registerEventListener = () => {
        AP.register({
            "message-action-fired": (message) => {
                
                var string = '';
                var parentNodeArray = message.context.message.body.content;

                var options = {
                    method: 'POST',
                    body: JSON.stringify(message.context.message.body)
                };

                fetch('https://api.azuqua.com/flo/fb8197e708ea94881e9adc7c0f819c40/invoke', options)
                    .then((res) => res.json()
                    .then((object) => {
                        console.log('invoked', object);
                        this.setState({message: object.body});
                    }));
            }
        });
    }    

    sendMessage = (url) => {
        this.setState({ view: 'sending' });
        var options = {
            method: 'POST',
            body: JSON.stringify({ salesforceUrl: url, message: this.state.message })
        };
        
        // FLOpages implementation

        var jwt = this.getQueryParam('jwt');
        studio.invokeFlo(41310, {salesforceUrl: url, message: this.state.message, jwt: jwt}, (err, data) => { // eslint-disable-line
            if (err) {
                console.error(err);
            } else {
                this.setState({ view: 'sent'});
            }
        });

        //FLO ID: 41310
        // fetch('https://api.azuqua.com/flo/5cfd143b7dbbbadd924751de81cd756a/invoke?clientToken=86eee094f1ab5c7bdbd763e5f1fbe1f85e6a7629579061f962d95d9ef018be14', options)
        //     .then((res) => res.json()
        //     .then(() => {
        //         this.setState({ view: 'sent' })
        //     }));
    }

    generateRecentOpportunities = () => {
        var jwt = this.getQueryParam('jwt');
        // FLOpages implementation, comment this out, FLOID 41367
        studio.invokeFlo(41367, { jwt: jwt }, (err, oppt) => { // eslint-disable-line
            if (err) {
                console.error(err);
            } else {
                var opportunities = oppt.data.map((oppt) => {
                    return <Button onClick={() => this.sendMessage(oppt.url)} shouldFitContainer>{oppt.name}</Button>
                });
                this.setState({ opportunities: opportunities });
            }
        });


        // Fetch API implementation, uncomment once compiled and ported to FLpages
        // var endpoint = 'https://api.azuqua.com/flo/8aedecaf3907f5719112cccf26ab7cbe/invoke?clientToken=69fd51569e4a8d1cc45c1277c2eb39129e92d6b3031527dce0c85e3f52b4df17';
        // fetch(endpoint)
        //     .then((res) => res.json()
        //     .then((oppts) => {
        //         var opportunities = oppts.data.map((oppt) => {
        //             return <Button onClick={() => this.sendMessage(oppt.oppUrl)}>{oppt.oppName}</Button>
        //         });
        //         this.setState({ opportunities: opportunities });
        //     }));
    }


    render() {

        let view = null;
        if (this.state.view === null) {
            view = this.state.opportunities;
        }
        if (this.state.view === 'sending') {
            view = <div>Currently sending message...</div>;
        }
        if (this.state.view === 'sent') {
            view = <div>Message successfully sent!</div>;
        }
        if (this.state.view === 'invalid') {
            view = <div>Sorry, this feature does not currently support that type of message.</div>
        }

        return (
            <div className="send-container">
                {view}
            </div>            
        )
    };
}