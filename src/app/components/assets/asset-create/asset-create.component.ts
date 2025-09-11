import { AfterViewInit, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetsService } from '../../../services/assets.service';
import { ToastService } from '../../../services/toast.service';
import { DepartmentsService } from '../../../services/departments.service';
import { LocationService } from '../../../services/location.service';
import { UsersService } from '../../../services/users.service';
import moment from 'moment';
import { fadeIn } from '../../../animations';

@Component({
  selector: 'app-asset-create',
  standalone: false,
  templateUrl: './asset-create.component.html',
  styleUrl: './asset-create.component.scss',
  animations: [fadeIn]
})
export class AssetCreateComponent {


  step = 1;
  asset: any = {
    assetCategory: { id: 0 },
    location: { id: 0 },
    department: { id: 0 }
  };

  openHolder = false;
  userSearchTerm = '';

  performingAction = false;
  actionFail = false;
  errorMessage = '';

  @Input() propAsset: any;

  @Input() showModal: boolean = false;
  @Input() assetImages: any[] = [];
  @Input() users!: any[];
  @Input() departments!: any[];
  @Input() locations!: any[];
  @Input() categories!: any[];


  @Output() refreshAssetsEmit = new EventEmitter<boolean>();

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

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private assetsService: AssetsService,
    private toastService: ToastService,
  ) { }


  ngOnChanges(changes: SimpleChanges): void {

    if (changes['showModal'] && this.showModal) {

      this.resetAsset();

      this.asset = JSON.parse(JSON.stringify(this.propAsset));
      this.asset.purchaseCost = this.assetsService.formatCurrency(this.asset.purchaseCost ?? '');
      this.asset.currentValue = this.assetsService.formatCurrency(this.asset.currentValue ?? '');
      this.userSearchTerm = this.asset?.holder?.name ?? '';

      this.assetImages = [];
      if (this.asset?.media?.length) {
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
    }
    // if (changes['asset']) {      
    // }
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
    if (this.step === 4) this.addEntityNames();
    // localStorage.setItem('asset', JSON.stringify(this.asset));
  }

  checkForEmptyFields(): boolean {
    if (this.step === 1) return !this.asset.name || !this.asset.model || !this.asset.modelNumber || (this.assetImages?.length > 0 && this.assetImages.some((img: any) => img.uploading || img.compressing));
    if (this.step === 2) return !this.asset.purchaseDate || !this.asset.purchaseCost;
    // if (this.step === 3) return !this.asset.holder.id || !this.userSearchTerm;
    return false;
  }

  checkPercentageValue(): void {
    setTimeout(() => {
      this.asset.depreciation = (+this.asset.depreciation > 100) ? this.asset.depreciation.substring(0, 2) : this.asset.depreciation;
    }, 5);
  }

  verifyDepDate(): void {
    const isGreater = this.asset.fullyDepreciatedDate && moment(this.asset.purchaseDate).diff(moment(this.asset.fullyDepreciatedDate)) >= 0;
    if (isGreater) {
      setTimeout(() => {
        this.asset.fullyDepreciatedDate = moment(this.asset.purchaseDate).add(10, 'days').format('YYYY-MM-DD');
      }, 5);
    }
  }

  addEntityNames(): void {
    this.asset.assetCategory.name = this.categories.find((item: any) => +this.asset.assetCategory.id === item.id)?.name;
    this.asset.department.name = this.departments.find((item: any) => +this.asset.department.id === item.id)?.name;
    this.asset.location.name = this.locations.find((item: any) => +this.asset.location.id === item.id)?.name;
    this.asset.holder.name = this.users.find((item: any) => +this.asset.holder.id === item.id)?.name || '';
    this.userSearchTerm = this.asset.holder.name;
    this.asset.holder.employeeNumber = this.users.find((item: any) => +this.asset.holder.id === item.id)?.employeeNumber || '';
  }

  unassignHolder(): void {
    this.asset.holder.id = 0;
    this.userSearchTerm = '';
  }

  updateImages(assetImages: any): void {
    this.assetImages = assetImages;
  }

  setCoverImage(uuid: any): void {
    this.asset.coverImageUrl = uuid;
  }

  createAsset(): void {

    this.performingAction = true;
    this.actionFail = false;
    // console.log(this.assetFieldsFormatter());

    this.assetsService.create(this.assetFieldsFormatter()).subscribe(
      {
        next: (res) => {

          this.performingAction = false;
          this.closeModal('closeEditModal');
          this.refreshAssetsEmit.emit(true);

          this.toastService.success('Asset updated successfully!');


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


  editAsset(): void {
    this.performingAction = true;
    this.actionFail = false;


    this.assetsService.update(this.assetFieldsFormatter()).subscribe(
      {
        next: (res) => {
          this.performingAction = false;
          this.closeModal('closeEditModal');
          this.refreshAssetsEmit.emit(true);

          this.toastService.success('Asset updated successfully!');
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

  assetFieldsFormatter(): any {

    // moment().format('DD/MM/YYYY')

    const asset = Object.assign({}, this.asset);

    asset.identifier = asset.modelNumber ?? '';
    asset.purchaseCost = +(asset.purchaseCost?.replace(/,/g, ''));
    asset.currentValue = +(asset.currentValue?.replace(/,/g, ''));
    asset.depreciation = +asset.depreciation || 0;

    !asset?.coverImageUrl?.length ? asset.coverImageUrl = this.assetImages[0].uuid : '';
    asset.media = this.assetImages.filter((image: any) => image.uuid !== asset.coverImageUrl).map((image: any) => image.uuid);

    return asset;
  }


  resetAsset(): void {
    this.step = 1;
    this.performingAction = false;
    this.actionFail = false;
    this.assetImages = [];
    this.errorMessage = '';
  }


  closeModal(id: string): void {
    const close: any = document.getElementById(id) as HTMLElement;
    close?.click();
  }
}
