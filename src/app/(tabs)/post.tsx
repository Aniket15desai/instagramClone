import React, { useEffect, useState } from 'react'
import { Image, Pressable, Text, TextInput, View } from 'react-native'
import * as ImagePicker from 'expo-image-picker';

export default function Post() {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState<string>('');

  useEffect(() => {
    if(image === '') {
      pickImage();
    }
  }, [image])

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
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
          <Pressable className='bg-blue-500 mx-3 p-3 items-center rounded-md'>
            <Text className='text-white font-semibold'>
              Share
            </Text>
          </Pressable>
        </View>
    </View>
  )
}