import { Component, OnInit, Input, Output } from '@angular/core';
import { Post } from 'src/app/shared/models/post';
import { EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {

  @Input()
  post: Post;
  
  constructor(private auth: AuthService) { }

  ngOnInit() {
  }
}
