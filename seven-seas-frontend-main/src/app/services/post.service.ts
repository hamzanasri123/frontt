import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Event } from '../interfaces/event.interface';
import { Post } from '../interfaces/posts.interface';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  readonly API: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  getPosts() {
    return this.httpClient.get<any>(`${this.API}/posts/all`);
  }

  getFollowingPosts() {
    return this.httpClient.get<any>(`${this.API}/posts/following`);
  }

  createPost(formData: FormData) {
    return this.httpClient.post<any>(`${this.API}/posts/new`, formData,
      { headers: new HttpHeaders({ enctype: 'multipart/form-data' }) }
    );
  }
  /// delete post 
  deletePost(postId: string) {
    return this.httpClient.delete<any>(`${this.API}/posts/post/${postId}`);
  }
 //// up date post 

 
  updatePost(formData: FormData , id:string)
  {
    return this.httpClient.put<any>('${this.API}/post/${id}',formData);
  }
  ///
  reactToPost(postId: string, reactType: string) {
    return this.httpClient.put<any>(`${this.API}/posts/react/${postId}`, { reactType });
  }

  getUserPosts(userId: string) {
    return this.httpClient.get<any>(`${this.API}/posts/user-posts/${userId}`);
  }

  addComment(comment: string, post: string) {
    return this.httpClient.post<any>(`${this.API}/posts/comment/new`, { content: comment, post });
  }

  getComments(postId: string, count: number) {
    return this.httpClient.get<any>(`${this.API}/posts/comments/${postId}/${count}`);
  }

}
