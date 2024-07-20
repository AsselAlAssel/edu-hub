"use client";
import dynamic from "next/dynamic";
import { LegacyRef, useRef } from "react";
import type ReactQuill from "react-quill";

interface IWrappedComponent extends React.ComponentProps<typeof ReactQuill> {
	forwardedRef: LegacyRef<ReactQuill>;
}

const ReactQuillBase = dynamic(
	async () => {
		const { default: RQ } = await import("react-quill");

		function QuillJS({ forwardedRef, ...props }: IWrappedComponent) {
			return <RQ ref={forwardedRef} {...props} />;
		}

		return QuillJS;
	},
	{
		ssr: false,
	}
);

export function Editor() {
	const quillRef = useRef<ReactQuill>(null);

	return (
		<>
			<div>
				<ReactQuillBase forwardedRef={quillRef} />
			</div>
		</>
	);
}
