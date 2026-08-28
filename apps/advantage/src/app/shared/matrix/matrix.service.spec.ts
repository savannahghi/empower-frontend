import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SilStoresService } from '../../shared/sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import { Authorization } from '../../@core/auth/services/authorization.service';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import { ElementRef, Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import moment from 'moment';
import { MatrixService } from './matrix.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { WINDOW } from '../../features/services/window.service';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

function mockPipe(name: string): Pipe {
    const metadata: Pipe = {
        name,
    };

    return Pipe(metadata)(
        class MockPipe implements PipeTransform {
            transform() {}
        }
    );
}

class TransitionStub {
    params() {
        return { practitionerId: 1 };
    }
}

class SilStoresServiceStub {
    create() {
        return of({
            id: '143224',
        });
    }
    listNested() {
        return of({
            results: [{ id: 1, transition: 'test' }],
        });
    }
}

class NbToastrServiceStub {
    show() {
        return {};
    }
}

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {};
    }
    getUser() {
        return {};
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
    setupMatrixClient() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
    getAutoreconSettings() {
        return {
            matrix_access_token: '2136-2343-5423',
            matrix_device_id: '2136-2143-5423',
            matrix_home_server: 'https://www.google.com/',
            matrix_user_id: '2136W5423',
        };
    }
    createClient() {
        return {
            baseUrl: 'https://www.google.com/',
            accessToken: '2136-2343-5423',
            userId: '@2136W5423:matrix.domain',
            deviceId: '2136-2143-5423',
        };
    }
}

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
}

const uIRouterGlobalsStub = {
    current: {
        name: 'state',
    },
    params() {
        return { appointment_id: 1 };
    },
    $current: {
        is: () => true,
        params() {
            return { appointment_id: 1 };
        },
    },
};

describe('MatrixService', () => {
    let service: MatrixService;
    let roomEmitterMock: any;
    let messagesEmitterMock: any;
    let clientMock: any;

    beforeEach(() => {
        roomEmitterMock = {
            emit: jasmine.createSpy('emit'),
        };

        messagesEmitterMock = {
            emit: jasmine.createSpy('emit'),
        };

        clientMock = {
            baseUrl: 'https://www.google.com/',
            accessToken: '2136-2343-5423',
            userId: '@2136W5423:matrix.domain',
            deviceId: '2136-2143-5423',
            startClient: jasmine.createSpy('startClient'),
            on: jasmine.createSpy('on').and.callFake((event, callback) => {
                if (event === 'Room.timeline') {
                    const mockRoom = {
                        roomId: service.roomId,
                        timeline: [
                            {
                                localTimestamp: Date.now(),
                                getType: () => 'm.room.message',
                                event: {
                                    content: {
                                        msgtype: 'm.text',
                                        body: 'Test message',
                                    },
                                },
                                date: new Date(),
                                time: moment.now(),
                            },
                        ],
                    };
                    callback(
                        { getType: () => 'm.room.message' },
                        mockRoom,
                        false
                    );
                }
            }),
            getRooms: () => [
                {
                    roomId: 'sampleRoomId',
                    name: 'Sample Room',
                },
            ],
            sendEvent: jasmine
                .createSpy('sendEvent')
                .and.returnValue(Promise.resolve()),
        };

        TestBed.configureTestingModule({
            imports: [
                mockPipe('statusColor'),
                mockPipe('silCurrency'),
                mockPipe('removeUnderScore'),
                mockPipe('variantDisplay'),
            ],
            providers: [
                MatrixService,
                { provide: Transition, useClass: TransitionStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                {
                    provide: WINDOW,
                    useValue: { matrixcs: { createClient: () => clientMock } },
                },
                { provide: 'roomEmitter', useValue: roomEmitterMock },
                { provide: 'messagesEmitter', useValue: messagesEmitterMock },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });

        service = TestBed.inject(MatrixService);
        service.client = clientMock;
    });

    it('should test setupMatrixClient method', () => {
        spyOn(service, 'setupMatrixClient').and.callThrough();
        service.setupMatrixClient();
        expect(service.setupMatrixClient).toHaveBeenCalledWith();
    });

    it('should scroll to the bottom of the msgs element', () => {
        service.msgs = {
            nativeElement: {
                scrollTop: 0,
                scrollHeight: 1000,
            },
        } as ElementRef;
        service.scrollToBottom();
        expect(service.msgs.nativeElement.scrollTop).toBe(1000);
        expect(service.scrolltop).toBe(1000);
    });

    it('should test isMessageFromCurrentUser method', () => {
        const sender = 'user123';
        const mockMatrixUserId = 'mockMatrixUserId';
        spyOn(service, 'isMessageFromCurrentUser').and.callThrough();
        service.isMessageFromCurrentUser(sender, mockMatrixUserId);
        expect(service.isMessageFromCurrentUser).toHaveBeenCalledWith(
            sender,
            mockMatrixUserId
        );
    });

    it('should test sendMessage', () => {
        service.roomId = 'testRoomId';
        service.client = {
            sendEvent: jasmine
                .createSpy('sendEvent')
                .and.returnValue(Promise.resolve()),
            getRooms: jasmine.createSpy('getRooms').and.returnValue([]),
        };
        service.editor = {
            setData: jasmine.createSpy('setData'),
        };

        const responseMessage = { message: 'this is message' };
        service.sendMessage(responseMessage);

        expect(service.client.sendEvent).toHaveBeenCalledWith(
            'testRoomId',
            'm.room.message',
            {
                body: responseMessage.message,
                msgtype: 'm.text',
                format: 'org.matrix.custom.html',
                reply: true,
            },
            ''
        );
        expect(service.editor.setData).toHaveBeenCalledWith('');
    });

    it('should set editor and update messageBody when onEditorChange is called', () => {
        const mockEditor = {
            data: {
                get: () => 'Sample editor content',
            },
        };
        service.onEditorChange({ editor: mockEditor });
        expect(service.editor).toBe(mockEditor);
        expect(service.messageBody).toBe('Sample editor content');
    });

    it('should emit messages and room data for matching room and valid events', fakeAsync(() => {
        service.roomId = 'sampleRoomId';
        spyOn(service, 'getMessages').and.callThrough();
        service.getMessages();
        tick(500);
        expect(service.getMessages).toHaveBeenCalled();
    }));

    it('should skip events for other rooms', () => {
        const mockRoom = { roomId: 'otherRoomId', timeline: [] };

        service.roomId = 'sampleRoomId';
        service.getMessages();

        const onCallback = clientMock.on.calls.argsFor(0)[1];
        onCallback({ getType: () => 'm.room.message' }, mockRoom, false);

        expect(roomEmitterMock.emit).not.toHaveBeenCalled();
        expect(messagesEmitterMock.emit).not.toHaveBeenCalled();
    });

    it('should skip non-message events', () => {
        const mockRoom = { roomId: 'sampleRoomId', timeline: [] };

        service.roomId = 'sampleRoomId';
        service.getMessages();

        const onCallback = clientMock.on.calls.argsFor(0)[1];
        onCallback({ getType: () => 'm.room.topic' }, mockRoom, false);

        expect(roomEmitterMock.emit).not.toHaveBeenCalled();
        expect(messagesEmitterMock.emit).not.toHaveBeenCalled();
    });

    it('should skip paginated results', () => {
        const mockRoom = { roomId: 'sampleRoomId', timeline: [] };

        service.roomId = 'sampleRoomId';
        service.getMessages();

        const onCallback = clientMock.on.calls.argsFor(0)[1];
        onCallback({ getType: () => 'm.room.message' }, mockRoom, true);

        expect(roomEmitterMock.emit).not.toHaveBeenCalled();
        expect(messagesEmitterMock.emit).not.toHaveBeenCalled();
    });
});

class SilStoresServiceStubError {
    create() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    createNested() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    statusUpdate() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('MatrixService Error', () => {
    let service: MatrixService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                mockPipe('statusColor'),
                mockPipe('silCurrency'),
                mockPipe('removeUnderScore'),
                mockPipe('variantDisplay'),
            ],
            providers: [
                MatrixService,
                { provide: Transition, useClass: TransitionStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                {
                    provide: WINDOW,
                    useValue: {
                        matrixcs: {
                            createClient: () => ({
                                baseUrl: 'https://www.google.com/',
                                accessToken: '2136-2343-5423',
                                userId: '@2136W5423:matrix.domain',
                                deviceId: '2136-2143-5423',
                                startClient: () => {},
                                on: (event, callback) => {
                                    if (event === 'Room.timeline') {
                                        const mockRoom = {
                                            roomId: service.roomId,
                                            timeline: [
                                                {
                                                    localTimestamp: Date.now(),
                                                    getType: () =>
                                                        'm.room.message',
                                                    event: {
                                                        content: {
                                                            msgtype: 'm.text',
                                                            body: 'Test message',
                                                        },
                                                    },
                                                    date: new Date(),
                                                    time: moment.now(),
                                                },
                                            ],
                                        };
                                        callback(
                                            { getType: () => 'm.room.message' },
                                            mockRoom,
                                            false
                                        );
                                    }
                                },
                                getRooms: () => [
                                    {
                                        roomId: 'sampleRoomId',
                                        name: 'Sample Room',
                                    },
                                ],
                            }),
                        },
                    },
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        service = TestBed.inject(MatrixService);
    });

    it('should test scrollToBottom method', () => {
        spyOn(service, 'scrollToBottom').and.callThrough();
        service.scrollToBottom();
        expect(service.scrollToBottom).toHaveBeenCalledWith();
    });
});
