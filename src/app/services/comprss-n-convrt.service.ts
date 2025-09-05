import { Injectable } from '@angular/core';
import imageCompression from 'browser-image-compression';

import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ToastService } from './toast.service';
import { AssetsService } from './assets.service';


@Injectable({
  providedIn: 'root'
})
export class ComprssNConvrtService {

  constructor(
    private assetsService: AssetsService,
    private toastService: ToastService
  ) { }


  async compress(file: any): Promise<void> {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      preserveExif: true
    };

    try {

      if (!file.compressed && !file.uploaded && file.size > (150 * 1024)) {
        // ********************
        // CURRENT COMPRESSION JPEG TO WEBP -> 14MB - 905kb - 107kb
        this.toastService.info('Compressing file ...');
        const compressedFile = await imageCompression(file, options);
        // this.downloadBlob(compressedFile, file.name );

        file.blob = await this.convertToWebP(compressedFile);
        file.previewUrl = URL.createObjectURL(file.blob);
        // this.downloadBlob(file.blob, file.fileName + '.webp');

        // ************ 
        // COMPRESSION ALTERNATE WEBP TO JPEG -> 14MB - 1.9MB - 537kb
        // file.blob = await this.convertToWebP(file);
        // this.downloadBlob(file.blob, file.fileName + '.webp');
        // const compressedFile = await imageCompression(file.blob, options);
        // this.downloadBlob(compressedFile, file.name);

        file.compressed = true;
      }else{
        file.previewUrl = URL.createObjectURL(file);
      }

      file.compressing = false;
      this.uploadFile(file);

    } catch (e) {
      file.failed = true;
    }
  }

  async convertToWebP(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (event) => {
        img.src = event.target?.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('WebP conversion failed'));
          },
          'image/webp',
          0.7 // quality: 0 (lowest) to 1 (highest)
        );
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  uploadFile(file: any): void {
    if (!file.uploaded && !file.duplicate) {
      file.failed = false;
      file.uploading = true;
      var namedFile!: File;

      if (file.blob) {
        namedFile = new File(
          [file.blob],
          file.fileName + '.webp',
          { type: file.blob.type }
        );
      }

      // console.log(file);

      const formData = new FormData();
      formData.append('file', file.blob ? namedFile : file);


      this.assetsService.uploadFile(formData).subscribe(
        {
          next: (res: any) => {
            if (res.type === HttpEventType.UploadProgress) {
              file.progress = Math.round((100 * res.loaded) / res.total);
            } else if (res instanceof HttpResponse) {
              // console.log(res);
              file.uploading = false;

              if (res.body[0]?.uploadStatus === 'OK') {
                file.uuid = res.body[0].name;
                file.mediaId = res.body[0].mediaId;
                file.uploaded = true;
                this.toastService.success('File uploaded successfully!');
              } else {
                file.uploaded = false;
                file.failed = true;
                file.description = res.body.description || 'Upload failed. Please try again.';
                this.toastService.error(file?.description);
              }
              // console.log(file);
            }
          },
          error: (error: any) => {
            console.log(error);
            file.failed = true;
            file.uploading = false;
            file.failCount += 1;
            if (file.failCount < 2) {
              this.uploadFile(file);
            }
          }
        });
    }
  }


  downloadBlob(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    // document.body.appendChild(a);
    anchor.click();

    // Cleanup
    // document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
