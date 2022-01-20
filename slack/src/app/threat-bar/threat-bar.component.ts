import { Component, OnInit } from '@angular/core';
import { FileUpload } from 'src/models/file-upload.model';
import { FileUploadService } from '../services/file-upload.service';
import { ThreadService } from '../services/thread.service';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { ChannelService } from "../services/channel.service";
import { Message } from 'src/models/message.class';
import { AuthService } from '../services/auth.service';

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
  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    console.log(this.selectedFiles)
  }

  upload(): void {
    this.saveAnswer();

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

  saveAnswer() {
    if (this.newAnswer.answers.length > 0) {
      if (this.selectedFiles) {
        this.saveAnswerToFirestore()
          .then(() => {
            this.selectedFiles = undefined;
            this.newAnswer.answers = '';
          });

      } else {
        this.saveAnswerToFirestore()
          .then(() => {
            this.newAnswer.answers = '';
          });
      }
    }
  }

  async saveAnswerToFirestore() {
    const actualTime = new Date().getTime();
    await this.firestore.collection(`channels/${this.channel['channelId']}/messages/${this.thread['messageId']}/answers`)
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
