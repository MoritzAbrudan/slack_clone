import { Component, OnInit } from '@angular/core';
import { FileUpload } from 'src/models/file-upload.model';
import { FileUploadService } from '../services/file-upload.service';
import { ThreadService } from '../services/thread.service';

@Component({
  selector: 'app-threat-bar',
  templateUrl: './threat-bar.component.html',
  styleUrls: ['./threat-bar.component.scss']
})
export class ThreatBarComponent implements OnInit {

  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  percentage = 0;

  constructor(private uploadService: FileUploadService, public threadService: ThreadService) {
  }

  ngOnInit(): void {
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    console.log(this.selectedFiles)
  }

  upload(): void {
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;

      if (file) {
        this.currentFileUpload = new FileUpload(file);
        this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(
          percentage => {
            this.percentage = Math.round(percentage ? percentage : 0);
          },
          error => {
            console.log(error);
          }
        );
      }
    }

  }

  closeThread() {
    this.threadService.opened = false;
  }

}
