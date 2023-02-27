import Twilio, {
  type Room,
  Participant as TwilioParticipant,
  VideoTrackPublication,
  AudioTrackPublication,
  LocalVideoTrack,
  RemoteVideoTrack,
  LocalAudioTrack,
  RemoteAudioTrack,
  Track,
  LocalParticipant,
} from 'twilio-video';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Button, IconButton, Stack } from '@mui/material';
import { SectionContainer } from '@/components/SectionContainer';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { socket } from '@/lib/socket-io';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { TUser } from '@/features/auth/types';
import {
  CallEnd,
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
} from '@mui/icons-material';

type TVideoTracks = (LocalVideoTrack | RemoteVideoTrack | null)[];

type TAudioTracks = (LocalAudioTrack | RemoteAudioTrack | null)[];

const useRoom = ({
  roomName,
  token,
  calleeId,
}: {
  roomName: string;
  token: string;
  calleeId?: string;
}) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [isRoomConnecting, setIsRoomConnecting] = useState(true);
  const { user } = useAuth();

  const navigate = useNavigate();

  const connectRoom = useCallback(async () => {
    try {
      const room = await Twilio.connect(token, {
        name: roomName,
      });
      setRoom(room);
      if (room.participants.size === 0) {
        socket.emit('start-call', {
          callerId: user?._id,
          calleeId: calleeId,
          roomName: room.name,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsRoomConnecting(false);
    }
  }, [roomName, token]);

  const disconnectRoom = () => {
    setRoom((currentRoom) => {
      if (currentRoom && currentRoom.localParticipant.state === 'connected') {
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
    connectRoom();

    return () => {
      disconnectRoom();
    };
  }, []);

  return {
    room,
    hangUp,
    isRoomConnecting,
  };
};

const useParticipants = ({ room }: { room: Room | null }) => {
  const [participants, setParticipants] = useState<TwilioParticipant[]>([]);

  const participantConnected = (participant: TwilioParticipant) => {
    setParticipants((prevParticipants) => [...prevParticipants, participant]);
  };

  const participantDisconnected = (participant: TwilioParticipant) => {
    setParticipants((prevParticipants) =>
      prevParticipants.filter((p) => p !== participant),
    );
  };

  useEffect(() => {
    if (room) {
      room.on('participantConnected', participantConnected);
      room.on('participantDisconnected', participantDisconnected);
      room.participants.forEach(participantConnected);
    } else {
      setParticipants([]);
    }
  }, [room]);

  return {
    participants,
  };
};

const useLocalParticipantControls = (localParticipant?: LocalParticipant) => {
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const toggleVideo = () => {
    if (localParticipant) {
      localParticipant.videoTracks.forEach((publication) => {
        const track = publication.track;
        if (track.isEnabled) {
          track.disable();
          setIsVideoOff(true);
        } else {
          track.enable();
          setIsVideoOff(false);
        }
      });
    }
  };

  const toggleAudio = () => {
    if (localParticipant) {
      localParticipant.audioTracks.forEach((publication) => {
        const track = publication.track;
        if (track.isEnabled) {
          track.disable();
          setIsMuted(true);
        } else {
          track.enable();
          setIsMuted(false);
        }
      });
    }
  };

  return {
    toggleVideo,
    toggleAudio,
    isVideoOff,
    isMuted,
  };
};

type ParticipantProps = {
  participant: TwilioParticipant;
  name: string;
  onToggleVideo?: (...args: any) => void;
  onToggleAudio?: (...args: any) => void;
};

const Participant = ({ participant, name }: ParticipantProps) => {
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
      <h3>{name}</h3>

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
  const { user } = useAuth();
  const location = useLocation();
  const { roomName } = useParams();

  const { token, otherParticipant, isMeCaller } = location.state as {
    token: string;
    otherParticipant: TUser;
    isMeCaller?: boolean;
  };

  if (!roomName || !token || !otherParticipant) {
    return <div>Invalid Blah blah</div>;
  }

  const { room, hangUp } = useRoom({
    roomName: roomName as string,
    token,
    calleeId: otherParticipant._id,
  });
  const { participants } = useParticipants({ room });

  const { toggleVideo, isVideoOff, toggleAudio, isMuted } =
    useLocalParticipantControls(room?.localParticipant);

  if (isMeCaller && !otherParticipant?._id) {
    return <div>Need callee id</div>;
  }

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
                  name={user!.name}
                />
                {participants[0] ? (
                  <Participant
                    key={participants[0].sid}
                    participant={participants[0]}
                    name={otherParticipant.name}
                  />
                ) : null}
              </Stack>
              <Stack direction='row' alignItems='center' spacing={2}>
                <Button
                  onClick={toggleVideo}
                  color='secondary'
                  variant='contained'
                  aria-label='toggle camera'
                >
                  {isVideoOff ? <VideocamOff /> : <Videocam />}
                </Button>
                <Button
                  onClick={toggleAudio}
                  color='secondary'
                  variant='contained'
                  aria-label='toggle microphone'
                >
                  {isMuted ? <MicOff /> : <Mic />}
                </Button>
                <Button variant='contained' color='error' onClick={hangUp}>
                  <CallEnd />
                </Button>
              </Stack>
            </Stack>
          ) : null}
        </div>
      </div>
    </SectionContainer>
  );
};

export default RoomPage;
