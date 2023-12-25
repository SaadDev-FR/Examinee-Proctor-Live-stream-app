import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecordFileService {

  formData: any;
  mediaRecorder: any;
  recordedBlobs = [];
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  startRecording(stream) {
    this.formData = new FormData();
    const mimeType = 'video/webm';
    const options = { mimeType };
    try {
      //"types": ["node", "dom-mediacapture-record"] tsconfig.app.json
      this.mediaRecorder = new MediaRecorder(stream, options);//npm install -D @types/dom-mediacapture-record
    } catch (e) {
      console.error('Exception while creating MediaRecorder:', e);
    }

    this.mediaRecorder.onstop = (event) => {
      //console.log('Recorder stopped: ', event);
      console.log('Recorded Blobs: ', this.recordedBlobs);
    };
    this.mediaRecorder.ondataavailable = (event)=>{
      //console.log('handleDataAvailable', event);
      if (event.data && event.data.size > 0) {
        this.recordedBlobs.push(event.data);        
      }
    };
    this.mediaRecorder.start();
  }

  stopRecording() {
    this.mediaRecorder.stop();
  }

  upLoadOnServer(){
    const blob = new Blob(this.recordedBlobs);
    this.formData.append('video-blob', blob);
    return this.http.post(this.baseUrl+'RecordVideo', this.formData);
  }

}
