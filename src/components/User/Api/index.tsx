import React from "react";
import CreateToken from "./CreateToken";
import TokenList from "./TokenList";
import { getApiKeys } from "@/actions/api-key";

const APIKey = async () => {
	const tokens = await getApiKeys();

	return (
		<>
			<CreateToken />
			<TokenList tokens={tokens} />
		</>
	);
};

export default APIKey;
