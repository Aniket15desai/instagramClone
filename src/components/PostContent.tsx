import React, { useRef, useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import { cld } from '../lib/cloudinary';
import { thumbnail, scale } from '@cloudinary/url-gen/actions/resize';
import { AdvancedImage } from 'cloudinary-react-native';
import { ResizeMode, Video } from 'expo-av';

export default function PostContent({ post, play }: any) {
  const { width } = useWindowDimensions();
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (play) {
        videoRef.current.playAsync();
      } else {
        videoRef.current.pauseAsync();
      }
    }
  }, [play]);

  const handlePlaybackStatusUpdate = (status: any) => {
    if (status.didJustFinish) {
      videoRef.current?.stopAsync();
    }
  };

  if (post.media_type === 'image') {
    const image = cld.image(post.image);
    image.resize(thumbnail().width(width).height(width));

    return <AdvancedImage cldImg={image} className="w-full aspect-[4/3]" />;
  }

  if (post.media_type === 'video') {
    const video = cld.video(post.image);
    video.resize(scale().width(400));

    return (
      <Video
        ref={videoRef}
        className="w-52 aspect-[3/4] rounded-lg bg-slate-300"
        style={{ width: '100%', aspectRatio: 16 / 9 }}
        source={{
          uri: video.toURL(),
        }}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay={play}
        isLooping={false}
        useNativeControls
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />
    );
  }

  return null;
}
