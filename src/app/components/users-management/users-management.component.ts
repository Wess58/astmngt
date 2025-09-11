import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastService } from '../../services/toast.service';
import { ApiService } from '../../services/api.service';
import { UsersService } from '../../services/users.service';
import { RoleMatrixService } from '../../services/role-matrix.service';
import { DepartmentsService } from '../../services/departments.service';
import { LocationService } from '../../services/location.service';
import { fadeIn } from '../../animations';


@Component({
  selector: 'app-users-management',
  standalone: false,
  templateUrl: './users-management.component.html',
  styleUrl: './users-management.component.scss',
  animations: [fadeIn]
})


export class UsersManagementComponent implements OnInit {

  loadingUsers = false;
  users: any = [];
  user: any = {
    role: { id: 0 },
    location: { id: 0 },
    department: { id: 0 }
  };
  currentUser: any = {};
  emailInvalid: boolean = false;
  filters: any = {
    roleId: "",
    status: ""
  }
  errorMessage: string = '';
  actionFail: boolean = false;
  performingAction: boolean = false;

  statuses: string[] = ['ACTIVE', 'INACTIVE'];
  action: string = '';
  openPassEye: boolean = false;
  roles: any[] = [];

  page: number = 1;
  itemsPerPage = 20;
  totalLength: any;

  departments: any[] = [];
  locations: any[] = [];

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService,
    private toastService: ToastService,
    private roleMatrixService: RoleMatrixService,
    private departmentsService: DepartmentsService,
    private locationService: LocationService
  ) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('asmuser') || '{}');

    window.scrollTo({ top: 0, behavior: "smooth" });

    this.page = +this.activatedRoute.snapshot.queryParams['page'] || 1;

    this.getUsers(this.page);
    this.getRoles();
    this.getLocations();
    this.getDepartments();
  }


  getUsers(page: number): void {
    this.loadingUsers = true;

    this.page = page ?? 1;
    this.users = [];

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


    this.usersService.getUsers(options).subscribe(
      {
        next: (res) => {
          // console.log(res);
          this.users = res.body;
          this.totalLength = Number(res.headers.get('X-Total-Items'));
          this.loadingUsers = false;

        },
        error: (error) => {
          this.loadingUsers = false;
        }
      }
    )
  }


  getRoles(): void {
    this.roleMatrixService.getRoles().subscribe(
      {
        next: (res) => {
          this.roles = res.body;
        }
      }
    )
  }

  getDepartments(): void {
    const options = {
      page: 0,
      size: 10000,
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

  createUser(): void {

    this.performingAction = true;
    this.actionFail = false;

    this.usersService.createUser(this.user).subscribe(
      {
        next: (res) => {

          this.performingAction = false;

          this.closeModal('closeEditModal');
          this.toastService.success('User created successfully!');
         
          this.getUsers(this.page);
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


  editUser(id: string = 'closeEditModal'): void {
    this.performingAction = true;
    this.actionFail = false;

    this.usersService.updateUser(this.user).subscribe(
      {
        next: (res) => {
          this.performingAction = false;
          this.closeModal(id);
          this.getUsers(this.page);

          this.toastService.success('User updated successfully!');
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

  deleteUser(): void {
    this.performingAction = true;
    this.actionFail = false;

    this.usersService.deleteUser(this.user.id).subscribe(
      {
        next: (res) => {
          this.performingAction = false;
          this.closeModal('closeUserActionModal');
          this.getUsers(this.page);

          this.toastService.success('User deleted successfully!');
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

  // setUserPassword(modalId: string = 'closeSetPasswordModal', action: string = 'SET_PASSWORD'): void {
  //   this.performingAction = true;
  //   this.actionFail = false;

  //   const data = {
  //     email: this.user.email,
  //     password: this.user.password
  //   }

  //   this.usersService.setPassword(data).subscribe(
  //     {
  //       next: (res) => {
  //         action !== 'SET_PASSWORD' ? this.getUsers(this.page) : '';
  //         this.performingAction = false;
  //         this.toastService.success('User' + (action === 'SET_PASSWORD' ? 'updated' : 'created') + 'successfully!');
  //         this.closeModal(modalId);
  //       },
  //       error: (error) => {
  //         console.log(error);
  //         this.actionFail = true;
  //         this.performingAction = false;
  //         this.errorMessage = error?.message ?? 'Please try again in 15 minutes';

  //       }
  //     }
  //   )
  // }

  showPassword(id: string): void {
    const passwordInput = document.getElementById(id) as HTMLInputElement;
    this.openPassEye = !this.openPassEye;
    passwordInput.type = this.openPassEye ? 'text' : 'password';
  }



  selectUser(user: any, action: string): void {
    this.user = { ...user };
    this.action = action;
  }

  validateEmail(): void {
    // console.log(!(/\S+@\S+\.\S+/).test(this.user.email.trim()));
    this.emailInvalid = this.user.email && !(/\S+@\S+\.\S+/).test(this.user.email);
  }


  resetUser(): void {
    this.user = {
      role: {
        id: this.roles[0].id
      },
      location: {
        id: this.locations[0].id
      },
      department: {
        id: this.departments[0].id
      }
    };


    this.performingAction = false;
    this.actionFail = false;
    this.openPassEye = false;
  }

  closeModal(id: string): void {
    const close: any = document.getElementById(id) as HTMLElement;
    close?.click();
  }

  resetFilters(): void {
    this.filters = {
      roleId: "",
      status: ""
    }

    this.getUsers(1);
  }

}
