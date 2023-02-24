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
import { Box, Button, Stack } from '@mui/material';
import { SectionContainer } from '@/components/SectionContainer';
import { useLocation, useNavigate } from 'react-router-dom';
import { socket } from '@/lib/socket-io';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { TUser } from '@/features/auth/types';

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

  const { user } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const { token, roomName, callee } = location.state as {
    token: string;
    roomName: string;
    callee: TUser;
  };

  if (!callee._id) {
    return <div>Need callee id</div>;
  }

  const disconnectRoom = () => {
    setRoom((currentRoom) => {
      if (currentRoom && currentRoom.localParticipant.state === 'connected') {
        setParticipants([]);
        currentRoom.localParticipant.tracks.forEach((track) =>
          track.unpublish(),
        );
        currentRoom.disconnect();
        return null;
      }
      return currentRoom;
    });
  };

  const hangUp = () => {
    disconnectRoom();
    navigate('/test');
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

    const connectRoom = async () => {
      try {
        const room = await Twilio.connect(token, {
          name: roomName,
        });

        setRoom(room);
        socket.emit('start-call', {
          callerId: user?._id,
          calleeId: callee._id,
          roomName: room.name,
        });
        room.on('participantConnected', participantConnected);
        room.on('participantDisconnected', participantDisconnected);
        room.participants.forEach(participantConnected);
      } catch (error) {
        console.log(error);
      }
    };

    connectRoom();

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

  return (
    <SectionContainer>
      <div>
        <div>
          {room ? (
            <Stack
              direction='column'
              spacing={2}
              justifyContent='center'
              alignItems='center'
            >
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                <Participant
                  key={room.localParticipant.sid}
                  participant={room.localParticipant}
                />
                {participants[0] ? (
                  <Participant
                    key={participants[0].sid}
                    participant={participants[0]}
                  />
                ) : null}
              </Stack>
              <Button variant='contained' color='error' onClick={hangUp}>
                Hangup
              </Button>
            </Stack>
          ) : null}
        </div>
      </div>
    </SectionContainer>
  );
};

export default RoomPage;
