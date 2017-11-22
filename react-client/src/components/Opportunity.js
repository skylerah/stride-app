import React, { PureComponent } from 'react';
import AP from 'simple-xdm/dist/iframe';
import Avatar from '@atlaskit/avatar';
import Lozenge from '@atlaskit/lozenge'
import DiscussButton from './DiscussButton';

export default class Opportunity extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            profilePicture: null
        };
    }

    componentWillMount() {
        this.createProfilePicture();
    }

    createProfilePicture = () => {
        var ownerEmail = this.props.ownerEmail;
        AP.conversation.getRoster((err, roster) => {
            if (err) {
                console.error(err);
            } else {
                AP.auth.withToken((err, token) => {
                    if (err) {
                        console.error(err);
                    } else {
                        var requestHeaders = new Headers();
                        requestHeaders.append("Authorization", "Bearer " + token);
                        requestHeaders.append("Accept", "application/json");
                        requestHeaders.append("Content-Type", "application/json");
                        
                        var body = {
                            roster: roster,
                            email: ownerEmail
                        }

                        var options = {
                            headers: requestHeaders,
                            method: 'POST',
                            body: JSON.stringify(body)
                        };

                        //replace with FLO URL
                        fetch('localhost:3000/getUser', options)
                        .then((res) => res.json()
                        .then((data) => {
                            this.setState({profilePicture: data.value});
                        }));     
                    }
                })
            }
        });
    }
    render() {
        return (
            <div className="opportunity">
                <ul className="closed-details">
                    {<li className="profile-picture"><Avatar name={this.props.ownerName} size="small" src={this.state.profilePicture} /></li>}
                    <li className="opportunity-name">{this.props.name}</li>
                </ul>
                <ul className="amount-details">
                    <li><Lozenge appearance={this.props.opptStatus} isBold>{this.props.amount}</Lozenge></li>
                    <li className="discuss-button"><DiscussButton link={this.props.link} /></li>
                </ul>
            </div>
        );
    }
}