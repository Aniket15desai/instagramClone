import React, { useEffect, useState } from 'react'
import { Button, Image, Pressable, Text, TextInput, View } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from '@/src/lib/cloudinary';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/providers/AuthProvider';
import { router } from 'expo-router';

export default function Post() {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState<string>('');
  const session = useAuth();

  useEffect(() => {
    if (image === '') {
      pickImage();
    }
  }, [image])

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const createPost = async () => {
    if(!image){
      return;
    }
    const response = await uploadImage(image);


  const { data, error } = await supabase
  .from('posts')
  .insert([
    { 
      caption, 
      image: response.public_id, 
      user_id: session?.user?.id},
  ])
  .select()

  router.push('/(tabs)');
          
  }

  return (
    <View className='p-3 items-center flex-1'>
      {/* Image Picker */}
      <Image src={image} className='w-72 aspect-[4/3] rounded-lg bg-slate-300' />
      <Text
        onPress={pickImage}
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