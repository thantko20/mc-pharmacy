import { Typography, Box } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useState, useRef, useEffect } from 'react';
import {
  VideoTrackPublication,
  AudioTrackPublication,
  Track,
  Participant as TwilioParticipant,
} from 'twilio-video';
import { TVideoTracks, TAudioTracks } from '../types';

const publicationToTracks = (
  trackMap: Map<string, VideoTrackPublication | AudioTrackPublication>,
) => {
  return Array.from(trackMap.values())
    .map((publication) => publication.track)
    .filter((track) => track !== null);
};

const useVideoTracks = (participant?: TwilioParticipant) => {
  const [videoTracks, setVideoTracks] = useState<TVideoTracks>([]);

  const videoRef = useRef<any>();

  useEffect(() => {
    if (participant) {
      setVideoTracks(
        publicationToTracks(participant.videoTracks) as TVideoTracks,
      );
    }

    return () => {
      setVideoTracks([]);
    };
  }, [participant]);
};

type ParticipantProps = {
  participant: TwilioParticipant;
  name: string;
  onToggleVideo?: (...args: any) => void;
  onToggleAudio?: (...args: any) => void;
};

export const Participant = ({ participant, name }: ParticipantProps) => {
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
      <Typography variant='subtitle1'>{name}</Typography>

      <Box
        component='video'
        ref={videoRef}
        width='100%'
        maxWidth='700px'
        height='300px'
        sx={{
          objectFit: 'contain',
          borderRadius: '0.75rem',
          overflow: 'hidden',
          backgroundColor: grey[900],
          transform: 'rotateY(180deg)',
        }}
      ></Box>
      <audio ref={audioRef} autoPlay={true} muted={false} />
    </div>
  );
};
