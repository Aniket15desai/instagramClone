import React, { useEffect, useState } from 'react';
import { Image, Pressable, Text, TextInput, View, Modal, Button, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import posts from '@/assets/data/post.json';
import { Feather } from '@expo/vector-icons';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/providers/AuthProvider';
import { cld, uploadImage } from '@/src/lib/cloudinary';
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { AdvancedImage } from 'cloudinary-react-native';

// Define TypeScript type for the profile data
type Profile = {
    id: string;
    username: string;
    bio: string;
    full_name: string;
    avatar_url: string; // Make sure this matches your database schema
};

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
};

export default function ProfileScreen() {
    const { session, user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState<string>('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [name, setName] = useState(posts[0].user.name);
    const [username, setUsername] = useState(posts[0].user.username);
    const [remoteImage, setRemoteImage] = useState<string>('');
    const [bio, setBio] = useState("");
    const [imageId, setImageId] = useState("");
    const [userPosts, setUserPosts] = useState<Post[]>([]);

    useEffect(() => {
        fetchPosts();
    }, [])

    const fetchPosts = async () => {
        const { data, error } = await supabase.from('posts').select('*, user:profiles(*)');
        if (error) {
            Alert.alert('Something went wrong');
        }

        setUserPosts(data as Post[]);
    }

    useEffect(() => {
        if (session) getProfile();
    }, [session]);

    const getProfile = async () => {
        const { data, error } = await supabase
            .from('profiles') // Specify the type here
            .select('*')
            .eq('id', session?.user.id)
            .single();

        if (error) {
            Alert.alert('Something went wrong');
            return;
        }

        if (data) {
            setRemoteImage(data.avatar_url || 'user_ecqd5z');
            setUsername(data.username);
            setName(data.full_name);
            setBio(data.bio);
        }
    };

    const updateProfile = async () => {
        if (!user) {
            return;
        }

        const updatedProfile: Partial<Profile> = {
            id: user.id,
            username,
            bio,
            full_name: name,
        };

        if (image) {
            const response = await uploadImage(image);
            updatedProfile.avatar_url = response.public_id;
        }

        const { error } = await supabase
            .from('profiles')
            .update(updatedProfile)
            .eq('id', user.id);;

        if (error) {
            Alert.alert('Failed to update profile');
        } else {
            Alert.alert('Profile updated successfully');
            setIsModalVisible(false);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    let remoteCldImage;
    if (remoteImage) {
        remoteCldImage = cld.image(remoteImage);
        remoteCldImage.resize(thumbnail().width(300).height(300));
    }

    return (
        <View className="p-4 bg-white flex-1">
            {/* Profile Header */}
            <View className="flex-row justify-between w-full items-center">
                {image ? (
                    <Image
                        source={{ uri: image }}
                        className="w-24 aspect-square self-center rounded-full bg-slate-300"
                    />
                ) : remoteCldImage ? (
                    <AdvancedImage
                        cldImg={remoteCldImage}
                        className="w-24 aspect-square self-center rounded-full bg-slate-300"
                    />
                ) : (
                    <View className="w-24 aspect-square self-center rounded-full bg-slate-300" />
                )}
                <View className="flex-row gap-8">
                    <View className="items-center">
                        <Text className="font-semibold text-xl">{userPosts.length}</Text>
                        <Text className="text-sm">Posts</Text>
                    </View>
                    <View className="items-center">
                        <Text className="font-semibold text-xl">170</Text>
                        <Text className="text-sm">Followers</Text>
                    </View>
                    <View className="items-center">
                        <Text className="font-semibold text-xl">171</Text>
                        <Text className="text-sm">Following</Text>
                    </View>
                </View>
            </View>

            {/* Profile Info */}
            <View className="mt-4">
                <Text className="font-semibold">{name}</Text>
                <Text className="font-semibold text-gray-500">@{username}</Text>
                <Text className="mt-1">{bio}</Text>
            </View>

            {/* Buttons */}
            <View className="flex-row gap-4 mt-4">
                <Pressable
                    onPress={() => setIsModalVisible(true)}
                    className="flex-1 bg-gray-300 p-2 items-center rounded-md"
                >
                    <Text className="text-black text-xs font-normal">Edit Profile</Text>
                </Pressable>
                <Pressable
                    onPress={() => supabase.auth.signOut()}
                    className="flex-1 bg-gray-300 p-2 items-center rounded-md"
                >
                    <Text className="text-black text-xs font-normal">Logout</Text>
                </Pressable>
                <Pressable
                    onPress={() => { }}
                    className="bg-gray-300 w-8 h-8 items-center justify-center rounded-md"
                >
                    <Feather name="user-plus" size={16} />
                </Pressable>
            </View>

            {/* Full-Screen Modal */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                onRequestClose={() => setIsModalVisible(false)}
                collapsable={true}
            >
                <View className="flex-1 bg-white p-6 justify-start">
                    {/* Cross Button */}
                    <Pressable
                        onPress={() => setIsModalVisible(false)}
                        className="ml-auto w-10 h-10 items-center justify-center rounded-full bg-gray-200"
                    >
                        <Feather name="x" size={20} color="black" />
                    </Pressable>

                    <Text className="text-2xl font-bold text-center mb-6">Edit Profile</Text>

                    {/* Profile Image */}
                    {image ? (
                        <Image
                            source={{ uri: image }}
                            className="w-24 aspect-square self-center rounded-full bg-slate-300"
                        />
                    ) : remoteCldImage ? (
                        <AdvancedImage
                            cldImg={remoteCldImage}
                            className="w-24 aspect-square self-center rounded-full bg-slate-300"
                        />
                    ) : (
                        <View className="w-24 aspect-square self-center rounded-full bg-slate-300" />
                    )}
                    <Pressable onPress={pickImage}>
                        <Text className="text-blue-500 text-center mt-2">Change profile photo</Text>
                    </Pressable>

                    {/* Input Fields */}
                    <TextInput
                        className="border-b border-gray-300 mt-4 text-lg p-2"
                        placeholder="Name"
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        className="border-b border-gray-300 mt-4 text-lg p-2"
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                    />
                    <TextInput
                        className="border-b border-gray-300 mt-4 text-lg p-2"
                        placeholder="Bio"
                        multiline
                        value={bio}
                        onChangeText={setBio}
                    />

                    {/* Save Button */}
                    <View className="mt-auto">
                        <Button title="Update profile" onPress={updateProfile} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}
