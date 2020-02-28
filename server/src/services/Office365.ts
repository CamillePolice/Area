import Axios from 'axios';

import { AreaService } from './Service';

var previousMailNb: number = 0;

const ifIHaveTooManyMails = async (
    reactionType: 'generic' | 'specific',
    actionAccessToken: string,
    registerTimestamp: number
) => {
    const axios = Axios.create({
        baseURL: 'https://graph.microsoft.com/v1.0',
        headers: {
            Authorization: `Bearer ${actionAccessToken}`
        }
    });
    const response = await axios.get('/me/mailfolders/inbox/');
    const nbMail = response.data.unreadItemCount; //nb unread mails inside your inbox

    if (nbMail === previousMailNb) {
        return;
    }
    previousMailNb = nbMail;
    if (nbMail > 0 && nbMail % 10 == 0) {
        //each 10 unread mails trigger a reaction
        console.log(
            `Office action ifIHaveTooManyMails ${reactionType} response ok`
        );
        if (reactionType === 'specific') {
            return nbMail;
        }
        if (reactionType === 'generic') {
            return `10 mails on Office (GENERIC REACTION)!`;
        }
    }
    console.log('Office action ifIHaveTooManyMails not triggered');
    return null;
};

const sendAMail = async (actionAccessToken: string, data: any) => {
    const axios = Axios.create({
        baseURL: 'https://graph.microsoft.com/v1.0',
        headers: {
            Authorization: `Bearer ${actionAccessToken}`
        }
    });
    //get my profile
    const myProfile = await axios.get('/me/');

    //create the mail in json format
    var obj = {
        Message: {
            Subject: 'Clean your inbox !',
            Body: {
                ContentType: 'Text',
                Content:
                    "We're here to warn you that your inbox is starting to be a real TRASH !!!\n" +
                    'Indeed you got more than ' +
                    data +
                    ' unread mails'
            },
            ToRecipients: [
                {
                    EmailAddress: {
                        Address: myProfile.data.mail //insert my email as the receiver addr
                    }
                }
            ]
        }
    };
    //send email throught a post request
    const response = await axios.post('/me/sendmail', obj);
    console.log('Email response = ', response);
};

export const Office365: AreaService = {
    serviceName: 'Office365',
    areas: [
        {
            areaId: 0,
            action: ifIHaveTooManyMails,
            specificReaction: sendAMail
        }
    ]
};
