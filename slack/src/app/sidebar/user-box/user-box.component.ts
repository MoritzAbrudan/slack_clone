import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from 'src/models/user.class';

@Component({
  selector: 'app-user-box',
  templateUrl: './user-box.component.html',
  styleUrls: ['./user-box.component.scss']
})
export class UserBoxComponent implements OnInit {
  user = new User();
  dropdown = true;
  allUsers = [];

  constructor(private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.firestore
      .collection('users')
      .valueChanges({ idField: 'customIdName' })
      .subscribe((changes: any) => {
        this.allUsers = changes;
      });
  }

  openUser(i) {
    console.log("User ID is ", this.allUsers[i]['customIdName']);
  }

  seeDropdown() {
    this.dropdown = !this.dropdown;
  }

}
