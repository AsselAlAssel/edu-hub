import axios from "axios";

export type MoveResourcePayload = {
	type: "file" | "video";
	id: string;
	targetFolderId: string;
};

export async function moveResourceItem(payload: MoveResourcePayload) {
	const response = await axios.post("/api/move", payload);
	return response.data;
}
