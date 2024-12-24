import React, { useEffect, useRef, useState } from "react";
import { View, Text } from "react-native";
import { AntDesign, Ionicons, Feather } from '@expo/vector-icons';
import { AdvancedImage } from "cloudinary-react-native";

// Import required actions and qualifiers.
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import { cld } from "../lib/cloudinary";
import PostContent from "./PostContent";
import { supabase } from "../lib/supabase";
import { useAuth } from "../providers/AuthProvider";

export default function PostListItem({ post, play }: any) {
    const [isLike, setIsLike] = useState(false);
    const [likeRecord, setLikeRecord] = useState(null);
    const { user } = useAuth();

    const videoRef = useRef<any>(null);

    const avatar = cld.image(post?.user.avatar_url || 'user_ecqd5z');
    avatar
        .resize(thumbnail().width(48).height(48).gravity(focusOn(FocusOn.face())));

    useEffect(() => {
        if (post.my_likes.length > 0) {
            setLikeRecord(post.my_likes[0]);
            setIsLike(true);
        }
    }, [post.my_likes]);

    useEffect(() => {
        if (isLike) {
            saveLike();
        } else {
            deleteLike();
        }
    }, [isLike])

    const saveLike = async () => {
        if (likeRecord) {
            return;
        }
        const { data } = await supabase
            .from('likes')
            .insert([{ user_id: user?.id, post_id: post.id }])
            .select();

        setLikeRecord(data[0]);
    };

    const deleteLike = async () => {
        if (likeRecord) {
            const { error } = await supabase
                .from('likes')
                .delete()
                .eq('id', likeRecord.id);
            if (!error) {
                setLikeRecord(null);
            }
        }
    };

    useEffect(() => {
        if (videoRef.current) {
            if (play) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
        }
    }, [play]);


    return (
        <View className='bg-white'>
            {/* Header */}
            <View className='p-3 flex-row gap-2 items-center'>
                <AdvancedImage cldImg={avatar} className='w-12 aspect-square rounded-full' />
                <Text className='font-semibold'>{post?.user.username || 'New User'}</Text>
            </View>
            <PostContent post={post} play={play} />
            {/* Icons */}
            <View className="flex-row gap-3 p-3">
                <AntDesign
                    name={isLike ? "heart" : "hearto"}
                    onPress={() => setIsLike(!isLike)}
                    size={20}
                    color={isLike ? 'crimson' : 'black'}
                />
                <Ionicons name="chatbubble-outline" size={20} />
                <Feather name="send" size={20} />

                <Feather name="bookmark" size={20} className="ml-auto" />
            </View>

            <View className="px-3">
                <Text className="font-semibold">10 likes</Text>
                <Text>
                    <Text className="font-semibold">
                        {post?.user.username || 'New User'}
                    </Text>
                </Text>
            </View>
        </View>
    )
}