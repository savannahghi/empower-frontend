import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DragDropDirectiveModule } from '@ks89/ngx-drag-n-drop';
import { NbCardModule } from '@nebular/theme';
import { ThemeModule } from '../../../../@theme/theme.module';
import { listAnimation } from '../../../../shared/animations/list-animations';

@Component({
    selector: 'ngx-json-form-builder',
    templateUrl: './json-form-builder.component.html',
    styleUrls: ['./json-form-builder.component.scss'],
    imports: [DragDropDirectiveModule, ThemeModule, CommonModule, NbCardModule],
    animations: [listAnimation],
})
export class JsonFormBuilderComponent implements OnInit {
    /** Contains the form list that will create the form */
    formList: any;
    /** Contains the form options that can be used */
    formOptions: any;
    /** Contains the index of the item being dragged around */
    draggedIndex: any;
    /** Used to display draggable area */
    displayDraggableArea: boolean = false;

    /** Sets up the options that can be used in a form */
    setupFormOptions() {
        this.formOptions = {
            textarea: {
                type: 'textarea',
                props: {
                    label: 'Textarea label',
                },
            },
            buttongroup: {
                type: 'buttongroup',
                props: {
                    label: '1 being "not likely", 5 being "very likely"',
                    helpText: 'Add help text',
                    buttons: [
                        {
                            value: '1',
                            display: '1',
                        },
                        {
                            value: '2',
                            display: '2',
                        },
                        {
                            value: '3',
                            display: '3',
                        },
                        {
                            value: '4',
                            display: '4',
                        },
                        {
                            value: '5',
                            display: '5',
                        },
                    ],
                },
            },
        };
    }

    /** Adds form option to the form list */
    addFormOptionToList(option) {
        this.formList.push(this.formOptions[option]);
    }

    /** Adds form option to the top of the array */
    addDropItemTop(event, item, index) {
        this.formList.splice(this.draggedIndex, 1);
        this.formList.splice(index, 0, event);
    }

    /** Adds form option to the bottom of the array */
    addDropItemBottom(event, item, index) {
        this.formList.splice(this.draggedIndex, 1);
        this.formList.splice(index, 0, event);
    }

    /** Start dragging of item */
    startDrag(index) {
        this.displayDraggableArea = true;
        this.draggedIndex = index;
    }

    /** Releasing drop */
    releaseDrop() {
        this.displayDraggableArea = false;
    }

    /** Initialized component hook */
    ngOnInit() {
        this.formList = [
            {
                type: 'buttongroup',
                props: {
                    label: 'Button group 1',
                    helpText: 'Add help text',
                    buttons: [
                        {
                            value: '1',
                            display: '1',
                        },
                        {
                            value: '2',
                            display: '2',
                        },
                        {
                            value: '3',
                            display: '3',
                        },
                        {
                            value: '4',
                            display: '4',
                        },
                        {
                            value: '5',
                            display: '5',
                        },
                    ],
                },
            },
            {
                type: 'buttongroup',
                props: {
                    label: 'Button group 2',
                    helpText: 'Add help text',
                    buttons: [
                        {
                            value: '1',
                            display: '1',
                        },
                        {
                            value: '2',
                            display: '2',
                        },
                        {
                            value: '3',
                            display: '3',
                        },
                        {
                            value: '4',
                            display: '4',
                        },
                        {
                            value: '5',
                            display: '5',
                        },
                    ],
                },
            },
            {
                type: 'buttongroup',
                props: {
                    label: 'Button group 3',
                    helpText: 'Add help text',
                    buttons: [
                        {
                            value: '1',
                            display: '1',
                        },
                        {
                            value: '2',
                            display: '2',
                        },
                        {
                            value: '3',
                            display: '3',
                        },
                        {
                            value: '4',
                            display: '4',
                        },
                        {
                            value: '5',
                            display: '5',
                        },
                    ],
                },
            },
            {
                type: 'buttongroup',
                props: {
                    label: 'Button group 4',
                    helpText: 'Add help text',
                    buttons: [
                        {
                            value: '1',
                            display: '1',
                        },
                        {
                            value: '2',
                            display: '2',
                        },
                        {
                            value: '3',
                            display: '3',
                        },
                        {
                            value: '4',
                            display: '4',
                        },
                        {
                            value: '5',
                            display: '5',
                        },
                    ],
                },
            },
        ];
        this.setupFormOptions();
    }
}
