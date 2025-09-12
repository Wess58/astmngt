import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationService } from '../../services/location.service';
import { ToastService } from '../../services/toast.service';
import { fadeIn } from '../../animations';


@Component({
  selector: 'app-locations',
  standalone: false,
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.scss',
  animations: [fadeIn]

})
export class LocationsComponent implements OnInit {


  types: string[] = ['COUNTY', 'SUBCOUNTY', 'WARD']
  statuses: string[] = ['ACTIVE', 'INACTIVE', 'NEW'];

  loadingLocations = false;
  locations: any = [];
  location: any = {
    type: this.types[0]
  };

  emailInvalid: boolean = false;
  filters: any = {
    type: "",
    status: ""
  }

  errorMessage: string = '';
  actionFail: boolean = false;
  performingAction: boolean = false;

  action: string = '';

  page: number = 1;
  itemsPerPage = 20;
  totalLength: any;

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private locationService: LocationService

  ) { }


  ngOnInit(): void {

    window.scrollTo({ top: 0, behavior: "smooth" });

    this.page = +this.activatedRoute.snapshot.queryParams['page'] || 1;

    this.getLocations(this.page);
  }


  getLocations(page: number): void {
    this.loadingLocations = true;

    this.page = page ?? 1;
    this.locations = [];

    const options = {
      // roleId: this.filters.roleId,
      // email: this.filters.email?.trim() ?? '',
      // name: this.filters.name?.trim() ?? '',
      // status: this.filters.status,
      size: this.itemsPerPage,
      page: this.page - 1,
      sort: 'id,desc',
    }

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        page,
        // roleId: this.filters.roleId,
        // status: this.filters.status,
        // email: this.filters.email?.trim() ?? '',
        // name: this.filters.name?.trim() ?? ''
      },
      queryParamsHandling: 'merge',
      replaceUrl: !this.activatedRoute.snapshot.queryParams['page']
    });


    this.locationService.getAll(options).subscribe(
      {
        next: (res) => {
          // console.log(res);
          this.locations = res.body;
          this.totalLength = Number(res.headers.get('X-Total-Items'));
          this.loadingLocations = false;

        },
        error: (error) => {
          this.loadingLocations = false;
        }
      }
    )
  }




  createLocation(): void {

    this.performingAction = true;
    this.actionFail = false;

    this.locationService.create(this.location).subscribe(
      {
        next: (res) => {

          this.performingAction = false;
          this.closeModal('closeEditModal');
          this.getLocations(this.page);

          this.toastService.success('Location created successfully!');

          // this.setLocationPassword('closeEditModal', 'CREATE');

        },
        error: (error) => {
          console.log(error);
          this.actionFail = true;
          this.performingAction = false;
          this.errorMessage = error?.message ?? 'Please try again in 15 minutes';

        }
      }
    )
  }


  editLocation(): void {
    this.performingAction = true;
    this.actionFail = false;

    this.locationService.update(this.location).subscribe(
      {
        next: (res) => {
          this.performingAction = false;
          this.closeModal('closeEditModal');
          this.getLocations(this.page);

          this.toastService.success('Location updated successfully!');
        },
        error: (error) => {
          console.log(error);
          this.actionFail = true;
          this.performingAction = false;
          this.errorMessage = error?.message ?? 'Please try again in 15 minutes';

        }
      }
    )
  }

  deleteLocation(): void {
    this.performingAction = true;
    this.actionFail = false;

    this.locationService.delete(this.location.id).subscribe(
      {
        next: (res) => {
          this.performingAction = false;
          this.closeModal('closeLocationActionModal');
          this.getLocations(this.page);

          this.toastService.success('Location deleted successfully!');
        },
        error: (error) => {
          console.log(error);
          this.actionFail = true;
          this.performingAction = false;
          this.errorMessage = error?.message ?? 'Please try again in 15 minutes';

        }
      }
    )
  }

  validateEmail(): void {
    // console.log(!(/\S+@\S+\.\S+/).test(this.user.email.trim()));
    this.emailInvalid = this.location.email && !(/\S+@\S+\.\S+/).test(this.location.email);
  }



  selectLocation(location: any, action: string): void {
    this.resetLocation();

    this.location = { ...location };
    this.action = action;
  }


  resetLocation(): void {
    this.location = {
      type: this.types[0]
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
      type: "",
      status: ""
    }

    this.getLocations(1);
  }



}
