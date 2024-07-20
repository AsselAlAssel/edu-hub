import React from "react";
import { connectHits } from "react-instantsearch-dom";

const EmptyState = ({ hits }: any) => {
	return (
		<>
			{hits?.length == 0 ? (
				<div className='p-8'>
					<p className='text-body-color text-center text-base'>
						Enter keywords to see the result ...
					</p>
				</div>
			) : null}
		</>
	);
};

export default connectHits(EmptyState);
