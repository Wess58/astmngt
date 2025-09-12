import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AssetsService } from '../../../services/assets.service';


@Component({
  selector: 'app-child-details',
  standalone: false,
  templateUrl: './child-details.component.html',
  styleUrl: './child-details.component.scss'
})
export class ChildDetailsComponent implements OnChanges {

  details: any = [];
  currentImageIndex = 0;


  @Input() asset: any = {};
  @Input() images: any[] = [];
  @Input() isCreate: boolean = false;
  @Input() customFields: any[] = [];


  constructor(
    private assetsService: AssetsService
  ) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['asset']) {
      this.createRecordDetailLayout()
    }
  }

  createRecordDetailLayout(): void {
    this.details = [];
    // this.images = this.asset.media;

    this.details.push(
      {
        title: 'Asset name',
        value: this.asset.name ?? '—'
      },
      {
        title: 'Asset category',
        value: this.asset?.assetCategory?.name ?? '—'
      },
      {
        title: 'Model',
        value: this.asset.model ?? '—'
      },
      {
        title: 'Model number',
        value: this.asset.modelNumber ?? '—'
      },
      {
        title: 'Purchase date',
        value: this.asset.purchaseDate ?? '—'
      },
      {
        title: 'Purchase value',
        value: this.assetsService.formatCurrency(this.asset.purchaseCost) ?? 0
      },
      {
        title: 'Full depreciation date',
        value: this.asset.fullyDepreciatedDate ?? '—'
      },
      {
        title: 'Current value',
        value: this.assetsService.formatCurrency(this.asset.currentValue) ?? 0
      },
      {
        title: 'Depreciation rate',
        value: (String(this.asset.depreciation) + '%') || '—'
      },
      {
        title: 'Location',
        value: this.asset?.location?.name ?? '—'
      },
      {
        title: 'Department',
        value: this.asset?.department?.name ?? '—'
      },
      {
        title: 'Holder name',
        value: this.asset?.holder?.name ?? '—'
      },
      {
        title: 'Holder staff ID',
        value: this.asset?.holder?.employeeNumber ?? '—'
      },
     ...(this.isCreate ? this.extractCustomFieldsForCreate() : this.extractCustomFields())
    )

  



    if (!this.isCreate) {
      this.details.push(
        {
          title: 'Status',
          value: this.asset.status ?? null,
          isStatus: true
        },
        {
          title: 'Status reason',
          value: this.asset.statusReason ?? '—'
        },
        {
          title: 'Created on',
          value: this.asset.createdOn ?? null,
          unformarttedDate: true
        },
        {
          title: 'Created by',
          value: this.asset.createdBy ?? '—'
        },
        {
          title: 'Updated on',
          value: this.asset.updatedOn ?? null,
          unformarttedDate: true
        },
        {
          title: 'Updated by',
          value: this.asset.updatedBy ?? '—'
        }
      )
    }
  }


  extractCustomFields(): any[] {
    var customFields: any[] = [];

    if (this.asset?.customFieldsData?.length) {
      const customFieldsData = JSON.parse(this.asset?.customFieldsData);

      customFields = (Object.keys(customFieldsData)).map((key: any) => ({
        title: this.formatCamelCase(key),
        value: (parseInt(customFieldsData[key]) ? this.assetsService.formatCurrency(customFieldsData[key]) : customFieldsData[key]) || '—'
      }));
    }

    return customFields;
  }

  extractCustomFieldsForCreate(): any[] {
    var customFields: any[] = [];

    if (this.customFields?.length) {
      customFields = this.customFields?.map((field: any) => ({
        title: field.name,
        value: (field.formElement === 'NUMBER' ? this.assetsService.formatCurrency(field.value) : field.value) || '—'
      }));
    }

    return customFields;
  }


  // extractCustomFieldsInRecordLayout(createCustomFields: any): any[] {
  //   if (createCustomFields?.length) {
  //     return Object.assign({}, ...createCustomFields.map((field: any) => ({ [field.name]: field.value || '' })));
  //   }
  //   return [];
  // }

  formatCamelCase(value: string): string {
    value = String(value.split(/(?=[A-Z])/).join(" ")).toLowerCase();
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

}
