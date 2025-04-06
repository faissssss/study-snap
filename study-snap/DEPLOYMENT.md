# Deployment Guide for StudySnap

This guide will walk you through deploying your StudySnap application to Vercel, which is the recommended hosting platform for Next.js applications.

## Prerequisites

Before deploying, make sure you have:

1. A [Vercel account](https://vercel.com/signup)
2. Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. Your Supabase project set up and running
4. Your Hugging Face API key

## Deployment Steps

### 1. Push Your Code to a Git Repository

If you haven't already, push your code to a Git repository:

```bash
# Initialize a git repository if you haven't already
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit"

# Add your remote repository and push
git remote add origin <your-repository-url>
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on "New Project"
3. Import your Git repository
4. Configure your project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: The default `next build` is fine

### 3. Set Up Environment Variables

In the Vercel project settings, add the following environment variables: