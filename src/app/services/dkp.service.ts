import { Injectable } from '@angular/core';
import { CharacterModel } from '../models/CharacterModel';
import { RaidModel } from '../models/RaidModel';
import { AdjustmentModel } from '../models/AdjustmentModel';
import Amplify, { API } from 'aws-amplify';
import { SettingsModel } from '../models/SettingsModel';
import { UserRequest } from '../models/UserRequest';
import { CognitoUtil } from './cognito.service';
import { ClientService } from './client.service';
import { ClientModel } from '../models/ClientModel';

Amplify.configure({
    API: {
        endpoints: [{
                name: "CharacterAPIs",
                endpoint: "https://xxxx.execute-api.us-east-2.amazonaws.com",
                region: "us-east-2"
            },
            {
                name: "PoolAPIs",
                endpoint: "https://xxxx.execute-api.us-east-2.amazonaws.com",
                region: "us-east-2"
            },
            {
                name: "ItemAPIs",
                endpoint: "https://xxxx.execute-api.us-east-2.amazonaws.com",
                region: "us-east-2"
            },
            {
                name: "AdjustmentAPIs",
                endpoint: "https://xxxx.execute-api.us-east-2.amazonaws.com",
                region: "us-east-2"
            },
            {
                name: "RaidAPIs",
                endpoint: "https://xxxx.execute-api.us-east-2.amazonaws.com",
                region: "us-east-2"
            },
            {
                name: "DkpAPIs",
                endpoint: "https://xxxx.execute-api.us-east-2.amazonaws.com",
                region: "us-east-2"
            },
            {
                name: "AdminAPIs",
                endpoint: "https://xxxx.execute-api.us-east-2.amazonaws.com",
                region: "us-east-2"
            },
            {
                name: "AuditAPIs",
                endpoint: "https://xxxx.execute-api.us-east-2.amazonaws.com",
                region: "us-east-2"
            }
        ]
    }
});

@Injectable({
    providedIn: 'root',
})
export class DkpService {
    fCharacterApi = `CharacterAPIs`;
    fCharacterPath = `/beta/characters`;

    fPoolApi = `PoolAPIs`;
    fPoolPath = `/beta/pools`;

    fItemApi = `ItemAPIs`;
    fItemPath = `/beta/items`;

    fAdjustmentApi = `AdjustmentAPIs`;
    fAdjustmentPath = `/beta/adjustments`;

    fRaidApi = `RaidAPIs`;
    fRaidPath = `/beta/raids`;

    fDkpApi = `DkpAPIs`;
    fDkpPath = `/beta/dkp`;

    fAuditApi = `AuditAPIs`;
    fAuditPath = `/beta`;


    fAdminApis = `AdminAPIs`;
    fAdminPath = `/beta/admin`;
    fUserRequestPath = `/beta/requests`;
    fCognitoPath = `/beta/admin/cognito`;

    public tokenID: any;
    myInit = { // OPTIONAL
        headers: {} // OPTIONAL
    }
    private clientDetails: ClientModel;
    constructor(private cognitoService: CognitoUtil,
        private clientService: ClientService) {
        this.cognitoService.currentIdToken().subscribe(x => this.tokenID = x);
        this.clientDetails = this.clientService.clientDetails;
    }

    /**
     * Fetches all characters in the system
     * @param pIncludeInactives Include inactive characters, will consume more data
     */
    getAllCharacters(pIncludeInactives: boolean = false): any {
        let data = {
            headers: {
                ClientId: this.clientDetails.ClientId
            }
        }
        if (pIncludeInactives)
            return API.get(this.fCharacterApi, this.fCharacterPath + `?IncludeInactives=true`, data);
        else
            return API.get(this.fCharacterApi, this.fCharacterPath, data);
    }

    /**
     * Fetches characters by account
     * @param pAccount Account to fetch characters from
     */
    getCharactersByAccount(pAccount: string): any {
        let data = {
            headers: {
                ClientId: this.clientDetails.ClientId
            }
        }
        return API.get(this.fCharacterApi, this.fCharacterPath + `/account/${pAccount}`, data);
    }

    /**
     * Get all items in the system. This data is cached automatically on the server side
     * TODO: consider cacheing locally as well?
     */
    getAllItems(): any {
        let data = {
            headers: {
                ClientId: this.clientDetails.ClientId
            }
        }
        return API.get(this.fItemApi, this.fItemPath, data);
    }

    /**
     * Get all pools (currently only hardcoded in DB)
     */
    getAllPools(): any {
        let data = {
            headers: {
                ClientId: this.clientDetails.ClientId
            }
        }
        return API.get(this.fPoolApi, this.fPoolPath, data);
    }

    /**
     * Fetches character details by the name of character
     * @param pName Character name to fetch
     */
    getCharacter(pName: string): any {
        let data = {
            headers: {
                ClientId: this.clientDetails.ClientId
            }
        }
        return API.get(this.fCharacterApi, this.fCharacterPath + `/${pName}`, data);
    }

    /**
     * Fetches items by character name
     * @param pName Name of character
     */
    getItemsByCharacter(pName: string): any {
        let data = {
            headers: {
                ClientId: this.clientDetails.ClientId
            }
        }
        return API.get(this.fItemApi, this.fItemPath + `/character/${pName}`, data);
    }

    /**
     * Fetches all adjustments for a given character
     * @param pName Name of Character
     */
    getAdjustmentsByCharacter(pName: string): any {
        let data = {
            headers: {
                ClientId: this.clientDetails.ClientId
            }
        }
        return API.get(this.fAdjustmentApi, this.fAdjustmentPath + `/character/${pName}`, data);
    }

    /**
     * Fetches all raids by character using a lookback
     * @param pName Name of Character
     * @param pLookback Number of Days to look back
     */
    getRaidsByCharacter(pName: string, pLookback: number = 0): any {
        let data = {
            headers: {
                ClientId: this.clientDetails.ClientId
            }
        }
        return API.get(this.fRaidApi, this.fRaidPath + `/character/${pName}?lookback=${pLookback}`, data);
    }

    /**
     * Fetches all adjustments in the system
     */
    getAllAdjustments(): any {
        let data = {
            headers: {
                ClientId: this.clientDetails.ClientId
            }
        }
        return API.get(this.fAdjustmentApi, this.fAdjustmentPath, data);
    }

    /**
     * Fetches specific AdjustmentModel by id
     * @param pId Id of the adjustment to fetch
     */
    getAdjustmentById(pId: string): any {
        let data = {
            headers: {
                ClientId: this.clientDetails.ClientId
            }
        }
        return API.get(this.fAdjustmentApi, this.fAdjustmentPath + `/${pId}`, data);
    }

    /**
     * Fetches specific RaidModel by Id
     * @param pId Id of the raid to fetch
     */
    getRaidbyId(pId: number): any {
        let data = {
            headers: {
                ClientId: this.clientDetails.ClientId
            }
        }
        return API.get(this.fRaidApi, this.fRaidPath + `/${pId}`, data);
    }


    /**
     * Fetches all raids in the system
     */
    getAllRaids(): any {
        let data = {
            headers: {
                ClientId: this.clientDetails.ClientId
            }
        }
        return API.get(this.fRaidApi, this.fRaidPath, data);
    }

    //Shouldn't need any client id or cognito info
    searchItems(pItem: string, pLimit ? : number): any {
        if (!pLimit) return API.get(this.fItemApi, this.fItemPath + `/autocomplete?item=${pItem}`, this.myInit);
        return API.get(this.fItemApi, this.fItemPath + `/autocomplete?item=${pItem}&limit=${pLimit}`, this.myInit);
    }

    //Shouldn't need any client id or cognito info
    searchItemsPost(pItems: string[]): any {
        let data = {
            body: pItems
        }
        return API.post(this.fItemApi, this.fItemPath, data);
    }

    /**
     * Fetches summary from backend containing attendance calculations and dkp calculations
     * This is cached on server side as there can be a lot of data to process and calculate
     */
    getSummary(): any {
        let data = {
            headers: {
                ClientId: this.clientDetails.ClientId
            }
        }
        return API.get(this.fDkpApi, this.fDkpPath, data);
    }

    /**
     * Fetches a setting from the db keyed off the name
     * @param pName Name of the setting to fetch
     */
    getSetting(pName: string): any {
        let data = {
            headers: {
                ClientId: this.clientDetails.ClientId
            }
        }
        return API.get(this.fAdminApis, this.fAdminPath + `/settings/${pName}`, data);
    }

    //APIs which require Authorization
    /**
     * Simple insertion operation of a character
     * @param pCharacterModel CharacterModel to be inserted
     */
    insertCharacter(pCharacterModel: CharacterModel): any {
        let data = {
            body: pCharacterModel,
            headers: {
                CognitoInfo: this.tokenID,
                ClientId: this.clientDetails.ClientId
            }
        }
        return API.put(this.fCharacterApi, this.fCharacterPath, data);
    }

    /**
     * Simple update operation of a character
     * @param pCharacterModel CharacterModel to be updated
     */
    updateCharacter(pCharacterModel: CharacterModel): any {
        let data = {
            body: pCharacterModel,
            headers: {
                CognitoInfo: this.tokenID,
                ClientId: this.clientDetails.ClientId
            }
        }
        return API.post(this.fCharacterApi, this.fCharacterPath, data);
    }

    /**
     * Simple delete operation of a character
     * @param pName string name of character to be deleted
     */
    deleteCharacter(pName: string): any {
        let data = {
            headers: {
                CognitoInfo: this.tokenID,
                ClientId: this.clientDetails.ClientId
            }
        }
        return API.del(this.fCharacterApi, this.fCharacterPath + `/${pName}`, data);
    }

    /**
     * Simple insert operation of an adjustment
     * @param pAdjustmentModel AdjustmentModel to be inserted
     */
    insertAdjustment(pAdjustmentModel: AdjustmentModel): any {
        let data = {
            body: pAdjustmentModel,
            headers: {
                CognitoInfo: this.tokenID,
                ClientId: this.clientDetails.ClientId
            }
        }
        return API.put(this.fAdjustmentApi, this.fAdjustmentPath, data);
    }

    /**
     * Simple updated operation of an adjustment
     * @param pAdjustmentModel AdjustmentModel of adjustment to be updated
     */
    updateAdjustment(pAdjustmentModel: AdjustmentModel): any {
        let data = {
            body: pAdjustmentModel,
            headers: {
                CognitoInfo: this.tokenID,
                ClientId: this.clientDetails.ClientId
            }
        }
        return API.post(this.fAdjustmentApi, this.fAdjustmentPath, data);
    }

    /**
     * Simple delete operation of an adjustment
     * @param pId Id of adjustment to be deleted
     */
    deleteAdjustment(pId: number): any {
        let data = {
            headers: {
                CognitoInfo: this.tokenID,
                ClientId: this.clientDetails.ClientId
            }
        }
        return API.del(this.fAdjustmentApi, this.fAdjustmentPath + `/${pId}`, data);
    }

    /**
     * Simple insert operation of a raid
     * @param pRaid RaidModel to be inserted
     */
    insertRaid(pRaid: RaidModel): any {
        let data = {
            body: pRaid,
            headers: {
                CognitoInfo: this.tokenID,
                ClientId: this.clientDetails.ClientId
            }
        }
        return API.put(this.fRaidApi, this.fRaidPath, data);
    }

    /**
     * Simple update operation of a raid
     * @param pRaid RaidModel to be updated 
     */
    updateRaid(pRaid: RaidModel): any {
        let data = {
            body: pRaid,
            headers: {
                CognitoInfo: this.tokenID,
                ClientId: this.clientDetails.ClientId
            }
        }
        return API.post(this.fRaidApi, this.fRaidPath, data);
    }

    /**
     * Simple delete operation of a raid
     * @param pId Id of raid to be deleted
     */
    deleteRaid(pId: number): any {
        let data = {
            headers: {
                CognitoInfo: this.tokenID,
                ClientId: this.clientDetails.ClientId
            }
        }
        return API.del(this.fRaidApi, this.fRaidPath + `/${pId}`, data);
    }

    /**
     * Allows admins to change the DKP settings for the site
     * @param pSettings The settings to change
     */
    putSetting(pSettings: SettingsModel): any {
        let data = {
            body: pSettings,
            headers: {
                CognitoInfo: this.tokenID,
                ClientId: this.clientDetails.ClientId
            }
        }
        return API.post(this.fAdminApis, this.fAdminPath + `/settings/${pSettings.SettingName}`, data);
    }

    /**
     * Processes the guild dump server side to sync up the roster data
     * @param pRequest String of the guild dump
     */
    postRosterUpdate(pRequest): any {
        let data = {
            body: pRequest,
            headers: {
                CognitoInfo: this.tokenID,
                ClientId: this.clientDetails.ClientId
            }
        }
        return API.post(this.fAdminApis, this.fAdminPath + `/roster`, data);
    }

    /**
     * Adds the request to the system in a pending state
     * @param pRequest Request to add to the system
     */
    putRequest(pRequest: UserRequest): any {
        let data = {
            body: pRequest,
            headers: {
                CognitoInfo: this.tokenID,
                ClientId: this.clientDetails.ClientId
            }
        }
        return API.put(this.fAdminApis, this.fUserRequestPath, data);
    }

    /**
     * Update request
     * @param pRequest Request details to be updated
     */
    updateRequest(pRequest: UserRequest): any {
        let data = {
            body: pRequest,
            headers: {
                CognitoInfo: this.tokenID,
                ClientId: this.clientDetails.ClientId
            }
        }
        return API.post(this.fAdminApis, this.fUserRequestPath, data);
    }

    /**
     * TODO: rename parameter to account name isntead of character?
     * @param pCharacter Fetches requests for a specified Account
     */
    getRequests(pCharacter: string): any {
        let data = {
            headers: {
                CognitoInfo: this.tokenID,
                ClientId: this.clientDetails.ClientId
            }
        }
        return API.get(this.fAdminApis, this.fUserRequestPath + `/${pCharacter}`, data);
    }

    /**
     * Fetches all requests
     */
    getAllRequests(): any {
        let data = {
            headers: {
                CognitoInfo: this.tokenID,
                ClientId: this.clientDetails.ClientId
            }
        }
        return API.get(this.fAdminApis, this.fUserRequestPath, data);
    }

    /**
     * Fetches all of the Users in the Userpool
     */
    getAllCognitoUsers(): any {
        let data = {
            headers: {
                CognitoInfo: this.tokenID,
                ClientId: this.clientDetails.ClientId
            }
        }
        return API.get(this.fAdminApis, this.fCognitoPath, data);
    }

    /**
     * Adds the specified user to the DKP_ADMIN group
     * @param pUsername Username to add to the DKP_ADMIN group
     */
    addDkpAdmin(pUsername: string): any {
        var vRequest: any = {};
        vRequest.Action = "add-admin";
        vRequest.Data = pUsername;
        let data = {
            body: vRequest,
            headers: {
                CognitoInfo: this.tokenID,
                ClientId: this.clientDetails.ClientId
            }
        }
        return API.post(this.fAdminApis, this.fCognitoPath, data);
    }

    /**
     * Removes the specified user from the DKP_ADMIN group
     * @param pUsername Username to remove from DKP_ADMIN group
     */
    removeDkpAdmin(pUsername: string): any {
        var vRequest: any = {};
        vRequest.Action = "remove-admin";
        vRequest.Data = pUsername;
        let data = {
            body: vRequest,
            headers: {
                CognitoInfo: this.tokenID,
                ClientId: this.clientDetails.ClientId
            }
        }
        return API.post(this.fAdminApis, this.fCognitoPath, data);
    }

    /**
     * Retrieve all audits
     */
    getAllAudits(): any {
        let data = {
            headers: {
                CognitoInfo: this.tokenID,
                ClientId: this.clientDetails.ClientId
            }
        }
        return API.get(this.fAuditApi, this.fAuditPath, data);
    }

    /**
     * fetches an individual audit, pulling back all of the json representation of the audit details
     * @param pId The unique identifier of the audit to retrieve
     */
    getAuditById(pId: number): any {
        let data = {
            headers: {
                CognitoInfo: this.tokenID,
                ClientId: this.clientDetails.ClientId
            }
        }
        return API.get(this.fAuditApi, this.fAuditPath + `/${pId}`, data);
    }
}

// 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,CognitoInfo,ClientId'