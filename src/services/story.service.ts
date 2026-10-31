import type { Story } from "@/libs/story";
import axios from "axios";

export type StoryInput = {
	title: string;
	description: string;
	images: string[];
	youtubeUrl: string;
};

export async function fetchStories(key: string): Promise<Story[]> {
	const response = await axios.get(key);
	return response.data;
}

export async function createStoryRequest(arg: StoryInput) {
	const response = await axios.post("/api/story", arg);
	return response.data;
}

export async function updateStoryRequest(arg: StoryInput & { id: string }) {
	const response = await axios.put("/api/story", arg);
	return response.data;
}

export async function deleteStoryRequest(id: string) {
	const response = await axios.delete("/api/story", { data: { id } });
	return response.data;
}
