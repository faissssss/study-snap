export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
          name: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          updated_at?: string
          name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
          name?: string | null
          avatar_url?: string | null
        }
      }
      study_materials: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          created_at: string
          updated_at: string
          type: 'note' | 'article' | 'video_transcript'
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          created_at?: string
          updated_at?: string
          type: 'note' | 'article' | 'video_transcript'
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          created_at?: string
          updated_at?: string
          type?: 'note' | 'article' | 'video_transcript'
        }
      }
      quizzes: {
        Row: {
          id: string
          user_id: string
          material_id: string
          title: string
          created_at: string
          updated_at: string
          last_score: number | null
          times_taken: number
        }
        Insert: {
          id?: string
          user_id: string
          material_id: string
          title: string
          created_at?: string
          updated_at?: string
          last_score?: number | null
          times_taken?: number
        }
        Update: {
          id?: string
          user_id?: string
          material_id?: string
          title?: string
          created_at?: string
          updated_at?: string
          last_score?: number | null
          times_taken?: number
        }
      }
      quiz_questions: {
        Row: {
          id: string
          quiz_id: string
          question: string
          options: Json
          correct_answer: string
          created_at: string
        }
        Insert: {
          id?: string
          quiz_id: string
          question: string
          options: Json
          correct_answer: string
          created_at?: string
        }
        Update: {
          id?: string
          quiz_id?: string
          question?: string
          options?: Json
          correct_answer?: string
          created_at?: string
        }
      }
      flashcards: {
        Row: {
          id: string
          user_id: string
          material_id: string
          title: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          material_id: string
          title: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          material_id?: string
          title?: string
          created_at?: string
          updated_at?: string
        }
      }
      flashcard_items: {
        Row: {
          id: string
          flashcard_id: string
          front: string
          back: string
          created_at: string
          mastery_level: number
        }
        Insert: {
          id?: string
          flashcard_id: string
          front: string
          back: string
          created_at?: string
          mastery_level?: number
        }
        Update: {
          id?: string
          flashcard_id?: string
          front?: string
          back?: string
          created_at?: string
          mastery_level?: number
        }
      }
      user_scores: {
        Row: {
          id: string
          user_id: string
          quiz_id: string
          score: number
          created_at: string
          time_taken: number
        }
        Insert: {
          id?: string
          user_id: string
          quiz_id: string
          score: number
          created_at?: string
          time_taken: number
        }
        Update: {
          id?: string
          user_id?: string
          quiz_id?: string
          score?: number
          created_at?: string
          time_taken?: number
        }
      }
    }
  }
}