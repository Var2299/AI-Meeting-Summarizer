import Groq from 'groq-sdk';

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY is not set in environment variables');
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateSummary(transcript: string, customPrompt: string): Promise<string> {
  try {
    const systemPrompt = `You are an AI assistant that helps summarize meeting transcripts. 
    Follow the user's specific instructions for formatting and focus areas.
    Always provide clear, structured, and professional summaries.`;

    const userPrompt = `Please analyze the following meeting transcript and ${customPrompt}:

    Transcript:
    ${transcript}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama3-8b-8192',
      temperature: 0.3,
      max_tokens: 2048,
    });

    return completion.choices[0]?.message?.content || 'Unable to generate summary';
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate summary');
  }
}
