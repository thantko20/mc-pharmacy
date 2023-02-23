import Twilio, {
  type Room,
  Participant as TParticipant,
  VideoTrackPublication,
  AudioTrackPublication,
  LocalVideoTrack,
  RemoteVideoTrack,
  LocalAudioTrack,
  RemoteAudioTrack,
  Track,
} from 'twilio-video';
import { useState, useEffect, useRef } from 'react';
import { axios } from '@/lib/axios';
import { TSuccessResponse } from '@/types';
import { Box, Button } from '@mui/material';
import { SectionContainer } from '@/components/SectionContainer';

type TVideoTracks = (LocalVideoTrack | RemoteVideoTrack | null)[];

type TAudioTracks = (LocalAudioTrack | RemoteAudioTrack | null)[];

const Participant = ({ participant }: { participant: TParticipant }) => {
  const [videoTracks, setVideoTracks] = useState<TVideoTracks>([]);
  const [audioTracks, setAudioTracks] = useState<TAudioTracks>([]);

  const videoRef = useRef<any>(null);
  const audioRef = useRef<any>(null);

  const trackpubsToTracks = (
    trackMap: Map<string, VideoTrackPublication | AudioTrackPublication>,
  ) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);

  useEffect(() => {
    setVideoTracks(trackpubsToTracks(participant.videoTracks) as TVideoTracks);
    setAudioTracks(trackpubsToTracks(participant.audioTracks) as TAudioTracks);

    const trackSubscribed = (track: Track) => {
      if (track.kind === 'video') {
        setVideoTracks(
          (videoTracks) => [...videoTracks, track] as TVideoTracks,
        );
      } else {
        setAudioTracks(
          (audioTracks) => [...audioTracks, track] as TAudioTracks,
        );
      }
    };

    const trackUnsubscribed = (track: Track) => {
      if (track.kind === 'video') {
        setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track));
      } else {
        setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track));
      }
    };

    participant.on('trackSubscribed', trackSubscribed);
    participant.on('trackUnsubscribed', trackUnsubscribed);

    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
    };
  }, [participant]);

  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach(videoRef.current);
      };
    }
  }, [videoTracks]);

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach(audioRef.current);
      };
    }
  }, [audioTracks]);

  return (
    <div className='participant'>
      <h3>{participant.identity}</h3>

      <Box
        component='video'
        ref={videoRef}
        width='100%'
        maxWidth='400px'
        height='200px'
      ></Box>
      <audio ref={audioRef} autoPlay={true} muted={false} />
    </div>
  );
};

const RoomPage = () => {
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<TParticipant[]>([]);

  const disconnectRoom = () => {
    setRoom((currentRoom) => {
      if (currentRoom && currentRoom.localParticipant.state === 'connected') {
        setParticipants([]);
        currentRoom.disconnect();
        return null;
      }
      return currentRoom;
    });
  };

  useEffect(() => {
    const participantConnected = (participant: TParticipant) => {
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    };

    const participantDisconnected = (participant: TParticipant) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant),
      );
    };

    axios
      .post<never, TSuccessResponse<{ token: string; roomName: string }>>(
        '/rooms',
        { roomName: 'haahhahha' },
      )
      .then((data) => {
        Twilio.connect(data.payload.token, {
          name: 'haahhahha',
        }).then((room) => {
          console.log(room);
          setRoom(room);
          room.on('participantConnected', participantConnected);
          room.on('participantDisconnected', participantDisconnected);
          room.participants.forEach(participantConnected);
        });
      });

    return () => {
      setRoom((currentRoom) => {
        if (currentRoom && currentRoom.localParticipant.state === 'connected') {
          currentRoom.disconnect();
          return null;
        } else {
          return currentRoom;
        }
      });
    };
  }, []);

  const remoteParticipants = participants.map((participant) => (
    <Participant key={participant.sid} participant={participant} />
  ));

  return (
    <SectionContainer>
      <div className='room'>
        <div className='local-participant'>
          {room ? (
            <>
              <Participant
                key={room.localParticipant.sid}
                participant={room.localParticipant}
              />
              <Button
                variant='contained'
                color='error'
                onClick={disconnectRoom}
              >
                Hangup
              </Button>
            </>
          ) : (
            ''
          )}
        </div>
        <h3>Remote Participants</h3>
        <div className='remote-participants'>{remoteParticipants}</div>
      </div>
    </SectionContainer>
  );
};

export default RoomPage;
