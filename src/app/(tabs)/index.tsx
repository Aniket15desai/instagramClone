import React, { useEffect, useState } from 'react'
import { Alert, FlatList } from 'react-native'
import PostListItem from '@/src/components/PostLostItem';
import { supabase } from '@/src/lib/supabase';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  })

  const fetchPosts = async () => {
    const { data, error } = await supabase.from('posts').select('*, user:profiles(*)');
    if (error) {
      Alert.alert('Something went wrong');
    }

    setPosts(data);
  }
  
  return (
    <FlatList 
        data={posts}
        renderItem={({item}) => <PostListItem post={item} />}
        contentContainerStyle={{
            gap: 10,
            maxWidth: 512,
            alignSelf: 'center',
            width: '100%',
          }}
        showsVerticalScrollIndicator={false}
    />
    // <View className='bg-white'>
    //     <PostListItem post={posts[0]} />
    // </View>
  )
}