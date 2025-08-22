import { Component, OnInit } from '@angular/core';
import { style, state, animate, transition, trigger, query, stagger, } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';

import moment from 'moment';
import { AssetsService } from '../../../services/assets.service';
import { ToastService } from '../../../services/toast.service';
import { fadeIn } from '../../../animations';


@Component({
  selector: 'app-assets-list',
  standalone: false,
  templateUrl: './assets-list.component.html',
  styleUrl: './assets-list.component.scss',
  animations: [fadeIn]
})
export class AssetsListComponent implements OnInit {

  filters: any = {
    status: 'ALL'
  };
  asset: any;

  assets: any = [];
  loadingAssets = false;
  page: number = 1;
  itemsPerPage = 20;
  totalLength: any;

  today = new Date();
  daterange: any = {};
  options: any = {};
  currentUser: any = {};

  performingAction = false;
  actionFail = false;
  errorMessage = '';


  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private assetsService: AssetsService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: "smooth" });

    this.setFilterParams();
  }


  setFilterParams(): void {
    this.options = {
      autoApply: true,
      ranges: {
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1, 'days').format('DD/MM/YYYY'), moment().subtract(1, 'days').format('DD/MM/YYYY')],
        'Last 7 Days': [moment().subtract(6, 'days').format('DD/MM/YYYY'), moment().format('DD/MM/YYYY')],
        'This Week': [moment().startOf('week').format('DD/MM/YYYY'), moment().endOf('week').format('DD/MM/YYYY')],
        'This Month': [moment().startOf('month').format('DD/MM/YYYY'), moment().endOf('month').format('DD/MM/YYYY')],
        // 'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
        'Last 30 Days': [moment().subtract(29, 'days').format('DD/MM/YYYY'), moment().format('DD/MM/YYYY')],
        'Last 90 Days': [moment().subtract(89, 'days').format('DD/MM/YYYY'), moment().format('DD/MM/YYYY')],
      },
      locale: {
        format: 'DD-MM-YYYY',
        separator: '  —  ',
      },
      alwaysShowCalendars: true,
      showCustomRangeLabel: false,
      startDate: this.activatedRoute.snapshot.queryParams['startDate']
        ? moment(this.activatedRoute.snapshot.queryParams['startDate']).format('DD/MM/YYYY')
        : moment().subtract(6, 'days').format('DD/MM/YYYY'),
      endDate: this.activatedRoute.snapshot.queryParams['endDate']
        ? moment(this.activatedRoute.snapshot.queryParams['endDate']).format('DD/MM/YYYY')
        : moment().format('DD/MM/YYYY'),
      maxDate: moment().format('DD/MM/YYYY'),
    };

    this.daterange = {
      start: this.activatedRoute.snapshot.queryParams['startDate']
        ? moment(this.activatedRoute.snapshot.queryParams['startDate'])
        : moment().subtract(6, 'days'),
      end: this.activatedRoute.snapshot.queryParams['endDate'] ? moment(this.activatedRoute.snapshot.queryParams['endDate']) : moment(),
    };

    this.page = +this.activatedRoute.snapshot.queryParams['page'] || 1;
    this.filters.status = this.activatedRoute.snapshot.queryParams['status'] || '';
    this.filters.name = this.activatedRoute.snapshot.queryParams['name'] || '';


    this.getAssets(this.page);

  }



  getAssets(page: number): void {

    this.page = page ?? 1;
    this.loadingAssets = true;
    const options = {
      // startDate: this.daterange.start.format('YYYY-MM-DD'),
      // endDate: this.daterange.end.format('YYYY-MM-DD'),
      status: this.filters.status,
      name: this.filters?.name?.trim() ?? '',
      size: this.itemsPerPage,
      page: this.page - 1,
      sort: 'id,desc',
    }

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        page,
        status: this.filters.status,
        name: this.filters?.name?.trim() ?? ''
        // startDate: this.daterange.start.format('YYYY-MM-DD'),
        // endDate: this.daterange.end.format('YYYY-MM-DD'),
      },
      queryParamsHandling: 'merge',
      replaceUrl: !this.activatedRoute.snapshot.queryParams['page']
    });

    this.assetsService.getAll(options).subscribe(
      {
        next: (res) => {
          // console.log(res);
          this.assets = res.body;
          this.totalLength = Number(res.headers.get('X-Total-Items'));
          this.loadingAssets = false;
        },
        error: (error) => {
          console.log(error);
          this.loadingAssets = false;
        }
      }
    )
  }

  createAsset(): void {

    this.performingAction = true;
    this.actionFail = false;

    this.assetsService.create(this.asset).subscribe(
      {
        next: (res) => {

          this.performingAction = false;
          this.closeModal('closeEditModal');
          this.getAssets(this.page);

          this.toastService.success('Asset updated successfully!');


        },
        error: (error) => {
          console.log(error);
          this.actionFail = true;
          this.performingAction = false;
          this.errorMessage = error?.desc ?? 'Please try again in 15 minutes';

        }
      }
    )
  }


  editAsset(): void {
    this.performingAction = true;
    this.actionFail = false;

    this.assetsService.update(this.asset).subscribe(
      {
        next: (res) => {
          this.performingAction = false;
          this.closeModal('closeEditModal');
          this.getAssets(this.page);

          this.toastService.success('Asset updated successfully!');
        },
        error: (error) => {
          console.log(error);
          this.actionFail = true;
          this.performingAction = false;
          this.errorMessage = error?.desc ?? 'Please try again in 15 minutes';

        }
      }
    )
  }

  deleteAsset(): void {
    this.performingAction = true;
    this.actionFail = false;

    this.assetsService.delete(this.asset.id).subscribe(
      {
        next: (res) => {
          this.performingAction = false;
          this.closeModal('closeAssetActionModal');
          this.getAssets(this.page);

          this.toastService.success('Asset deleted successfully!');
        },
        error: (error) => {
          console.log(error);
          this.actionFail = true;
          this.performingAction = false;
          this.errorMessage = error?.desc ?? 'Please try again in 15 minutes';

        }
      }
    )
  }


  resetAsset(): void {
    this.asset = {
      // type: this.types[0]
    };

    this.performingAction = false;
    this.actionFail = false;
    this.errorMessage = '';
  }

  closeModal(id: string): void {
    const close: any = document.getElementById(id) as HTMLElement;
    close?.click();
  }

  resetFilters(): void {
    this.filters = {
      status: ""
    }

    this.daterange = {
      start: moment().subtract(6, 'days'),
      end: moment(),
    };

    this.getAssets(1);

  }


  selectedDate(value: any, datepicker?: any): void {
    setTimeout(() => {
      this.daterange.start = value.start;
      this.daterange.end = value.end;

      datepicker.start = value.start;
      datepicker.end = value.end;
      this.getAssets(this.page);
    }, 10);
  }

  openInput(id: string): void {
    const open: HTMLElement = document.getElementById(id) as HTMLElement;
    open?.click();
  }



}

