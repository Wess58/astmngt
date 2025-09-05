import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { style, animate, transition, trigger } from '@angular/animations';
import { ComprssNConvrtService } from '../../services/comprss-n-convrt.service';
import { FILE_BORDER_KEYS } from '../../app.constants';


@Component({
  selector: 'app-image-upload',
  standalone: false,
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(400, style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class ImageUploadComponent implements OnChanges {

  dragInProgress = false;

  @Input() title: string = 'Asset images';
  @Input() inputImages: any = [];
  @Input() coverImageUrl: any = [];
  @Input() showSetCoverImage: boolean = true;
  @Input() limit: number = 20;



  @Output() entityImagesEmit = new EventEmitter<any[]>();
  @Output() coverImageEmit = new EventEmitter<any[]>();

  entityImages: any = [];
  fileKeys = FILE_BORDER_KEYS;


  constructor(
    private comprssNConvrtService: ComprssNConvrtService,
  ) { }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['inputImages']) {
      this.entityImages = [];
      this.entityImages = this.inputImages.slice(0, this.limit);
    }
  }


  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragInProgress = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragInProgress = false;;
  }


  openUploadDialog(): void {
    // this.selectedDocumentSide = docSide;
    setTimeout(() => {
      document.getElementById('uploadfile')?.click();
    }, 10);
  }

  onFileChange(event: any): void {
    [...event.target.files].forEach((newFile: any) => {

      newFile.wrongFormat = !newFile.type.startsWith('image/');

      // const reader = new FileReader();
      // reader.onload = (e) => (newFile.image = reader.result);
      // reader.readAsDataURL(newFile);

      newFile.fileName = newFile.name.substr(0, newFile.name.lastIndexOf('.'));
      newFile.failCount = 0;
      newFile.duplicate = this.entityImages.some((file: any) => newFile.name === file.name);
    });

    this.entityImages = [...this.entityImages, ...[...event.target.files]].slice(0, this.limit);
    // filter((file: any) => !file.wrongFormat)
    
    (event.target as HTMLInputElement).value = '';

    this.entityImages.forEach((file: any, index: number) => {

      if (!file.uploaded && !file.compressed && !file.wrongFormat) {
        file.compressing = true;
        setTimeout(() => {
          this.comprssNConvrtService.compress(file);
        }, 500 * (index + 1));
      }
    });



    this.entityImagesEmit.emit(this.entityImages);

  }


  uploadFile(file: any): void {
    this.comprssNConvrtService.compress(file);
  }

  duplicateFileFound(): boolean {
    return this.entityImages.filter((file: any) => file.duplicate).length > 0;
  }

  setCoverImage(file: any): void {
    this.coverImageUrl = file.uuid;
    this.coverImageEmit.emit(file.uuid);
  }

  removeFileFromList(index: number): void {
    this.checkForMoreDuplicates(this.entityImages[index]);
    setTimeout(() => {
      this.entityImages.splice(index, 1);
    }, 100);
  }

  checkForMoreDuplicates(fileToRemove: any): void {
    const files: any = this.entityImages.filter((file: any) => file.name === fileToRemove.name);
    files.length > 1 ? ((files[1].duplicate = false), this.uploadFile(files[1])) : '';
  }

  disableIfFileActivity(): boolean {
    return !this.entityImages?.length || this.entityImages.some((file: any) => file.uploading === true || file.compressing === true);
  }

}
