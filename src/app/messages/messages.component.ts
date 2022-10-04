import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Message} from '../model/message';
import {tap} from 'rxjs/operators';
import { MessagesService } from './messages.service';

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  showMessages = false;

  constructor(public messagesService: MessagesService) {
    console.log("Created messages component.");
    
  }

  ngOnInit() {
    this.messagesService.errors$.subscribe(newErrors => {
      this.showMessages = true;
    });

  }


  onClose() {
    this.showMessages = false;

  }

}
