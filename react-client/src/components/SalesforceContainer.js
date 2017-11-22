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
    }

    componentDidMount() {
        // this.registerEventListener();
    }

    registerEventListener = () => {
        AP.register({
            "message-action-fired": (message) => {
                
                var string = '';
                var parentNodeArray = message.context.message.body.content;

                console.log(parentNodeArray);
    
                parentNodeArray.forEach((childNode) => {
                    if (childNode.type === 'paragraph') {
                        var contentNode = childNode.content;
                        contentNode.forEach((content) => {
                            if (content.type === 'text') {
                                string += content.text;
                            }
                            if (content.type === 'mention') {
                                string += content.attrs.text;
                            }
                        });
                    }
                });
                console.log(string);
                if (string.length > 0) {
                    this.setState({ message: string });
                } else {
                    this.setState({view: 'invalid'})
                }
                
            }
        });
    }    

    sendMessage = (url) => {
        this.setState({ view: 'sending' });
        var options = {
            method: 'POST',
            body: JSON.stringify({ salesforceUrl: url, message: this.state.message })
        };

        console.log(url, this.state.message);

        fetch('https://api.azuqua.com/flo/5cfd143b7dbbbadd924751de81cd756a/invoke?clientToken=86eee094f1ab5c7bdbd763e5f1fbe1f85e6a7629579061f962d95d9ef018be14', options)
            .then((res) => res.json()
                .then(() => {
                    this.setState({ view: 'sent' })
                }));
    }

    generateRecentOpportunities = () => {
        //gets opportunities
        // var endpoint = 'https://api.azuqua.com/flo/8aedecaf3907f5719112cccf26ab7cbe/invoke?clientToken=69fd51569e4a8d1cc45c1277c2eb39129e92d6b3031527dce0c85e3f52b4df17';
        // fetch(endpoint)
        //     .then((res) => res.json()
        //     .then((oppts) => {
        //         console.log(oppts);
        //         var opportunities = oppts.data.map((oppt) => {
        //             return <Button onClick={() => this.sendMessage(oppt.oppUrl)}>{oppt.oppName}</Button>
        //         });
        //         this.setState({ opportunities: opportunities });
        //     }));

        var oppts = [
            {
                oppUrl: 'url',
                oppName: 'Opp Name #1',
                amount: '3000',
                oppStatus: 'Won',
                ownerName: 'Skyler Hartle'
            },
            {
                oppUrl: 'url',
                oppName: 'Opp Name #1',
                amount: '3000',
                oppStatus: 'Won',
                ownerName: 'Skyler Hartle'
            },
            {
                oppUrl: 'url',
                oppName: 'Opp Name #1',
                amount: '3000',
                oppStatus: 'Won',
                ownerName: 'Skyler Hartle'
            },
            {
                oppUrl: 'url',
                oppName: 'Opp Name #1',
                amount: '3000',
                oppStatus: 'Won',
                ownerName: 'Skyler Hartle'
            },
            {
                oppUrl: 'url',
                oppName: 'Opp Name #1',
                amount: '3000',
                oppStatus: 'Won',
                ownerName: 'Skyler Hartle'
            }
        ]

        var opportunities = oppts.map((oppt) => {
            return <Button inline={false} onClick={() => this.sendMessage(oppt.oppUrl)} shouldFitContainer>{oppt.oppName}</Button>
        });
        this.setState({ opportunities: opportunities });
    }


    render() {

        let view = null;
        if (this.state.view === null) {
            view = <ButtonGroup>{this.state.opportunities}</ButtonGroup>
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
            <div className="send-to-salesforce">
                {view}
            </div>            
        )
    };
}