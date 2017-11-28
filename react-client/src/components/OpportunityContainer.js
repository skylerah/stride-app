import React, { PureComponent } from 'react';
import Opportunity from './Opportunity';

export default class OpportunityContainer extends PureComponent {
    constructor(props) {
        console.log(props);
        super(props);
        this.state = {
            oppts: null
        }
    }

    componentDidMount() {
        this.getOppts();
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

    getOppts = () => {
        var jwt = this.getQueryParam('jwt');
        console.log('window', window.location.href);
        console.log('jwt', jwt);
        studio.invokeFlo(41365, {jwt: jwt}, function (err, data) { // eslint-disable-line
            if (err) {
                console.error(err);
            } else {

                var parsed = data;
                // var parsed = JSON.parse(data);
                var baseUrl = parsed.salesforceBaseUrl;
                
                var oppts = parsed.data.map(function (oppt) {
                    var accountName = '';
                    var id = oppt.Id;
                    var name = oppt.Name;

                    if (oppt.Account !== null) {
                        accountName = oppt.Account.Name;
                    } else if (oppt.Account === null) {
                        accountName = '';
                    }

                    var amount = oppt.Amount;
                    var closeDate = oppt.CloseDate;
                    var ownerName = oppt.Owner.Name;
                    var ownerEmail = oppt.Owner.Email;
                    var link = baseUrl + '/' + id;
                    var stageName = oppt.StageName;
                    var opptStatus = '';
                    var profilePictureUrl = oppt.imageUrl;

                    if (stageName === 'Closed Won') {
                        opptStatus = 'success';
                    } else if (stageName === 'Closed Lost') {
                        opptStatus = 'removed';
                    }

                    return <Opportunity
                        name={name}
                        accountName={accountName}
                        amount={amount}
                        closeDate={closeDate}
                        ownerName={ownerName}
                        ownerEmail={ownerEmail}
                        link={link}
                        stageName={stageName}
                        opptStatus={opptStatus}
                        key={id}
                        profilePicture={profilePictureUrl}
                    />
                });
                this.setState({ oppts: oppts });
            }
        }); 
        

        //FL ID: 41365
        // fetch('https://api.azuqua.com/flo/444b276362a6c40ba3e5cfecd4fc1228/invoke?clientToken=025405f208206a7f36bfe04e9c42982ef16835206c4e33eb233c643e051ee506')
        //     .then((res) => {
        //         res.text().then((text) => {
        //             var parsed = JSON.parse(text);
        //             var baseUrl = parsed.salesforceBaseUrl;

        //             var oppts = parsed.data.map(function (oppt) {
        //                 var accountName = '';
        //                 var id = oppt.Id;
        //                 var name = oppt.Name;

        //                 if (oppt.Account !== null) {
        //                     accountName = oppt.Account.Name;
        //                 } else if (oppt.Account === null) {
        //                     accountName = '';
        //                 }

        //                 var amount = oppt.Amount;
        //                 var closeDate = oppt.CloseDate;
        //                 var ownerName = oppt.Owner.Name;
        //                 var ownerEmail = oppt.Owner.Email;
        //                 var link = baseUrl + '/' + id;
        //                 var stageName = oppt.StageName;
        //                 var opptStatus = '';
        //                 var profilePictureUrl = oppt.imageUrl;

        //                 if (stageName === 'Closed Won') {
        //                     opptStatus = 'success';
        //                 } else if (stageName === 'Closed Lost') {
        //                     opptStatus = 'removed';
        //                 }

        //                 return <Opportunity
        //                     name={name}
        //                     accountName={accountName}
        //                     amount={amount}
        //                     closeDate={closeDate}
        //                     ownerName={ownerName}
        //                     ownerEmail={ownerEmail}
        //                     link={link}
        //                     stageName={stageName}
        //                     opptStatus={opptStatus}
        //                     key={id}
        //                     profilePicture={profilePictureUrl}
        //                 />
        //             });
        //             this.setState({ oppts: oppts });
        //         });
        //     });
    }

    render() {
        return (
            <div className="app">
                {this.state.oppts}
            </div>
        );
    }
}