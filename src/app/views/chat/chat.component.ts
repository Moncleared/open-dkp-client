import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoUtil } from '../../services/cognito.service'
import { BaseComponent } from '../base/base.component';
import { LoadingDataService } from '../utilities/loading-data.service';
import { DkpService } from '../../services/dkp.service';
import { Message } from '../../models/socket-models';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';
import { HttpClient, HttpHeaders } from  "@angular/common/http";

@Component({
    templateUrl: 'chat.component.html'
})
export class ChatComponent extends BaseComponent implements OnInit {
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    /**
     * Moncs -
     * Constructor for ProfileComponent 
     * @param cognitoService 
     * @param loadingService 
     */
    constructor(cognitoService: CognitoUtil,
                loadingService: LoadingDataService,
                private dkpService: DkpService,
                private http: HttpClient,
                router: Router) {
        super(cognitoService, loadingService, router);
        this.setIsLoginRequired(true);
    }
    //https://eq.magelo.com/tooltip.json?callback=jsonp_item_105147_en&item=105147#
    ngOnInit(): void {
        this.http.get('https://cors-anywhere.herokuapp.com/https://eq.magelo.com/tooltip.json?callback=jsonp_item_105147_en&item=105147#', { responseType: 'text'}).subscribe( (response:string) => {
            var vTooltip:string = response.substring(response.indexOf('(')+1);
            vTooltip = vTooltip.substring(0,vTooltip.length-1);
            var vJsonToolTip = eval('('+vTooltip+')');
            this.item = vJsonToolTip;
            console.log(this.item);
        });

        this.socket$ = new WebSocketSubject('wss://lqwsuzajpg.execute-api.us-east-2.amazonaws.com/beta');
        this.cognitoService.getCurrentUser().subscribe( (x:any) => {
            this.nickname = x.nickname;
        });
        this.socket$
            .subscribe(
            (message) => { this.handleMessage(message) },
            (err) => {console.log('error: '); console.error(err)},
            () => console.log('Completed!')
            );
        var vMessage = new Message();
        vMessage.Action = 'ChatHistory';
        this.socket$.next(vMessage);

        setInterval( () => {
            var vMessage = new Message();
            vMessage.Action = 'Ping';
            this.socket$.next(vMessage);
        }, 30000);
    }

    handleMessage(pMessage: Message) {
        if ( pMessage.Action == 'ChatMessage') {
            this.chatBox = this.chatBox + pMessage.From + ': ' + pMessage.Message + '\r\n';
            try {
                this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
            } catch(e) {}
        } else if ( pMessage.Action == 'ChatHistory') {
            let vMessages: Message[] = JSON.parse(pMessage.Data);
            vMessages = vMessages.sort( (x,y) => { 
                return (new Date(x.Timestamp).getTime()-new Date(y.Timestamp).getTime());
            });
            vMessages.forEach( message => {
                this.chatBox = this.chatBox + message.From + ': ' + message.Message + '\r\n';
            });
            try {
                this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
            } catch(e) {}            
        } else {
            //console.log(pMessage);
        }
    }

    sendMessage() {
        this.userInput = this.userInput.trim();
        if ( this.userInput.length > 0 ) {
            var vMessage = new Message();
            vMessage.Action = 'ChatMessage';
            vMessage.Message =this.userInput;
            vMessage.Timestamp = new Date();
            vMessage.From = this.nickname;
            this.socket$.next(vMessage);
            this.userInput = '';
        }
    }

    public httpOptions = {
        responseType: "text"
      };
    private socket$: WebSocketSubject<Message>;
    public chatBox: string = '';
    public userInput: string = '';
    public disabled: boolean = false;
    public nickname: string = 'unknown';
    public item: any = { tooltip:''};
}