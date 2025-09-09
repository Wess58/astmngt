import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';
import { fadeIn } from '../../../animations';
import { AssetsService } from '../../../services/assets.service';
import { interval, takeUntil } from 'rxjs';

@Component({
  selector: 'app-categories',
  standalone: false,
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  animations: [fadeIn]
})
export class CategoriesComponent implements OnInit {


  loadingCategories = false;
  assetCategories: any = [];
  assetCategory: any = {
    customFields: []
  }

  customerFields: any = [];
  customField: any = {
    formElement: 'Text',
    required: true,
    unique: false
  };

  showCreateColumn: boolean = false;
  createAnother: boolean = false;
  columnTypes: string[] = ['Text', 'Number', 'Select'];
  // TEXT,    CHECKBOX,    RADIO,    TEXTAREA, SELECT

  emailInvalid: boolean = false;
  filters: any = {
    status: ""
  }

  errorMessage: string = '';
  actionFail: boolean = false;
  performingAction: boolean = false;

  statuses: string[] = ['ACTIVE', 'INACTIVE', 'NEW'];
  action: string = '';

  page: number = 1;
  itemsPerPage = 20;
  totalLength: any;


  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private assetsService: AssetsService,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {

    window.scrollTo({ top: 0, behavior: "smooth" });

    this.page = +this.activatedRoute.snapshot.queryParams['page'] || 1;

    this.getAssetCategories(this.page);
  }


  getAssetCategories(page: number): void {
    this.loadingCategories = true;

    this.page = page ?? 1;
    this.assetCategories = [];

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


    this.assetsService.getAllAssetCategories(options).subscribe(
      {
        next: (res) => {
          // console.log(res);
          this.assetCategories = res.body;
          this.totalLength = Number(res.headers.get('X-Total-Items'));
          this.loadingCategories = false;

        },
        error: (error) => {
          this.loadingCategories = false;
        }
      }
    )
  }



  createAssetCategory(): void {

    this.performingAction = true;
    this.actionFail = false;

    this.formatFieldsForCustomCategories();

    this.assetsService.createAssetCategory(this.assetCategory).subscribe(
      {
        next: (res) => {

          this.performingAction = false;
          this.closeModal('closeEditModal');
          this.getAssetCategories(this.page);

          this.toastService.success('Asset category created successfully!');

          // this.setAssetCategoryPassword('closeEditModal', 'CREATE');

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


  editAssetCategory(): void {
    this.performingAction = true;
    this.actionFail = false;

    // const template = JSON.parse(JSON.stringify(this.template));

    // template.newColumns = template.columns.filter((col: any) => col.checked && !col.linkId).map((col: any) => ({ columnId: col.id, nullable: col.nullable, unique: col.unique }))
    // template.removedColumns = template.columns.filter((col: any) => !col.checked && col.linkId).map((col: any) => (col.id));
    // template.columns = template.columns.filter((col: any) => col.checked && col.linkId).map(({ linkId, ...col }: any) => col);

    this.assetsService.updateAssetCategory(this.assetCategory).subscribe(
      {
        next: (res) => {
          this.performingAction = false;
          this.closeModal('closeEditModal');
          this.getAssetCategories(this.page);

          this.toastService.success('Asset category updated successfully!');
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

  formatFieldsForCustomCategories(): any {
    const customerFields: any[] = [...this.customerFields];

    customerFields.forEach((field: any) => {
      // field?.values?.length ? field.values = field.values.split(',').map((val: string) => val.trim()) : '';
      field.formElement = field.formElement.toUpperCase();
    });

    this.assetCategory.customFields = [...customerFields];
  }

  deleteAssetCategory(): void {
    this.performingAction = true;
    this.actionFail = false;

    this.assetsService.deleteAssetCategory(this.assetCategory.id).subscribe(
      {
        next: (res) => {
          this.performingAction = false;
          this.closeModal('closeAssetCategoryActionModal');
          this.getAssetCategories(this.page);

          this.toastService.success('Asset category deleted successfully!');
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

  validateEmail(): void {
    // console.log(!(/\S+@\S+\.\S+/).test(this.user.email.trim()));
    this.emailInvalid = this.assetCategory.email && !(/\S+@\S+\.\S+/).test(this.assetCategory.email);
  }



  selectAssetCategory(assetCategory: any, action: string): void {
    this.assetCategory = { ...assetCategory };
    this.action = action;
    console.log('here');
    
  }


  addCustomField(): void {
    this.customerFields.push(this.customField);
    this.resetCustomeField();

    this.showCreateColumn = this.createAnother;
  }

  resetCustomeField(): void {
    this.customField = {
      formElement: 'Text',
      required: true,
      unique: false
    };
  }

  toggleRequiredCheck(column: any): void {
    column.required = !column.required;
  }

  deleteColumnFromTemplate(index: number): void {
    this.customerFields.splice(index, 1);
  }

  checkIfLabelExists(): boolean {
    return this.customField?.name && this.customerFields.some((col: any) => col.name === this.customField?.name);
  }

  checkIfCategoryExists(): boolean {
    return this.assetCategory?.name && this.assetCategories.some((col: any) =>
      col.name === this.assetCategory?.name &&
      (this.action !== 'EDIT' || (this.action === 'EDIT' && col.id !== this.assetCategory?.id)));
  }


  checkIfSelectValuesExist(): boolean {
    return this.customerFields.some((col: any) => col?.values?.length);
  }

  checkActionCreateTemp(): void {
    if (!this.performingAction) {
      this.createAnother = false;
      (this.showCreateColumn ? this.showCreateColumn = false : this.closeModal('closeEditModal'))
    }
  }


  createOneCustomField(): void {
    // this.actionInProgress = true;

    // this.column.formElement = this.column.formElement.toUpperCase();
    // this.column?.values?.length ? this.column.values = this.column.values.split(',').map((val: string) => val.trim()) : '';
    // this.column.templateId = this.template.id,

    // this.assetsService.createTemplateColumn(this.column).subscribe(
    //   {
    //     next: (res) => {
    //       // console.log(res);
    //       this.toastService.success('Column created successfully!');
    //       this.actionInProgress = false;
    //       this.showCreateColumn = false;

    //     },
    //     error: (error) => {
    //       console.log(error);
    //       this.actionInProgress = false;
    //       this.actionFailed = true;
    //     }
    //   }
    // )
  }


  resetAssetCategory(): void {
    this.assetCategory = { customFields: [] };
    this.customerFields = [];
    this.createAnother = false;
    this.performingAction = false;
    this.actionFail = false;
  }

  closeModal(id: string): void {
    const close: any = document.getElementById(id) as HTMLElement;
    close?.click();
  }

  resetFilters(): void {
    this.filters = {
      status: ""
    }

    this.getAssetCategories(1);
  }


}
