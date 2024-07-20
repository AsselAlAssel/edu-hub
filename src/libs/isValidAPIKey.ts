import bcrypt from "bcrypt";
const isValidKey = async (apiKey: string, role: string) => {
	const key = role as string;
	const isValidKey = await bcrypt.compare(key, apiKey);
	return isValidKey;
};

export default isValidKey;
