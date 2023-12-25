import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Room } from '../models/room';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  baseUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  getRooms(pageNumber, pageSize){
    let params = getPaginationHeaders(pageNumber, pageSize);
    return getPaginatedResult<Room[]>(this.baseUrl+'Exam', params, this.http);
  }

  addRoom(name: string){
    return this.http.post(this.baseUrl + 'Exam?name=' + name, {});
  }

  editRoom(id: number, name: string){
    return this.http.put(this.baseUrl + 'Exam?id='+ id +'&editName='+name, {})
  }

  deleteExam(id: number){
    return this.http.delete(this.baseUrl+'Exam/'+id);
  }

  deleteAll(){
    return this.http.delete(this.baseUrl+'Exam/delete-all');
  }
}
