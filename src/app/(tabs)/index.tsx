import React from 'react'
import { FlatList } from 'react-native'
import posts from '@/assets/data/post.json';
import PostListItem from '@/src/components/PostLostItem';

export default function Home() {
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