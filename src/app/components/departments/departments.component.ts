import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { DepartmentsService } from '../../services/departments.service';
import { LocationService } from '../../services/location.service';
import { fadeIn } from '../../animations';


@Component({
  selector: 'app-departments',
  standalone: false,
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.scss',
  animations: [fadeIn]
})
export class DepartmentsComponent implements OnInit {


  loadingDepartments = false;
  departments: any = [];
  department: any = {
    location: {
      id: 0
    }
  };

  emailInvalid: boolean = false;
  filters: any = {
    location: "",
    status: ""
  }

  errorMessage: string = '';
  actionFail: boolean = false;
  performingAction: boolean = false;

  statuses: string[] = ['ACTIVE', 'DELETED', 'NEW'];
  action: string = '';

  page: number = 1;
  itemsPerPage = 20;
  totalLength: any;

  locations: any[] = [];


  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private departmentsService: DepartmentsService,
    private toastService: ToastService,
    private locationService: LocationService

  ) { }


  ngOnInit(): void {

    window.scrollTo({ top: 0, behavior: "smooth" });
    this.setUrlParams();
  }


  setUrlParams(): void {
    this.page = +this.activatedRoute.snapshot.queryParams['page'] || 1;

    this.filters = {
      location: this.activatedRoute.snapshot.queryParams['lctionId'] ?? '',
      name: this.activatedRoute.snapshot.queryParams['name'] ?? '',
      status: this.activatedRoute.snapshot.queryParams['status'] ?? '',
    }

    this.getDepartments(this.page);
    this.getLocations();
  }


  getDepartments(page: number): void {
    this.loadingDepartments = true;

    this.page = page ?? 1;
    this.departments = [];

    const options = {
      locationId: this.filters.location ?? '',
      name: this.filters.name?.trim() ?? '',
      status: this.filters.status ?? '',
      size: this.itemsPerPage,
      page: this.page - 1,
      sort: 'id,desc',
    }

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        page,
        lctionId: this.filters.location,
        name: this.filters.name?.trim() ?? '',
        status: this.filters.status,
      },
      queryParamsHandling: 'merge',
      replaceUrl: !this.activatedRoute.snapshot.queryParams['page']
    });


    this.departmentsService.getAll(options).subscribe(
      {
        next: (res) => {
          // console.log(res);
          this.departments = res.body;
          this.totalLength = Number(res.headers.get('X-Total-Items'));
          this.loadingDepartments = false;

        },
        error: (error) => {
          this.loadingDepartments = false;
        }
      }
    )
  }

  getLocations(): void {
    const options = {
      page: 0,
      size: 10000,
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

  createDepartment(): void {

    this.performingAction = true;
    this.actionFail = false;

    this.departmentsService.create(this.department).subscribe(
      {
        next: (res) => {

          this.performingAction = false;
          this.closeModal('closeEditModal');
          this.getDepartments(this.page);

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


  editDepartment(): void {
    this.performingAction = true;
    this.actionFail = false;

    if (['ACTIVATE', 'DEACTIVATE'].includes(this.action)) {
      // this.department.status = this.action === 'ACTIVATE' ? 'ACTIVE' : 'INACTIVE'; 
    }

    this.departmentsService.update(this.department).subscribe(
      {
        next: (res) => {
          this.performingAction = false;

          this.closeModal('closeEditModal');
          this.getDepartments(this.page);

          this.toastService.success('Department updated successfully!');
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

  deleteDepartment(): void {
    this.performingAction = true;
    this.actionFail = false;

    this.departmentsService.delete(this.department.id).subscribe(
      {
        next: (res) => {
          this.performingAction = false;

          this.closeModal('closeDepartmentActionModal');
          this.getDepartments(this.page);

          this.toastService.success('Department deleted successfully!');
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
    this.emailInvalid = this.department.email && !(/\S+@\S+\.\S+/).test(this.department.email);
  }

  selectDepartment(department: any, action: string): void {
    this.department = { ...department };
    this.action = action;
  }


  resetDepartment(): void {
    this.department = {
      location: {
        id: this.locations[0].id
      }
    };

    this.performingAction = false;
    this.actionFail = false;
  }

  closeModal(id: string): void {
    const close: any = document.getElementById(id) as HTMLElement;
    close?.click();
  }

  resetFilters(): void {
    this.filters = {
      location: "",
      status: ""
    }

    this.getDepartments(1);
  }


}
