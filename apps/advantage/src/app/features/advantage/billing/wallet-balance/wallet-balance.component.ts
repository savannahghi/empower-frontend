import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {
    NbIconModule,
    NbPopoverModule,
    NbButtonModule,
    NbCardModule,
    NbPopoverDirective,
    NbAlertModule,
} from '@nebular/theme';
import { SkikaLayoutModule } from '../../../../shared/sil-layout/sil-layout.module';
import { DirectivesModule } from '../../../../shared/directives/directive.module';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { FeatureFlagService } from 'app/@core/utils/feature.service';

@Component({
    selector: 'wallet-balance',
    standalone: true,
    providers: [SilStoresService, ErrorHandlerService, FeatureFlagService],
    imports: [
        CommonModule,
        NbPopoverModule,
        NbIconModule,
        DirectivesModule,
        NbButtonModule,
        NbCardModule,
        NbAlertModule,
        SkikaLayoutModule,
    ],
    templateUrl: './wallet-balance.component.html',
    styleUrls: ['./wallet-balance.component.scss'],
})
export class WalletBalanceComponent implements OnInit {
    /**
     * Constructor for the class component
     * @param dataLayer used to access the data layer service
     * @param errorHandler used to access the error handler service
     * @param toastrService used to access the toast service
     */
    constructor(
        public dataLayer: SilStoresService,
        public errorHandler: ErrorHandlerService,
        public featureService: FeatureFlagService
    ) {}
    @Input() user: any;
    /** Get access to the popover directive */
    @ViewChild(NbPopoverDirective) popover: NbPopoverDirective;

    /** Contains data about the wallets */
    walletData: any;
    /** Contains SMS count */
    SMScount: any;
    /**  Display balance warning */
    displayBalanceWarning: boolean = false;
    /**  Display balance danger */
    displayBalanceDanger: boolean = false;
    /** Amount in the wallet */
    walletBalanceAmount: any;
    /** Used to display the sms top up instructions card */
    showSmsInstructions: boolean = false;
    /**
     * Component lifecycle used after the component is initialized
     */

    /**
     * toggleSmsDrawer
     */
    toggleSmsDrawer() {
        this.showSmsInstructions = !this.showSmsInstructions;
        this.closePopover();
    }

    closeCard() {
        this.showSmsInstructions = false;
    }

    ngOnInit() {
        this.walletBalance();
        setTimeout(() => {
            this.handleWalletAlerts();
        }, 2000);
    }

    /** Fetches wallet balance */
    walletBalance() {
        this.walletData = undefined;
        this.dataLayer.list('wallets').subscribe({
            next: this.handleResponse,
            error: this.errorHandlerFxn,
        });
    }

    /** Deals with response from wallet fetch */
    handleResponse = response => {
        this.walletData = response;
        this.SMScount = Math.trunc(
            this.walletData?.bulk_sms_account?.balance / 1.16
        );
        this.handleWalletAlerts();
        this.walletBalanceAmount = this.walletData?.bulk_sms_account?.balance;
    };

    /** Close the popover */
    closePopover() {
        this.popover.hide();
    }

    handleWalletAlerts() {
        if (this.featureService.getForcedValue('prov_displayWalletAlerts')) {
            if (
                this.walletBalanceAmount < 500 &&
                this.walletBalanceAmount > 1
            ) {
                this.displayBalanceWarning = true;
            } else if (this.walletBalanceAmount <= 1) {
                this.displayBalanceDanger = true;
            }
        }
    }

    /** Deals with error */
    errorHandlerFxn = err => {
        this.errorHandler.handleError(err, this);
    };

    onCloseAlert() {
        this.displayBalanceWarning = false;
    }
}
