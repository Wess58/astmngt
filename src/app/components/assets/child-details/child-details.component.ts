import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-child-details',
  standalone: false,
  templateUrl: './child-details.component.html',
  styleUrl: './child-details.component.scss'
})
export class ChildDetailsComponent implements OnChanges {

  details: any = [];

  @Input() asset: any = {};
  @Input() images: any[] = [];
  @Input() isCreate: boolean = false;



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
        value: this.formatCurrency(this.asset.purchaseCost) ?? 0
      },
      {
        title: 'Full depreciation date',
        value: this.asset.fullyDepreciatedDate ?? '—'
      },
      {
        title: 'Current value',
        value: this.formatCurrency(this.asset.currentValue) ?? 0
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


  formatCurrency(amount: string): string {
    return String(amount)?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

}
