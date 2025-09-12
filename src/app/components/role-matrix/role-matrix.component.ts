import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleMatrixService } from '../../services/role-matrix.service';
import { ToastService } from '../../services/toast.service';
import { fadeIn } from '../../animations';


// import { jsPDF } from "jspdf";
// import { autoTable } from 'jspdf-autotable'

@Component({
  selector: 'app-role-matrix',
  standalone: false,
  templateUrl: './role-matrix.component.html',
  styleUrls: ['./role-matrix.component.scss'],
  animations: [fadeIn]

})
export class RoleMatrixComponent implements OnInit {

  loadingRoles = false;
  roles: any[] = [];
  role: any = {};
  menusAndOperations: any = {};
  menus: any[] = [];
  operations: any[] = [];
  operationFailed = false;
  createEditRole = false;
  hasSelectedMenus = false;
  hasSelectedOperations = false;

  isNotAuthorized = false;
  isNotAuthorizedMessage = '';


  constructor(
    private roleMatrixService: RoleMatrixService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {

    window.scrollTo({ top: 0, behavior: "smooth" });
    this.getRoles();
    this.getMenusAndOperations();
  }


  getRoles(): void {
    this.loadingRoles = true;
    this.isNotAuthorized = false;


    this.roleMatrixService.getRoleMatrix().subscribe(
      {
        next: (res) => {
          // console.log(res);
          this.roles = res.body;
          this.loadingRoles = false;
        },
        error: (error) => {
          console.log(error);
          this.loadingRoles = false;

          if (error.code === 403) {
            this.isNotAuthorized = true;
            this.isNotAuthorizedMessage = error.desc;
          }
        }
      }
    )
  }


  getMenusAndOperations(): void {
    this.menus = [];
    this.operations = [];

    this.roleMatrixService.getMenusAndOperations().subscribe(
      {
        next: (res) => {
          // console.log(res);
          this.menusAndOperations = res.body;
        },
        error: (error) => {
          console.log(error);
        }
      }
    )
  }


  selectRole(role: any): void {
    // console.log(role);
    this.resetRole();

    this.role = Object.assign({}, role);
    this.role.id = this.role.roleId;
    this.role.name = this.role.roleName;

    delete this.role.roleCode;
    delete this.role.roleName;
    delete this.role.roleId;

    this.role.menus.forEach((roleMenu: any) => {
      this.menus.find((menu: any) => {
        if (menu.id === roleMenu.id) {
          menu.checked = roleMenu.checked;
          this.hasSelectedMenus = true;
        }
      });
    });

    this.role.operations.forEach((roleOperation: any) => {
      this.operations.find((operation: any) => {
        if (operation.id === roleOperation.id) {
          operation.checked = roleOperation.checked;
          this.hasSelectedOperations = true;
        }
      });
    });

    // console.log(this.menus, this.operations);
  }

  selectMenus(index: number): void {
    this.menus[index].checked = !this.menus[index].checked;
    this.hasSelectedMenus = this.menus.filter((menu: any) => menu.checked)?.length > 0;
  }

  selectOperations(index: number): void {
    this.operations[index].checked = !this.operations[index].checked;
    this.hasSelectedOperations = this.operations.filter((operation: any) => operation.checked)?.length > 0;
  }

  createRole(): void {
    this.createEditRole = true;
    this.operationFailed = false;

    this.role = { ...this.role, ...this.getMenusAndRolesIds() };

    this.roleMatrixService.createRole(this.role).subscribe(
      {
        next: () => {

          this.createEditRole = false;
          this.closeModal('closeEditModal');

          this.getRoles();
          this.getMenusAndOperations();
          this.toastService.success('Role created submitted!');

        },
        error: (error) => {
          console.log(error);
          this.operationFailed = true;
          this.createEditRole = false;

        }
      }
    )
  }

  editRole(): void {

    this.createEditRole = true;
    this.operationFailed = false;

    this.role = { ...this.role, ...this.getMenusAndRolesIds() };

    this.roleMatrixService.updateRole(this.role).subscribe(
      {
        next: () => {
          this.createEditRole = false;
          this.closeModal('closeEditModal');
          this.toastService.success('Role edited submitted!');

          this.getRoles();
          this.getMenusAndOperations();


        },
        error: (error) => {
          console.log(error);
          this.operationFailed = true;
          this.createEditRole = false;
        }
      }
    )
  }

  getMenusAndRolesIds(): any {
    const menuAndOpsIds: any = {
      menus: this.menus.map((menu: any) => menu.checked ? menu.id : null).filter((id: number) => id),
      operations: this.operations.map((operation: any) => operation.checked ? operation.id : null).filter((id: number) => id)
    };

    return menuAndOpsIds;
  }


  closeModal(id: string): void {
    let close: HTMLElement = document.getElementById(id) as HTMLElement;
    close.click();
  }

  resetRole(): void {
    this.role = {};
    this.menus = JSON.parse(JSON.stringify(this.menusAndOperations.menus ?? []));
    this.operations = JSON.parse(JSON.stringify(this.menusAndOperations.operations ?? []));

    this.operationFailed = false;
    this.createEditRole = false;
  }



  // generatePDF(): void {
  //   const doc = new jsPDF()

  //   doc.addFont("assets/fonts/montserrat/Montserrat-normal-400.ttf", "Montserrat", "normal");
  //   doc.addFont("assets/fonts/montserrat/Montserrat-normal-500.ttf", "Montserrat", "bold");
  //   doc.setFont("Montserrat");



  //   doc.setFontSize(14);
  //   doc.setFont("Montserrat", 'bold');
  //   doc.setTextColor('#3c4043');
  //   doc.text("Credit Card Statements Portal : Role Matrix Table", 14, 12);


  //   // autoTable(doc, { html: '#roleMatrixList' })
  //   // Or use javascript directly:
  //   autoTable(doc, {
  //     startY: 20,
  //     headStyles: {
  //       fillColor: 'var(--app-light-blue)',
  //     },
  //     head: [['Name', 'Code', 'Available Menus', 'Available Operations']],
  //     body: this.roles.map((role: any) =>
  //       [role.roleName, role.roleCode, this.commaSeperated(role.menus), this.commaSeperated(role.operations)]
  //     ),
  //     columnStyles: {
  //       0: { cellWidth: 40 },
  //       1: { cellWidth: 40 },
  //       2: { cellWidth: 50 },
  //       3: { cellWidth: 50 },
  //     },
  //     styles: {
  //       cellPadding: 3,
  //       fontSize: 10,
  //       font: "Montserrat"
  //     },

  //   })

  //   doc.save('Credit Card Statements Portal : Role Matrix Table.pdf', { returnPromise: true }).then(() => {
  //     setTimeout(() => {
  //       this.triggerToast('File downloaded successfully!', 'SUCCESS');
  //     }, 500);
  //   });

  // }


  commaSeperated(list: any): string {
    let commaString: string[] = [];
    list.forEach((item: any, index: number) => {
      item.checked ? commaString.push(item.name) : '';
    })
    return commaString.join(' , ');
  }


}
