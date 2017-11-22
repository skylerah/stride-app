import React, { PureComponent } from 'react';
import AP from 'simple-xdm/dist/iframe';
import Btn from '@atlaskit/button';

export default class Opportunity extends PureComponent {
    
    insertMessage = () => {
        var message = 'Let\'s discuss this: ' + this.props.link;
        AP.chat.setMessageBody({
            "version": 1,
            "type": "doc",
            "content": [
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": message
                        }
                    ]
                }
            ]
        });
    }

    invokeMessage = () => {
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

                fetch('https://api.azuqua.com/flo/6575ef19f9834040a0a28a529bf97cc5/invoke?clientToken=4dd8307a8e296d9173f27b34a8ad380dfd821625425d93002930414b7686487c', options)
                    .then((res) => res.json()
                        .then((data) => {
                            console.log('invoked');
                        }));
            });
    }

    render() {
        return (
            <Btn appearance="default" onClick={this.invokeMessage}>Discuss</Btn>
        )
    }
}