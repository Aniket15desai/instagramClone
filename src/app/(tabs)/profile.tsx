import React, { useEffect, useState } from 'react';
import { Image, Pressable, Text, TextInput, View, Modal, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import posts from '@/assets/data/post.json';
import { Feather } from '@expo/vector-icons';

export default function ProfileScreen() {
    const [image, setImage] = useState<string>('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [name, setName] = useState(posts[0].user.name);
    const [username, setUsername] = useState(posts[0].user.username);
    const [bio, setBio] = useState("Be extra nice to yourself ✨");

    useEffect(() => {
        if (image === '') {
            pickImage();
        }
    }, [image]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <View className="p-4 bg-white flex-1">
            {/* Profile Header */}
            <View className="flex-row justify-between w-full items-center">
                {image ? (
                    <Image
                        source={{ uri: image }}
                        className="w-24 h-24 rounded-full bg-gray-300"
                    />
                ) : (
                    <View className="w-24 h-24 rounded-full bg-gray-300" />
                )}
                <View className="flex-row gap-8">
                    <View className="items-center">
                        <Text className="font-semibold text-xl">{posts.length}</Text>
                        <Text className="text-sm">Posts</Text>
                    </View>
                    <View className="items-center">
                        <Text className="font-semibold text-xl">60K</Text>
                        <Text className="text-sm">Followers</Text>
                    </View>
                    <View className="items-center">
                        <Text className="font-semibold text-xl">4</Text>
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
                    onPress={() => {}}
                    className="flex-1 bg-gray-300 p-2 items-center rounded-md"
                >
                    <Text className="text-black text-xs font-normal">Share Profile</Text>
                </Pressable>
                <Pressable
                    onPress={() => {}}
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
                    <Image
                        source={{ uri: image || 'https://placehold.co/100' }}
                        className="w-24 h-24 rounded-full self-center bg-gray-200"
                    />
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
                        <Pressable
                            onPress={() => setIsModalVisible(false)}
                            className="bg-blue-500 p-3 rounded-md items-center"
                        >
                            <Text className="text-white text-lg font-semibold">Save</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
