import React, { useEffect, useState } from 'react'
import { Button, Image, Pressable, Text, TextInput, View } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from '@/src/lib/cloudinary';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/providers/AuthProvider';
import { router } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';

export default function Post() {
  const [caption, setCaption] = useState('');
  const [media, setMedia] = useState<string | null>('');
  const [mediaType, setMediaType] = useState<'video' | 'image' | 'pairedVideo' | 'livePhoto' | undefined>(undefined);
  const session = useAuth();
  const player = useVideoPlayer(media, player => {
    player.loop = true;
    player.play();
  });


  useEffect(() => {
    if (!media) {
      pickMedia();
    }
  }, [media])

  const pickMedia = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      setMedia(result.assets[0].uri)
      setMediaType(result?.assets[0].type)
    }
  };

  const createPost = async () => {
    if (!media) {
      return;
    }
    const response = await uploadImage(media);

    const {data, error} = await supabase
      .from('posts')
      .insert([
        {
          caption,
          image: response.public_id,
          user_id: session?.user?.id,
          media_type: mediaType
        },
      ])
      .select()
    
    setMedia('');
    router.push('/(tabs)');
  }

  return (
    <View className='p-3 items-center flex-1'>
      {/* Image Picker */}
      {!media ? (
        <View className='w-72 aspect-[4/3] rounded-lg bg-slate-300' />
      ) : mediaType === 'image' ? (
        <Image source={{ uri: media }} className='w-72 aspect-[4/3] rounded-lg bg-slate-300' />
      ) : (
        <VideoView style={{ width: '100%', aspectRatio: 4 / 3, borderRadius: 10 }} player={player} allowsFullscreen allowsPictureInPicture />
      )}
      <Text
        onPress={pickMedia}
        className='text-blue-500 font-semibold m-5'
      >
        Change
      </Text>

      {/* Text Input */}
      <TextInput
        placeholder='Write a caption...'
        value={caption}
        onChangeText={(newValue) => setCaption(newValue)}
        className='w-full p-3'
      />

      {/* Button */}
      <View className='mt-auto w-full'>
        <Button title='Share' onPress={createPost} />
      </View>
    </View>
  )
}