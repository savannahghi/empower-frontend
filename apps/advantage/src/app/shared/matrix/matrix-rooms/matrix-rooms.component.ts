import { CommonModule } from '@angular/common';
import {
    afterNextRender,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    NbBadgeModule,
    NbButtonModule,
    NbTagModule,
    NbToastrService,
} from '@nebular/theme';
import { Authorization } from '../../../@core/auth/services/authorization.service';
import { WINDOW } from '../../../features/services/window.service';
import { DirectivesModule } from '../../directives/directive.module';
import { ScrollToBottomDirective } from '../../directives/scrolltobottom.directive';
import moment from 'moment';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { type EditorConfig } from '@ckeditor/ckeditor5-core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import _ from 'underscore';

export const messagesEmitter = new EventEmitter();

/** Emits room information */
export const roomEmitter = new EventEmitter();
@Component({
    selector: 'ngx-matrix-rooms',
    templateUrl: './matrix-rooms.component.html',
    styleUrls: ['./matrix-rooms.component.scss'],
    imports: [
        CommonModule,
        CKEditorModule,
        DirectivesModule,
        NbTagModule,
        NbButtonModule,
        NbTagModule,
        NbBadgeModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [],
})
export class MatrixRoomsComponent implements OnInit {
    @ViewChild(ScrollToBottomDirective) msgs: ElementRef;
    scrolltop: number = 0;
    /** contains matrix window object */
    matrix: any;
    /** Contains the reference to the ckeditor instance */
    public Editor: any;

    /** Editor instance */
    editor: any;

    /** contains matrix client */
    client: any;

    /** contains a room's messages */
    messages: any;

    /** contains a user's message body */
    messageBody: any;

    /** Used to define the config for the editor */
    editorConfig: EditorConfig = {
        // Your configuration options here, e.g.,
        licenseKey: 'GPL',
    };

    /** contains matrix server url */
    baseUrl: any;

    /** contains matrix access token */
    accessToken: any;

    /** contains the matrix server user id */
    userId: any;

    /** contains the matrix device id */
    deviceId: any;

    /** contains matrix account data */
    accountData: any;

    /** contains the rooms a user is in */
    rooms: any;

    /** contains the room a user is in */
    room: any;

    /**
     * Constructor for the matrix component
     * @param authConfig
     * @param window
     */
    constructor(
        public authConfig: Authorization,
        private cd: ChangeDetectorRef,
        protected toastrService: NbToastrService,
        @Inject(WINDOW) private window: Window
    ) {
        afterNextRender(() => {
            this.loadCkEditor();
        });
    }

    async loadCkEditor() {
        if (typeof window !== 'undefined') {
            const classicEditor = (
                await import('@ckeditor/ckeditor5-build-classic')
            ).default;
            this.Editor = classicEditor;
        }
    }

    /**
     * Hook function when component is initialised
     */
    ngOnInit() {
        this.messageBody = '';
        this.setupMatrixClient();
        this.getMessages();
        // This gets each message one by one
        messagesEmitter.subscribe(messages => {
            this.messages = this.groupMessagesByDate(messages);
            this.cd.detectChanges();
            this.scrollToBottom();
            this.rooms = this.client.getRooms();
            this.cd.detectChanges();
        });
        roomEmitter.subscribe(room => {
            this.room = room;
        });
    }

    /** Group messages by their date */
    groupMessagesByDate(messages) {
        const dates = _.groupBy(messages, 'date');
        const dateKeys = Object.keys(dates);
        const newMessagesArray = [];
        /** Loops through each day in the timeline */
        for (let index = 0; index < dateKeys.length; index++) {
            const object = {};
            object['date'] = dateKeys[index];
            object['data'] = dates[dateKeys[index]];
            newMessagesArray.push(object);
        }
        return newMessagesArray;
    }

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
        const org = this.authConfig.getAdvantageOrganisation();
        this.baseUrl = org.matrix_token['homeserver'];
        this.accessToken = org.matrix_token.access_token;
        this.userId = org.matrix_token.user_id;
        this.deviceId = org.matrix_token.device_id;

        this.matrix = this.window['matrixcs'];

        this.client = this.matrix.createClient({
            baseUrl: this.baseUrl,
            accessToken: this.accessToken,
            userId: this.userId,
            deviceId: this.deviceId,
        });
        this.client.startClient();
    }

    /**
     * gets the messages from the room
     */
    getMessages() {
        this.client.on(
            'Room.timeline',
            function (event, room, toStartOfTimeline) {
                if (toStartOfTimeline) {
                    return; // don't print paginated results
                }
                if (event.getType() !== 'm.room.message') {
                    return; // only print messages
                }

                roomEmitter.emit(room);
                const messages = [];

                room.timeline.forEach(timelineEvent => {
                    const time = moment(timelineEvent.localTimestamp).unix();
                    timelineEvent.date = moment
                        .unix(time)
                        .format('DD MMM, YYYY');
                    timelineEvent.time = moment.unix(time).format('HH:mm a');
                    messages.push(timelineEvent);
                });
                setTimeout(() => {
                    messagesEmitter.emit(messages);
                }, 500);
            }
        );
    }

    /**
     * Detect changes from the editor
     * @param { editor }
     */
    onEditorChange({ editor }: ChangeEvent | any) {
        this.editor = editor;
        const data = editor.data.get();
        this.messageBody = data;
    }

    sendMessage() {
        const content = {
            body: this.messageBody,
            msgtype: 'm.text',
            format: 'org.matrix.custom.html',
        };
        this.showToast(
            'bottom-right',
            'success',
            'Message sent',
            'Message sent successfully',
            500
        );
        this.editor.setData('');
        this.client
            .sendEvent(this.room.roomId, 'm.room.message', content, '')
            .then(() => {
                this.messageBody = '';
            });
    }

    /**
     * Method used to display a toast
     */
    showToast(position, status, message, title, dur?) {
        const duration = dur ? dur : 1000;
        this.toastrService.show(message, title, {
            position,
            status,
            duration,
        });
    }
}
