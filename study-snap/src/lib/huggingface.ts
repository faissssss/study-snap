import { HfInference } from '@huggingface/inference';

// Create a Hugging Face client for AI operations
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Function to generate quiz questions from study material
export async function generateQuizQuestions(content: string, numQuestions: number = 5) {
  try {
    const prompt = `Generate ${numQuestions} multiple-choice quiz questions based on the following study material. For each question, provide 4 options with one correct answer marked. Format as JSON array with 'question', 'options', and 'correctAnswer' fields:\n\n${content}`;
    
    const response = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: prompt,
      parameters: {
        max_new_tokens: 1024,
        temperature: 0.7,
        return_full_text: false
      }
    });
    
    // Parse the generated text to extract JSON
    const jsonMatch = response.generated_text.match(/\[\s*\{.*\}\s*\]/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Failed to parse quiz questions from AI response');
  } catch (error) {
    console.error('Error generating quiz questions:', error);
    throw error;
  }
}

// Function to generate flashcards from study material
export async function generateFlashcards(content: string, numCards: number = 10) {
  try {
    const prompt = `Generate ${numCards} flashcards based on the following study material. Format as JSON array with 'front' and 'back' fields:\n\n${content}`;
    
    const response = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: prompt,
      parameters: {
        max_new_tokens: 1024,
        temperature: 0.7,
        return_full_text: false
      }
    });
    
    // Parse the generated text to extract JSON
    const jsonMatch = response.generated_text.match(/\[\s*\{.*\}\s*\]/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Failed to parse flashcards from AI response');
  } catch (error) {
    console.error('Error generating flashcards:', error);
    throw error;
  }
}