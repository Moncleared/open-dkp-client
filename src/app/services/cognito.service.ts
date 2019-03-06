import { Injectable } from "@angular/core";
import Amplify, { Auth, API } from 'aws-amplify';
import { Observable, BehaviorSubject } from 'rxjs';
import { ClientModel } from '../models/ClientModel';
import { ClientService } from "./client.service";

@Injectable({
    providedIn: 'root',
})
export class CognitoUtil {
    /**
     * Moncs - 
     * Using BehaviorSubjects as I prefer to have an initial value declared immediately
     * Its also nice to know that anyone subscribing will have an immediate (even if default)
     * value available to it
     */
    private authSubject = new BehaviorSubject < boolean > (false);
    private errorMessage = new BehaviorSubject < any > ('');
    private siteadminSubject = new BehaviorSubject < boolean > (false);
    private dkpadminSubject = new BehaviorSubject < boolean > (false);
    private lastUserNameSubject = new BehaviorSubject < string > ('');
    private sessionIdTokenSubject = new BehaviorSubject < string > ('');
    private currentUserSubject = new BehaviorSubject < object > ({});
    private currentIdTokenSubject = new BehaviorSubject < string > ('');
    private clientSubject = new BehaviorSubject < ClientModel > (null);

    /**
     * Moncs -
     * Constructor will attempt to initialize the UserGroups, populating currentSession
     * if one exists and immediately updating BehaviorSubjects as needed
     */
    constructor(private clientService: ClientService) {
        Amplify.configure({
            Auth: {
                identityPoolId: this.clientService.clientDetails.Identity,
                // REQUIRED - Amazon Cognito Region
                region: 'us-east-2',
                // OPTIONAL - Amazon Cognito User Pool ID
                userPoolId: this.clientService.clientDetails.UserPool, 
                // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
                userPoolWebClientId: this.clientService.clientDetails.WebClientId,
            }
        });
        this.initGroups();
    }

    /**
     * Moncs - 
     * Collection of Getters for our BehaviorSubjects to expose Observables
     */
    isAuthenticated(): Observable < any > {
        return this.authSubject.asObservable();
    }

    getErrorMessage(): Observable < any > {
        return this.errorMessage.asObservable();
    }

    isSiteAdmin(): Observable < boolean > {
        return this.siteadminSubject.asObservable();
    }
    isDkpAdmin(): Observable < boolean > {
        return this.dkpadminSubject.asObservable();
    }
    lastUserName(): Observable < string > {
        return this.lastUserNameSubject.asObservable();
    }
    getCurrentUser(): Observable < object > {
        return this.currentUserSubject.asObservable();
    }
    currentIdToken(): Observable < string > {
        return this.currentIdTokenSubject.asObservable();
    }

    getClient(): Observable < ClientModel > {
        return this.clientSubject.asObservable();
    }

    public setLastUserName(username) {
        this.lastUserNameSubject.next(username);
    }

    /**
     * Moncs - 
     * Quick and easy login method for Cognito
     * @param username - self explanatory
     * @param password - self explanatory
     */
    public login(username, password) {
        Auth.signIn(username, password)
            .then(x => {
                this.initGroups();
            })
            .catch(err => {
                this.authSubject.next(false);
                this.errorMessage.next(err);
            });
    }

    /**
     * Moncs - 
     * Ideally this will be called for initializing the User Groups so we have easy access to them
     * Should only be called once a User has been Authenticated
     * Note: We treat Site Admins as DKP admins as well, much like a SUDO user for example
     */
    private initGroups() {
        Auth.currentSession()
            .then(session => {
                //Notify user has logged in successfully
                this.authSubject.next(true);
                this.errorMessage.next("");

                //Determine UserGroups
                var payload = session.getIdToken().decodePayload();
                this.currentIdTokenSubject.next(session.getIdToken().getJwtToken());
                this.currentUserSubject.next(payload);

                var groups = payload['cognito:groups'];
                if (groups) {
                    groups.forEach(element => {
                        if (element == "SITE_ADMIN") {
                            this.siteadminSubject.next(true);
                            this.dkpadminSubject.next(true);
                        }
                        if (element == "DKP_ADMIN") {
                            this.dkpadminSubject.next(true);
                        }
                    });
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    public init() {
        return new Promise((resolve, reject) => {
            Auth.currentSession()
            .then(session => {
                //Notify user has logged in successfully
                this.authSubject.next(true);
                this.errorMessage.next("");

                //Determine UserGroups
                var payload = session.getIdToken().decodePayload();
                this.currentIdTokenSubject.next(session.getIdToken().getJwtToken());
                this.currentUserSubject.next(payload);

                var groups = payload['cognito:groups'];
                if (groups) {
                    groups.forEach(element => {
                        if (element == "SITE_ADMIN") {
                            this.siteadminSubject.next(true);
                            this.dkpadminSubject.next(true);
                        }
                        if (element == "DKP_ADMIN") {
                            this.dkpadminSubject.next(true);
                        }
                    });
                }
                resolve();
            })
            .catch(err => {
                console.log(err);
                resolve();
            });
        });
    }

    /**
     * Moncs -
     * Quick sign up method returning promise
     * @param username 
     * @param password 
     * @param email 
     * @param nickname 
     */
    public signUp(username, password, email, nickname) {
        return Auth.signUp({
            username,
            password,
            attributes: {
                email, // optional
                nickname, // optional - E.164 number convention
                // other custom attributes 
            },
            validationData: [] //optional
        });
    }

    /**
     * Moncs - 
     * Once a user has signed up, they need to confirm with their Verification code
     * @param username 
     * @param code 
     */
    public confirmSignUp(username, code) {
        return Auth.confirmSignUp(username, code, {
            // Optional. Force user confirmation irrespective of existing alias. By default set to True.
            forceAliasCreation: true
        });
    }

    public forgotPassword(username) {
        return Auth.forgotPassword(username);
    }

    public forgotPasswordSubmit(username, code, new_password) {
        return Auth.forgotPasswordSubmit(username, code, new_password);
    }

    /**
     * Moncs - 
     * Quick method to logout the user
     */
    public logout() {
        Auth.signOut()
            .then(x => {
                this.authSubject.next(false);
                this.siteadminSubject.next(false);
                this.dkpadminSubject.next(false);
                this.errorMessage.next("");
                this.sessionIdTokenSubject.next('');
            })
            .catch(err => {
                this.errorMessage.next(err)
            });
    }
}