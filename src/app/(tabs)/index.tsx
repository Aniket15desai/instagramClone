import React, { useEffect, useRef, useState } from 'react'
import { Alert, FlatList } from 'react-native'
import PostListItem from '@/src/components/PostLostItem';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/providers/AuthProvider';

type User = {
  avatar_url: string;
  bio: string;
  full_name: string;
  id: string;
  updated_at: string | null;
  username: string;
};

type Post = {
  caption: string;
  created_at: string;
  id: number;
  image: string;
  user: User;
  user_id: string;
  my_likes: Object;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const {user} = useAuth();
  const [playingVideoId, setPlayingVideoId] = useState<number | null>(null);
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  });

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    // Find the first viewable video item
    const firstVideo = viewableItems.find(
      (item: any) => item.item.media_type === 'video'
    );

    if (firstVideo) {
      setPlayingVideoId(firstVideo.key);
    }
  });

  useEffect(() => {
    fetchPosts();
  }, [])

  const fetchPosts = async () => {
    const { data, error } = await supabase.from('posts').select('*, user:profiles(*), my_likes:likes(*), likes(count)')
    // .eq('id', 49) // show only my posts
    .eq('my_likes.user_id', user?.id)
    .order('created_at', { ascending: false });
    if (error) {
      Alert.alert('Something went wrong');
    }

    setPosts(data as Post[]);
  }
  
  return (
    <FlatList 
        data={posts}
        renderItem={({ item }) => (
          <PostListItem post={item} play={item.id === playingVideoId} />
        )}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
        contentContainerStyle={{
            gap: 10,
            maxWidth: 512,
            alignSelf: 'center',
            width: '100%',
        }}
        showsVerticalScrollIndicator={false}
    />
  )
}