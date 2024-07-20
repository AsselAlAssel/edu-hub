import React from "react";

const Loader = ({ style }: { style: string }) => {
	return (
		<span
			className={`h-4 w-4 animate-spin rounded-full border-2 border-solid  border-t-transparent dark:border-t-transparent ${style}`}
		></span>
	);
};

export default Loader;
