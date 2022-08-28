import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { FileUploadService } from 'src/app/services/file-upload.service';
import { FileUpload } from 'src/models/file-upload.model';
import { Message } from 'src/models/message.class';
import { ChannelService } from '../services/channel.service';

import { ThreadService } from '../services/thread.service';
import { User } from 'src/models/user.class';
import { AuthService } from '../services/auth.service';

import { getDownloadURL, getStorage, ref } from '@angular/fire/storage';
import { ResizableDirective } from '../resizable.directive';
import { ChatServiceService } from '../services/chat-service.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  percentage = 0;
  imgSrc: string = '';
  selectedImage: any = null;
  downloadURL: string;
  id: string;
  channel: any;
  questions = [];
  show = false;
  newMessage = new Message();
  user: User = new User();

  @Input() marginRight;

  constructor(
    private uploadService: FileUploadService,
    private fileList: FileUploadService, //?????????
    private authService: AuthService,
    public firestore: AngularFirestore,
    public channelService: ChannelService,
    public threadService: ThreadService,
    private deleteService: ChatServiceService
  ) {}

  ngOnInit(): void {
    this.getChannel();
  }

  getChannel() {
    this.channelService.data$.subscribe((data) => {
      this.channel = data;
      this.firestore
        .collection(`channels/${this.channel['channelId']}/messages`)
        .valueChanges({ idField: 'messageId' })
        .subscribe((msg: any) => {
          this.questions = msg;
          this.show = true;
        });
    });
  }

  goToThread(i) {
    this.threadService.data$.next({
      messageID: this.questions[i]['messageId'],
    });
    this.threadService.opened = true;
    this.threadService.getQuestion();
  }

  deleteItem(i) {
    this.deleteService.chatData$.next({
      messageID: this.questions[i],
    });
    this.deleteService.deleteChat();
  }

  /**
   * Show Date and Time for showing at message
   * @param {number} time uploadTime of message
   * @return {string} eg. 2021-01-16 09:41
   */
  uploadTimeToMessageTime(time) {
    const isoTime = new Date(time).toISOString();
    const date = isoTime.slice(0, 10);
    const timeString = isoTime.slice(11, 16);
    return date + ' / ' + timeString;
  }

  setMessage(value) {
    this.newMessage.question = value;
  }

  /**
   * Save Message and Upload files by clicking send button
   * Only working if something is written in input field.
   */
  saveMessage() {
    if (this.newMessage.question.length > 0) {
      if (this.selectedFiles) {
        this.saveMessageToFirestore().then(() => {
          this.selectedFiles = undefined;
          this.newMessage.question = '';
          this.downloadURL = '';
        });
      } else {
        this.saveMessageToFirestore().then(() => {
          this.newMessage.question = '';
          this.downloadURL = '';
        });
      }
    }
  }

  /**
   * Save Message in Firestore in collection messages
   */
  async saveMessageToFirestore() {
    const actualTime = new Date().getTime();
    await this.firestore
      .collection(`channels/${this.channel['channelId']}/messages`)
      .doc(actualTime.toString())
      .set({
        uploadTime: actualTime,
        question: this.newMessage.question,
        downloads: this.downloadURL || null,
        user: this.authService.user.userName,
      });
  }

  /**
   * Save selected File in variable selectedFiles
   * @param event
   */
  async selectFile(event: any): Promise<void> {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => (this.imgSrc = e.target.result);
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
      this.uploadService
        .pushFileToStorage(this.currentFileUpload)
        .subscribe((percentage) => {
          this.percentage = Math.round(percentage ? percentage : 0);
          if (percentage == 100) {
            this.getFileUrl(this.downloadURL);
            setTimeout(() => {
              this.percentage = 0;
            }, 1000);
          }
        });
    }
  }

  /**
   * Getting download Url from fileName
   * @param {string} fileName
   * @return string
   */
  getFileUrl(fileName: string): any {
    const storage = getStorage();
    getDownloadURL(ref(storage, `uploads/${fileName}`)).then((url) => {
      this.downloadURL = url;
    });
  }
}
