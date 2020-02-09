import { Component, Input, OnInit } from '@angular/core';
import qs from 'qs';

import { AuthServiceService, Service } from '../auth-service.service';

@Component({
    selector: 'app-github',
    templateUrl: './github.component.html',
    styleUrls: ['./github.component.scss']
})
export class GithubComponent implements OnInit {
    @Input() reactionServices: Service[];

    actionService: Service;

    image = '../../../assets/github.svg';
    title = 'Github';
    subtitle = 'wow wow wow wow wow wow wow wow';

    actionDescription = 'If you push a new branch, ...';

    specificReactionDescription =
        '... a PR to master is create with this branch';
    genericReactionDescription =
        '... a text representing the action is send to ...';

    reactionType: 'generic' | 'specific';

    actionAccessToken: string;
    reactionAccessToken: string | undefined;

    constructor(private authService: AuthServiceService) {}

    isAuthenticate() {
        if (!this.actionAccessToken) {
            return false;
        }
        if (this.reactionType === 'specific') {
            return true;
        } else if (
            this.reactionType === 'generic' &&
            !this.reactionAccessToken
        ) {
            return false;
        }
        return true;
    }

    callbackUrlParser(url: string) {
        return url.match(/code=(.+)&state=(.+)/);
    }

    async authenticateAction() {
        const authorizeUrl =
            this.actionService.authorizeUrl +
            '?' +
            qs.stringify({
                client_id: this.actionService.clientId,
                redirect_uri: this.actionService.redirectUrl,
                scope: 'user repo',
                state: 'mdr',
                allow_signup: 'true'
            });

        const OAuth2_Response = await this.authService.auth(
            authorizeUrl,
            this.callbackUrlParser
        );

        console.log(OAuth2_Response);
    }

    async registerAREA() {}

    ngOnInit() {
        this.actionService = this.reactionServices.find(
            service => service.name === 'Github'
        );
    }
}
