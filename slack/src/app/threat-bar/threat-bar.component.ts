import { Component, OnInit } from '@angular/core';
import { FileUpload } from 'src/models/file-upload.model';
import { FileUploadService } from '../services/file-upload.service';
import { ThreadService } from '../services/thread.service';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { ChannelService } from "../services/channel.service";
import { Message } from 'src/models/message.class';
import { AuthService } from '../services/auth.service';
import {getDownloadURL, getStorage, ref} from "@angular/fire/storage";

@Component({
  selector: 'app-threat-bar',
  templateUrl: './threat-bar.component.html',
  styleUrls: ['./threat-bar.component.scss']
})
export class ThreatBarComponent implements OnInit {

  thread = '';
  channel = '';
  answerMessages = [];
  downloadURL: string;
  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  newAnswer = new Message();
  percentage = 0;

  imgSrc: string = '';
  selectedImage: any = null;

  constructor(private uploadService: FileUploadService,
    public threadService: ThreadService,
    public channelService: ChannelService,
    private authService: AuthService,
    private firestore: AngularFirestore) {
  }

  ngOnInit(): void {
    this.getThread()
  }

  getThread() {
    this.channelService.data$.subscribe((channelData) => {
      this.channel = channelData;
      this.threadService.data$.subscribe((threadData) => {
        console.log(threadData)
        this.thread = threadData;
        this.firestore
          .collection(`channels/${this.channel['channelId']}/messages/${this.thread['messageID']}/answers`)
          .valueChanges()
          .subscribe((msg: any) => {
            console.log(msg);
            this.answerMessages = msg;
            /* this.show = true; */
          });
      });
    })
  }

  openAnswers() {
    this.threadService.data$.next({
      answer: this.answerMessages['answer'],
    });
  }


  // FireStorage
  async selectFile(event: any): Promise<void> {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
      this.selectedFiles = event.target.files;
    } else {
      this.selectedImage = null;
    }
    this.upload();
  }

  /**
   * Upload File in selectedFiles to Firestore and delete selectedFiles
   */
  upload(): void {
    const file: File | null = this.selectedFiles.item(0);
    this.downloadURL = file.name;
    if (file) {
      this.currentFileUpload = new FileUpload(file);
      this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(
        percentage => {
          this.percentage = Math.round(percentage ? percentage : 0);
          if (percentage == 100) {
            this.getFileUrl(this.downloadURL)
            setTimeout(() => {
              this.percentage = 0
            }, 1000);
          }
        })
    }
  }

  /**
   * Getting download Url from fileName
   * @param {string} fileName
   * @return string
   */
  getFileUrl(fileName: string): any {
    const storage = getStorage();
    getDownloadURL(ref(storage, `uploads/${fileName}`))
      .then((url) => {
        this.downloadURL = url
      })
  }

  /**
   * Save Message by clicking send button
   * Only working if something is written in input field.
   */
  saveAnswer() {
    if (this.newAnswer.answers.length > 0) {
      if (this.selectedFiles) {
        this.saveAnswerToFirestore()
          .then(() => {
            this.selectedFiles = undefined;
            this.newAnswer.answers = '';
            this.downloadURL = '';
          })
      } else {
        this.saveAnswerToFirestore()
          .then(() => {
            this.newAnswer.answers = '';
            this.downloadURL = '';
          })
      }
    }
  }

  async saveAnswerToFirestore() {
    const actualTime = new Date().getTime();
    await this.firestore.collection(`channels/${this.channel['channelId']}/messages/${this.thread['messageID']}/answers`)
      .doc(actualTime.toString())  // Time as DocumentId
      .set({
        uploadTime: actualTime,
        answers: this.newAnswer.answers,
        downloads: this.downloadURL || null,
        user: this.authService.user.userName
      });
  }

  setAnswer(value) {
    this.newAnswer.answers = value;
  }

  closeThread() {
    this.threadService.opened = false;
  }

}
