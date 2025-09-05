import { Component, OnInit } from '@angular/core';
import { style, state, animate, transition, trigger, query, stagger, } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';

import moment from 'moment';
import { AssetsService } from '../../../services/assets.service';
import { ToastService } from '../../../services/toast.service';
import { fadeIn } from '../../../animations';
import { DepartmentsService } from '../../../services/departments.service';
import { LocationService } from '../../../services/location.service';
import { UsersService } from '../../../services/users.service';

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

  asset: any = {
    category: { id: 0 },
    location: { id: 0 },
    department: { id: 0 }
  };
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

  departments: any[] = [];
  locations: any[] = [];
  categories: any[] = [];
  users: any[] = [];
  openHolder = false;
  userSearchTerm = '';

  assetImages: any = [];
  action: string = '';


  wizardSteps = [
    {
      title: 'Basic information',
      desc: 'Enter the general information about the asset.'
    },
    {
      title: 'Value & Pricing details',
      desc: 'Specify the asset’s recorded value.'
    },
    {
      title: 'Holder / Assignee details',
      desc: 'Provide information about the location, department & person that owns the asset.'
    },
    {
      title: 'Verify details',
      desc: 'Take a moment to review the details so we can process it correctly'
    }
  ]
  step = 1;

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private assetsService: AssetsService,
    private toastService: ToastService,
    private departmentsService: DepartmentsService,
    private locationService: LocationService,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (localStorage.getItem('asset')) this.asset = JSON.parse(localStorage.getItem('asset') || '{}');
  
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

    this.getLocations();
    this.getDepartments();
    this.getAssetCategories();
    this.getUsers();
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


  getDepartments(): void {
    const options = {
      page: 0,
      size: 100000,
      sort: 'id,desc'
    }

    this.departmentsService.getAll(options).subscribe(
      {
        next: (res) => {
          this.departments = res.body;
          this.asset.department.id = this.departments[0]?.id ?? 0;
        }
      }
    )
  }

  getLocations(): void {
    const options = {
      page: 0,
      size: 100000,
      sort: 'id,desc'
    }

    this.locationService.getAll(options).subscribe(
      {
        next: (res) => {
          this.locations = res.body;
          this.asset.location.id = this.locations[0].id ?? 0;
        }
      }
    )
  }

  getAssetCategories(): void {
    const options = {
      page: 0,
      size: 100000,
      sort: 'id,desc'
    }

    this.assetsService.getAllAssetCategories(options).subscribe(
      {
        next: (res) => {
          this.categories = res.body;
          this.asset.category.id = this.categories[0].id ?? 0;
        }
      }
    )
  }

  getUsers(): void {
    const options = {
      page: 0,
      size: 1000000,
      sort: 'id,desc'
    }

    this.usersService.getUsers(options).subscribe(
      {
        next: (res) => {
          this.users = res.body;
        }
      }
    )
  }

  filterUsers(): any {
    return this.users.filter((user: any) => !this.userSearchTerm || user.name.toLowerCase().includes(this.userSearchTerm.toLowerCase()))
  }

  selectHolder(holder: any): void {
    this.asset.holder.id = holder.id;
    this.userSearchTerm = holder.name;
    this.openHolder = false;
  }

  navigateSteps(action: string = 'back'): void {
    action === 'next' ? this.step++ : this.step--;
    localStorage.setItem('asset', JSON.stringify(this.asset));
  }

  checkForEmptyFields(): boolean {
    if (this.step === 1) return !this.asset.name || !this.asset.model || !this.asset.modelNumber || !this.assetImages.length;
    if (this.step === 2) return !this.asset.purchaseDate || !this.asset.purchaseCost || !this.asset.currentValue;
    if (this.step === 3) return !this.asset.holder;
    return false;
  }

  createAsset(): void {

    this.performingAction = true;
    this.actionFail = false;

    this.asset.identifier = this.asset.modelNumber ?? '';

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

    this.asset.identifier = this.asset.modelNumber ?? '';


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


  updateImages(assetImages: any): void {
    this.assetImages = assetImages;
  }

  setCoverImage(uuid: any): void {
    this.asset.coverImage = uuid;
  }


  selectAsset(asset: any, action: string): void {

    this.action = action;
    this.asset = Object.assign({}, asset);

    this.assetImages = [];
    this.assetImages = JSON.parse(JSON.stringify(
      this.asset.media.map((str: string) => (
        {
          // previewUrl: window.location.origin + '/api/media/file/' + str,
          uuid: str,
          name: str,
          uploaded: true,
          compressed: true
        }
      ))
    ));
  }


  resetAsset(): void {
    this.asset = {
      location: {
        id: this.locations[0]?.id || 0
      },
      department: {
        id: this.departments[0]?.id || 0
      },
      category: {
        id: this.categories[0]?.id || 0
      },
      holder: {
        id: null
      }
    };

    this.performingAction = false;
    this.actionFail = false;
    this.assetImages = [];
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

