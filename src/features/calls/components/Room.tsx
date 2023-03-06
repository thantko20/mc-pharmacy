import { useAuth } from '@/features/auth/components/AuthProvider';
import { TUser } from '@/features/auth/types';
import {
  VideocamOff,
  Videocam,
  MicOff,
  Mic,
  CallEnd,
  Info,
} from '@mui/icons-material';
import {
  Stack,
  CircularProgress,
  Typography,
  IconButton,
  Button,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Participant } from './Participant';
import { socket } from '@/lib/socket-io';
import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import Twilio, {
  type LocalParticipant,
  Participant as TwilioParticipant,
  Room as TRoom,
} from 'twilio-video';
import {
  TCallDeclinePayload,
  TCallEndedPayload,
  TMissedCallPayload,
} from '../types';

const useRoom = ({
  roomName,
  token,
  calleeId,
  callerId,
}: {
  roomName: string;
  token: string;
  calleeId: string;
  callerId: string;
}) => {
  const [room, setRoom] = useState<TRoom | null>(null);
  const [isConnectingToRoom, setIsConnectingToRoom] = useState(true);

  const navigate = useNavigate();

  const endCall = () => {
    if (room) {
      socket.emit('callEnded', {
        callerId,
        calleeId,
        roomName: room.name,
        roomSid: room.sid,
      });
    }
    hangUp();
  };

  useEffect(() => {
    const callEndedListener = (payload: TCallEndedPayload) => {
      toast(`Other participant hanged up the call.`, {
        icon: <Info />,
      });
      hangUp();
    };

    const declineCallListener = (payload: TCallDeclinePayload) => {
      toast.error(`Other participant declined the call.`);
      hangUp();
    };

    const missedCallListener = (payload: TMissedCallPayload) => {
      toast.success('Call took too long.');
      hangUp();
    };

    socket.on('callEnded', callEndedListener);

    socket.on('declineCall', declineCallListener);

    socket.on('missedCall', missedCallListener);

    return () => {
      socket.off('callEnded', callEndedListener);
      socket.off('declineCall', declineCallListener);
    };
  }, []);

  const isWebcamAvailable = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      return true;
    } catch (error) {
      return false;
    }
  };

  const isMicAvailable = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  const connectRoom = useCallback(async () => {
    try {
      const hasCam = await isWebcamAvailable();
      const hasMic = await isMicAvailable();
      const room = await Twilio.connect(token, {
        name: roomName,
        video: hasCam,
        audio: hasMic,
      });

      setRoom(room);

      if (room.participants.size === 0) {
        socket.emit('startCall', {
          callerId: callerId,
          calleeId: calleeId,
          roomName: room.name,
          roomSid: room.sid,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsConnectingToRoom(false);
    }
  }, [roomName, token]);

  const disconnectRoom = () => {
    setRoom((currentRoom) => {
      if (currentRoom) {
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
    isConnectingToRoom,
    endCall,
  };
};

const useParticipants = ({ room }: { room: TRoom | null }) => {
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

type RoomProps = {
  roomName: string;
  token: string;
  otherParticipant: TUser;
  isMeCaller?: boolean;
};

export const Room = ({
  roomName,
  token,
  otherParticipant,
  isMeCaller,
}: RoomProps) => {
  const { user } = useAuth();

  const calleeId = isMeCaller ? otherParticipant._id : user!._id;
  const callerId = isMeCaller ? user!._id : otherParticipant._id;

  const { room, isConnectingToRoom, endCall } = useRoom({
    roomName: roomName as string,
    token,
    calleeId,
    callerId,
  });
  const { participants } = useParticipants({ room });

  const { toggleVideo, isVideoOff, toggleAudio, isMuted } =
    useLocalParticipantControls(room?.localParticipant);

  if (isMeCaller && !otherParticipant?._id) {
    return <div>Need callee id</div>;
  }

  return (
    <div>
      <div>
        {isConnectingToRoom ? (
          <Stack
            display='flex'
            alignItems='center'
            justifyContent='center'
            mt={10}
          >
            <CircularProgress />
            <Typography variant='h5'>Connecting...</Typography>
          </Stack>
        ) : room ? (
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
            <Stack
              direction='row'
              alignItems='center'
              spacing={4}
              bgcolor={grey[200]}
              p={2}
              borderRadius='9999px'
            >
              <IconButton
                onClick={toggleVideo}
                aria-label='toggle camera'
                color={isVideoOff ? 'default' : 'primary'}
              >
                {isVideoOff ? <VideocamOff /> : <Videocam />}
              </IconButton>
              <IconButton
                onClick={toggleAudio}
                aria-label='toggle microphone'
                color={isMuted ? 'default' : 'primary'}
              >
                {isMuted ? <MicOff /> : <Mic />}
              </IconButton>
              <Button
                variant='contained'
                color='error'
                onClick={endCall}
                aria-label='hang up'
              >
                <CallEnd />
              </Button>
            </Stack>
          </Stack>
        ) : null}
      </div>
    </div>
  );
};
