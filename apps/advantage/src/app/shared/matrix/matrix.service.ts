import {
    ElementRef,
    Injectable,
    ViewChild,
    Inject,
    EventEmitter,
} from '@angular/core';
import { ScrollToBottomDirective } from '../directives/scrolltobottom.directive';
import { Authorization } from '../../@core/auth/services/authorization.service';
import { UIRouterGlobals } from '@uirouter/angular';
import { WINDOW } from '../../features/services/window.service';
import moment from 'moment';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';

/**
 * Allows service to be injectable into a provider component
 */
@Injectable({
    providedIn: 'root',
})
export class MatrixService {
    @ViewChild(ScrollToBottomDirective) msgs: ElementRef;
    scrolltop: number = 0;
    /** contains matrix server url */
    baseUrl: any;
    /** contains matrix access token */
    accessToken: any;
    /** contains the matrix server user id */
    userId: any;
    /** contains the matrix device id */
    deviceId: any;
    /** contains matrix window object */
    matrix: any;
    /** contains matrix client */
    client: any;
    /** Editor instance */
    editor: any;
    /** Contains the reference to the ckeditor instance */
    public Editor: any;
    /** contains a user's message body */
    messageBody: any;
    /** contains the room a user is in */
    room: any;
    /** contains the room id for an invoice */
    roomId: any;
    /** contains a room's messages */
    messages: any;
    /** contains the rooms a user is in */
    rooms: any;

    /** Emits messages to subscribers */
    public messagesEmitter = new EventEmitter<any>();

    /** Emits room information */
    public roomEmitter = new EventEmitter<any>();

    /**
     * constructor for the reconciliation service
     * @param dataLayer injects the data layer service
     * @param toastrService injects the toast service
     * @param errorHandler injects the error handler service
     * @param $state injects the state service
     */
    constructor(
        public authConfig: Authorization,
        public uiglobals: UIRouterGlobals,
        @Inject(WINDOW) private window: Window
    ) {}

    /** Scroll to the bottom */
    scrollToBottom(): void {
        if (this.msgs && this.msgs.nativeElement) {
            this.msgs.nativeElement.scrollTop =
                this.msgs.nativeElement.scrollHeight;
            this.scrolltop = this.msgs.nativeElement.scrollHeight;
        }
    }

    /** Sets up the matrix server */
    setupMatrixClient() {
        /** get matrix credetials */
        const orgAutorecon = this.authConfig.getAutoreconSettings();
        this.accessToken = orgAutorecon?.matrix_access_token;
        this.deviceId = orgAutorecon?.matrix_device_id;
        this.baseUrl = orgAutorecon?.matrix_home_server;
        this.userId = orgAutorecon?.matrix_user_id;
        this.roomId;

        this.matrix = this.window['matrixcs'];

        this.client = this.matrix.createClient({
            baseUrl: this.baseUrl,
            accessToken: this.accessToken,
            userId: this.userId,
            deviceId: this.deviceId,
        });
        this.client.startClient();
    }

    getMessages() {
        this.client.on('Room.timeline', (event, room, toStartOfTimeline) => {
            /** processing events for the specified roomId */
            if (room.roomId !== this.roomId) {
                return; // Ignore events from other rooms
            }

            if (toStartOfTimeline) {
                return; // Skip paginated results
            }
            if (event.getType() !== 'm.room.message') {
                return; // Only handle message events
            }

            /** Emit room information */
            this.roomEmitter.emit(room);
            const messages = [];

            room.timeline
                .filter(e => e.event?.content?.msgtype === 'm.text')
                .forEach(timelineEvent => {
                    const time = moment(timelineEvent.localTimestamp).unix();
                    timelineEvent.date = moment
                        .unix(time)
                        .format('DD MMM, YYYY');
                    timelineEvent.time = moment.unix(time).format('h:mm a');

                    // Add the time to the message
                    if (
                        timelineEvent?.event?.content?.body &&
                        !timelineEvent.event.content.body.match(
                            /\d{1,2}:\d{2} [ap]m - /
                        )
                    ) {
                        timelineEvent.event.content.body = `${timelineEvent.time} - ${timelineEvent.event.content.body}`;
                    }

                    messages.push(timelineEvent);
                });

            /** Emit messages to the component */
            setTimeout(() => {
                this.messagesEmitter.emit(messages);
            }, 200);
        });
    }

    onEditorChange({ editor }: ChangeEvent | any) {
        this.editor = editor;
        const data = editor.data.get();
        this.messageBody = data;
    }

    sendMessage(responseMessage) {
        const content = {
            body: responseMessage.message,
            reply: true,
            msgtype: 'm.text',
            format: 'org.matrix.custom.html',
        };

        // Clear the editor content if CKEditor is being used
        if (this.editor) {
            this.editor.setData('');
        }

        if (this.roomId) {
            this.client
                .sendEvent(this.roomId, 'm.room.message', content, '')
                .then(() => {
                    /** Clear the message body */
                    this.messageBody = '';
                });
        }
    }

    isMessageFromCurrentUser(sender: string, matrixUserId: string): boolean {
        return sender === matrixUserId;
    }
}
