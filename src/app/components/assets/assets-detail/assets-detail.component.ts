import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetsService } from '../../../services/assets.service';
import { fadeIn } from '../../../animations';
import { ToastService } from '../../../services/toast.service';
import { DepartmentsService } from '../../../services/departments.service';
import { LocationService } from '../../../services/location.service';
import { UsersService } from '../../../services/users.service';


@Component({
  selector: 'app-assets-detail',
  standalone: false,
  templateUrl: './assets-detail.component.html',
  styleUrl: './assets-detail.component.scss',
  animations: [fadeIn]
})
export class AssetsDetailComponent implements OnInit {

  asset: any = {
    assetCategory: { id: 0 },
    location: { id: 0 },
    department: { id: 0 }
  };
  assetId: number = 0;
  assetImages: any = [];
  isLoading = false;
  userSearchTerm: string = '';
  clickedModal: boolean = false;

  departments: any[] = [];
  locations: any[] = [];
  categories: any[] = [];
  users: any[] = [];


  constructor(
    private assetsService: AssetsService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private departmentsService: DepartmentsService,
    private locationService: LocationService,
    private usersService: UsersService
  ) {

  }
  ngOnInit(): void {
    this.assetId = this.activatedRoute.snapshot.params['id'];

    this.getOneAsset();
  }


  getOneAsset(): void {
    this.isLoading = true;

    this.assetsService.getOne(this.assetId).subscribe(
      {
        next: (res: any) => {
          this.isLoading = false;
          // console.log(res);
          this.asset = res.body;
          this.interceptAssetFields();

        },
        error: (error: any) => {
          console.log(error);
          this.isLoading = false;
        },
      }
    )
  }

  interceptAssetFields(): void {

    this.asset.purchaseCost = this.assetsService.formatCurrency(this.asset.purchaseCost);
    this.asset.currentValue = this.assetsService.formatCurrency(this.asset.currentValue);

    this.userSearchTerm = this.asset?.holder?.name ?? '';
    !this.asset?.media?.length ? this.asset.media = [] : '';
    this.asset?.media.splice(0, 0, this.asset.coverImageUrl);

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

  loadData(): void {
    this.clickedModal = true;

    setTimeout(() => {
      this.clickedModal = false;
    }, 0);

    if (!this.locations.length) this.getLocations();
    if (!this.departments.length) this.getDepartments();
    if (!this.categories.length) this.getAssetCategories();
    if (!this.users.length) this.getUsers();
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
}
