import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { Subscription } from 'rxjs';
import { eMeet } from 'src/app/models/eMeeting';
import { Member } from 'src/app/models/member';
import { Message } from 'src/app/models/message';
import { User } from 'src/app/models/user';
import { VideoElement } from 'src/app/models/video-element';
import { AccountService } from 'src/app/services/account.service';
import { ChatHubService } from 'src/app/services/chat-hub.service';
import { MessageCountStreamService } from 'src/app/services/message-count-stream.service';
import Peer from "peerjs"; //tsconfig.json "esModuleInterop": true,
import { MuteCamMicService } from 'src/app/services/mute-cam-mic.service';
import { RecordFileService } from 'src/app/services/record-file.service';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from 'src/app/services/ConfigService';
import { UtilityStreamService } from 'src/app/services/utility-stream.service';
// import { RemoteVideoService } from 'src/app/services/remote-video.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isMeeting: boolean;
  messageInGroup: Message[] = [];
  currentRoomId = 0;
  currentUser: User;
  currentMember: Member;
  subscriptions = new Subscription();
  statusScreen: eMeet;
  chatForm: UntypedFormGroup;
  messageCount = 0;
  shareScreenPeer: any;
  @ViewChild('videoPlayer') localvideoPlayer: ElementRef;
  shareScreenStream: any;
  enableShareScreen = true;// enable or disable button sharescreen
  isStopRecord = false;
  textStopRecord = 'Start Record';
  videos: VideoElement[] = [];
  isRecorded: boolean;
  userIsSharing: string;
  role: string= 'examinee';

  constructor(private chatHub: ChatHubService,
    private shareScreenService: MuteCamMicService,
    private configService: ConfigService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private utility: UtilityStreamService,
    private recordFileService: RecordFileService,
    private messageCountService: MessageCountStreamService,
    private accountService: AccountService,
    
    ) {
    this.accountService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.currentMember = { userName: user.userName, displayName: user.displayName } as Member
      }
    })
  }


  // @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
  //   if (this.isMeeting) {
  //     $event.returnValue = true;
  //   }
  // }

  roomId: string;
  myPeer: any;
  ngOnInit(): void {
  
    this.isMeeting = true
    this.isRecorded = this.configService.isRecorded;//enable or disable recorded
    const enableShareScreen = JSON.parse(localStorage.getItem('share-screen'))
    if (enableShareScreen) {// != null
      this.enableShareScreen = enableShareScreen
    }

    

    this.roomId = this.route.snapshot.paramMap.get('id')
    this.createLocalStream()
    this.chatHub.createHubConnection(this.currentUser, this.roomId)
    
    this.myPeer = new Peer(this.currentUser.userName, {
      config: {
        'iceServers': [{
          urls: "stun:stun.l.google.com:19302",          
        },{
          urls:"turn:numb.viagenie.ca",
          username:"webrtc@live.com",
          credential:"muazkh"
        }]
      }
    });   


    //call group
    this.myPeer.on('call', (call) => {
      call.answer(this.stream);

      call.on('stream', (otherUserVideoStream: MediaStream) => {
        this.addOtherUserVideo(call.metadata.userId, otherUserVideoStream);
      });

      call.on('error', (err) => {
        console.error(err);
      })
    });

    this.subscriptions.add(
      this.chatHub.oneOnlineUser$.subscribe(member => {
        if (this.currentUser.userName !== member.userName) {
          // Let some time for new peers to be able to answer
          setTimeout(() => {
            const call = this.myPeer.call(member.userName, this.stream, {
              metadata: { userId: this.currentMember },
            });
            call.on('stream', (otherUserVideoStream: MediaStream) => {
              this.addOtherUserVideo(member, otherUserVideoStream);
            });

            call.on('close', () => {
              this.videos = this.videos.filter((video) => video.user.userName !== member.userName);
              this.tempvideos = this.tempvideos.filter(video => video.user.userName !== member.userName);
            });
          }, 1000);
        }
      })
    );

    this.subscriptions.add(
      this.messageCountService.messageCount$.subscribe(value => {
        this.messageCount = value;
      })
    );

  }

  addOtherUserVideo(userId: Member, stream: MediaStream) {
    const alreadyExisting = this.videos.some(video => video.user.userName === userId.userName);
    if (alreadyExisting) {
      // console.log(this.videos, userId);
      return;
    }

    this.videos.push({
      muted: false,
      srcObject: stream,
      user: userId
    });

    if(this.videos.length <= this.maxUserDisplay){
      this.tempvideos.push({
        muted: false,
        srcObject: stream,
        user: userId
      })
      // this.remoteVideoServe.setVideo(this.tempvideos);
    } 

  }

  maxUserDisplay = 1; // display maximum 1 user
  tempvideos: VideoElement[] = [];
  
  stream: any;
  enableVideo = true;
  enableAudio = true;

  async createLocalStream() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: this.enableVideo, audio: this.enableAudio });
      this.localvideoPlayer.nativeElement.srcObject = this.stream;
      this.localvideoPlayer.nativeElement.load();
      this.localvideoPlayer.nativeElement.play();
    } catch (error) {
      console.error(error);
      alert(`Can't join room, error ${error}`);
    }
  }

  enableOrDisableVideo() {
    this.enableVideo = !this.enableVideo
    if (this.stream.getVideoTracks()[0]) {
      this.stream.getVideoTracks()[0].enabled = this.enableVideo;
      this.chatHub.muteCamera(this.enableVideo)
    }
  }

  enableOrDisableAudio() {
    this.enableAudio = !this.enableAudio;
    if (this.stream.getAudioTracks()[0]) {
      this.stream.getAudioTracks()[0].enabled = this.enableAudio;
      this.chatHub.muteMicroPhone(this.enableAudio)
    }
  }

  onSelect(data: TabDirective): void {
    if (data.heading == "Chat") {
      this.messageCountService.ActiveTabChat = true;
      this.messageCountService.MessageCount = 0;
      this.messageCount = 0;
    } else {
      this.messageCountService.ActiveTabChat = false;
    }
  }

  StartRecord() {
    this.isStopRecord = !this.isStopRecord;
    if (this.isStopRecord) {
      this.textStopRecord = 'Stop record';
      this.recordFileService.startRecording(this.stream);
    } else {
      this.textStopRecord = 'Start record';
      this.recordFileService.stopRecording();
      setTimeout(() => {
        this.recordFileService.upLoadOnServer().subscribe(() => {
          this.toastr.success('Upload file on server success');
        })
      }, 1000)
    }
  }

  ngOnDestroy() {
    this.isMeeting = false;
    this.myPeer.disconnect();
    this.subscriptions.unsubscribe();
    localStorage.removeItem('share-screen');
  }

  navigateToVideoBox()
  {
    this.router.navigateByUrl('video-box');
  }
}
