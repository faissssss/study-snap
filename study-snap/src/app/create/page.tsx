'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { generateQuizQuestions, generateFlashcards } from '@/lib/huggingface';
import { Label } from '@/components/ui/label';

export default function CreatePage() {
  const { user, isLoading: authLoading } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [materialType, setMaterialType] = useState<'note' | 'article' | 'video_transcript'>('note');
  const [isLoading, setIsLoading] = useState(false);
  const [generationType, setGenerationType] = useState<'quiz' | 'flashcard' | 'both'>('both');
  const router = useRouter();
  
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }
  
  if (!user) {
    router.push('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to create study materials');
      router.push('/login');
      return;
    }

    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!content.trim()) {
      toast.error('Please enter your study content');
      return;
    }

    setIsLoading(true);

    try {
      // Save the study material
      const { data: materialData, error: materialError } = await supabase
        .from('study_materials')
        .insert({
          user_id: user.id,
          title,
          content,
          type: materialType,
        })
        .select()
        .single();

      if (materialError) throw materialError;

      // Generate quiz questions if requested
      if (generationType === 'quiz' || generationType === 'both') {
        try {
          const quizQuestions = await generateQuizQuestions(content);
          
          // Create the quiz
          const { data: quizData, error: quizError } = await supabase
            .from('quizzes')
            .insert({
              user_id: user.id,
              study_material_id: materialData.id,
              title: `${title} Quiz`,
              questions: quizQuestions
            })
            .select()
            .single();

          if (quizError) throw quizError;
        } catch (error: any) {
          console.error('Error generating quiz:', error);
          toast.error(`Failed to generate quiz: ${error.message}`);
        }
      }

      // Generate flashcards if requested
      if (generationType === 'flashcard' || generationType === 'both') {
        try {
          const flashcards = await generateFlashcards(content);
          
          // Create the flashcard set
          const { data: flashcardData, error: flashcardError } = await supabase
            .from('flashcard_sets')
            .insert({
              user_id: user.id,
              study_material_id: materialData.id,
              title: `${title} Flashcards`,
              cards: flashcards
            })
            .select()
            .single();

          if (flashcardError) throw flashcardError;
        } catch (error: any) {
          console.error('Error generating flashcards:', error);
          toast.error(`Failed to generate flashcards: ${error.message}`);
        }
      }

      toast.success('Study material created successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error creating study material:', error);
      toast.error(`Failed to create study material: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create Study Material</CardTitle>
          <CardDescription>
            Enter your study material and generate quizzes or flashcards to help you learn.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter a title for your study material"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="materialType">Material Type</Label>
                <Select value={materialType} onValueChange={(value: any) => setMaterialType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select material type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="note">Note</SelectItem>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="video_transcript">Video Transcript</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Study Content</Label>
                <Textarea
                  id="content"
                  placeholder="Paste or type your study material here"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[200px]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="generationType">Generate</Label>
                <Tabs defaultValue={generationType} onValueChange={(value: any) => setGenerationType(value)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="quiz">Quiz</TabsTrigger>
                    <TabsTrigger value="flashcard">Flashcards</TabsTrigger>
                    <TabsTrigger value="both">Both</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            
            <CardFooter className="flex justify-end px-0 pt-6">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Study Material'}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );