import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { VideoElement } from 'src/app/models/video-element';
import { MuteCamMicService } from 'src/app/services/mute-cam-mic.service';
import { PresenceService } from 'src/app/services/presence.service';
// import { RemoteVideoService } from 'src/app/services/remote-video.service';

@Component({
  selector: 'app-video-box-user',
  templateUrl: './video-box-user.component.html',
  styleUrls: ['./video-box-user.component.css']
})
export class VideoBoxUserComponent implements OnInit, OnDestroy {
  @Input() userVideo: VideoElement;
  @ViewChild('remoteVideo') localvideoPlayer: ElementRef;
  enableMicro = true;
  enableCamera = true;
  subscriptions = new Subscription();
  // remoteData: VideoElement[] = [];
    // data: VideoElement;
  constructor(private muteService: MuteCamMicService) { }

  ngOnInit(): void {

    // this.data =this.remote.tempvideos[0]
    // this.setRemote()
    this.enableMicro = this.userVideo.srcObject.getAudioTracks()[0]? this.userVideo.srcObject.getAudioTracks()[0].enabled : false
    this.enableCamera = this.userVideo.srcObject.getVideoTracks()[0] ? this.userVideo.srcObject.getVideoTracks()[0].enabled : false

    this.subscriptions.add(this.muteService.muteCamera$.subscribe(data=>{
      if(this.userVideo.user.userName === data.username){
        this.enableCamera = data.mute;
      }
    }))

    this.subscriptions.add(this.muteService.muteMicro$.subscribe(data=>{
      if(this.userVideo.user.userName === data.username){
        this.enableMicro = data.mute
      }
    }))
  }

  onLoadedMetadata(event: Event) {
    (event.target as HTMLVideoElement).play();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // setRemote()
  // {
  //   debugger;
  //   setTimeout(() => {
  //     this.remote.sharedParam$.subscribe((res =>
  //       {
  //         console.log('res',res);
          
  //       }))
  //   },1000);
  // }
}
