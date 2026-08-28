import {
    Component,
    OnInit,
    Input,
    SimpleChanges,
    OnChanges,
    Output,
    EventEmitter,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import _ from 'underscore';

@Component({
    selector: 'sil-sidelayout',
    styleUrls: ['./sil-sidecont-layout.component.scss'],
    templateUrl: './sil-sidecont-layout.component.html',
    standalone: false,
})
export class SilSidecontComponent implements OnInit, OnChanges {
    @Input() payers: any;
    @Input() discountedAmount: number;
    @Input() itemCount: number;
    @Input() index: number;

    @Output() setParams = new EventEmitter();

    items: Array<any>;
    selectedPayer: any;
    loading: boolean;
    amount = new UntypedFormControl({ disabled: true });

    constructor() {}

    setAmount(event) {
        this.selectedPayer = event;
        const amount = parseFloat(event.availableLimit);
        this.amount.setValue(amount);
        this.setParams.emit(event);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (_.has(changes, 'payers')) {
            if (changes.payers.currentValue.length) {
                this.items = changes.payers.currentValue;
            }
        }
        if (_.has(changes, 'itemCount')) {
            this.itemCount = changes.itemCount.currentValue;
        }
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        this.items = [];
        this.index = 0;
    }
}
