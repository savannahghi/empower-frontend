import { Component, Input } from '@angular/core';

@Component({
    selector: 'skika-no-data',
    styleUrls: ['./skika-no-data.component.scss'],
    template: `
        <div class="col-12 main-cont lighter" style="">
            <div class="col-12 text-center">
                <span class="fa-stack fa-lg" style="font-size:3rem">
                    <i
                        class="fas {{ wrapperIcon }} fa-stack-2x
                    text-light-grey"></i>
                    <i class="fas {{ innerIcon }} fa-stack-1x"></i>
                </span>
            </div>
            <div class="col-12 title-text text-center title-cont">
                {{ title }} <strong>{{ context }}</strong> {{ extraTitle }}
            </div>
            <div class="col-12 txt-sm text-center text-muted">
                {{ subtitle }}
            </div>
        </div>
    `,
    standalone: false,
})
export class SkikaNoDataComponent {
    @Input('wrapper-icon') wrapperIcon: string;
    @Input('inner-icon') innerIcon: string;
    @Input() title: string;
    @Input('extra-title') extraTitle: string;
    @Input() subtitle: string;
    @Input() context: string;
}
