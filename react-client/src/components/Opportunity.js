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
    
    render() {
        return (
            <div className="opportunity">
                <ul className="closed-details">
                    {<li className="profile-picture"><Avatar name={this.props.ownerName} size="small" src={this.props.profilePicture} /></li>}
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