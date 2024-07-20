import OpenAI from "openai";

export async function POST(req: Request) {
	const body = await req.json();

	const { prompt, apiKey } = body;

	const openai = new OpenAI({
		apiKey: apiKey ? apiKey : process.env.OPENAI_API_KEY,
	});

	try {
		const chatCompletion = await openai.chat.completions.create({
			messages: prompt,
			model: "gpt-3.5-turbo",
			temperature: 1,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0,
		});

		const generatedContent = chatCompletion.choices[0].message?.content;

		return new Response(JSON.stringify(generatedContent));
	} catch (error: any) {
		return new Response(JSON.stringify(error.error.message), { status: 500 });
	}
}
