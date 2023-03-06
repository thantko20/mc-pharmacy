import {
  LocalVideoTrack,
  RemoteVideoTrack,
  LocalAudioTrack,
  RemoteAudioTrack,
} from 'twilio-video';
import { TUser } from '../auth/types';

export type TVideoTracks = (LocalVideoTrack | RemoteVideoTrack | null)[];

export type TAudioTracks = (LocalAudioTrack | RemoteAudioTrack | null)[];

export type TCallDeclinePayload = {
  callerId: string;
  calleeId: string;
  roomSid: string;
  roomName: string;
};

export type TListenCallPayload = {
  roomName: string;
  token: string;
  caller: TUser;
  roomSid: string;
};

export type TCallEndedPayload = {
  roomSid: string;
  roomName: string;
};

export type TEndCallPayload = {
  callerId: string;
  calleeId: string;
  roomSid: string;
  roomName: string;
};

export type TMissedCallPayload = {
  callerId: string;
  calleeId: string;
  roomName: string;
  roomSide: string;
};
