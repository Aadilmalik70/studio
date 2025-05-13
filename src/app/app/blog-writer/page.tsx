
'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { generateBlogIdeas, type GenerateBlogIdeasOutput } from '@/ai/flows/generate-blog-ideas';
import { draftBlogContent, type DraftBlogContentOutput } from '@/ai/flows/draft-blog-content';
import { optimizeSeo, type OptimizeSeoOutput } from '@/ai/flows/optimize-seo';
import { ChevronLeft, ChevronRight, Loader2, Wand2, DraftingCompass, CheckCircle, Save, SearchCheck } from 'lucide-react';
import type { BlogPost } from '@/app/app/dashboard/blog/page'; 


const BlogWriterPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [generatedIdeas, setGeneratedIdeas] = useState<GenerateBlogIdeasOutput['ideas']>([]);
  const [selectedIdeaIndex, setSelectedIdeaIndex] = useState<number | null>(null);
  
  const [blogTitle, setBlogTitle] = useState('');
  const [blogOutline, setBlogOutline] = useState('');
  const [draftedContent, setDraftedContent] = useState('');
  
  const [seoKeyword, setSeoKeyword] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  const [isLoading, setIsLoading] = useState({
    ideas: false,
    draft: false,
    seo: false,
    save: false,
  });

  const totalSteps = 4;
  const progressValue = (currentStep / totalSteps) * 100;

  useEffect(() => {
    const keywordsFromQuery = searchParams.get('keywords');
    if (keywordsFromQuery) {
      setKeyword(decodeURIComponent(keywordsFromQuery));
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedIdeaIndex !== null && generatedIdeas[selectedIdeaIndex]) {
      const idea = generatedIdeas[selectedIdeaIndex];
      setBlogTitle(idea.title);
      setBlogOutline(idea.outline);
      setSeoKeyword(keyword); 
    }
  }, [selectedIdeaIndex, generatedIdeas, keyword]);

  const handleGenerateIdeas = async (e: FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) {
      toast({ title: 'Error', description: 'Please enter a keyword.', variant: 'destructive' });
      return;
    }
    setIsLoading(prev => ({ ...prev, ideas: true }));
    try {
      const result = await generateBlogIdeas({ keyword });
      setGeneratedIdeas(result.ideas);
      toast({ title: 'Success', description: `${result.ideas.length} blog ideas generated!` });
    } catch (error) {
      console.error('Error generating blog ideas:', error);
      toast({ title: 'Error', description: 'Failed to generate blog ideas.', variant: 'destructive' });
    } finally {
      setIsLoading(prev => ({ ...prev, ideas: false }));
    }
  };

  const handleSelectIdea = (index: number) => {
    setSelectedIdeaIndex(index);
  };

  const handleDraftContent = async () => {
    if (!blogOutline.trim()) {
      toast({ title: 'Error', description: 'Blog outline cannot be empty.', variant: 'destructive' });
      return;
    }
    setIsLoading(prev => ({ ...prev, draft: true }));
    try {
      const result = await draftBlogContent({ outline: blogOutline });
      setDraftedContent(result.draft);
      toast({ title: 'Success', description: 'Blog content drafted successfully!' });
      setCurrentStep(3);
    } catch (error) {
      console.error('Error drafting blog content:', error);
      toast({ title: 'Error', description: 'Failed to draft blog content.', variant: 'destructive' });
    } finally {
      setIsLoading(prev => ({ ...prev, draft: false }));
    }
  };

  const handleOptimizeSeo = async () => {
    if (!draftedContent.trim() || !seoKeyword.trim()) {
      toast({ title: 'Error', description: 'Draft content and SEO keyword are required.', variant: 'destructive' });
      return;
    }
    setIsLoading(prev => ({ ...prev, seo: true }));
    try {
      const result = await optimizeSeo({ blogPostContent: draftedContent, keyword: seoKeyword });
      setMetaTitle(result.metaTitle);
      setMetaDescription(result.metaDescription);
      toast({ title: 'Success', description: 'SEO metadata generated!' });
      setCurrentStep(4);
    } catch (error) {
      console.error('Error optimizing SEO:', error);
      toast({ title: 'Error', description: 'Failed to optimize SEO.', variant: 'destructive' });
    } finally {
      setIsLoading(prev => ({ ...prev, seo: false }));
    }
  };

  const handleSavePost = () => {
    setIsLoading(prev => ({ ...prev, save: true }));
    const newPost: BlogPost = {
      id: new Date().toISOString(),
      title: blogTitle,
      content: draftedContent,
      metaTitle: metaTitle,
      metaDescription: metaDescription,
      outline: blogOutline,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const existingPostsRaw = localStorage.getItem('blogPosts');
      const existingPosts: BlogPost[] = existingPostsRaw ? JSON.parse(existingPostsRaw) : [];
      localStorage.setItem('blogPosts', JSON.stringify([...existingPosts, newPost]));
      
      toast({
        title: 'Blog Post Saved!',
        description: `"${blogTitle}" has been saved successfully.`,
        action: (
          <Button variant="outline" size="sm" onClick={() => router.push('/app/dashboard/blog')}>
            View Posts
          </Button>
        ),
      });
      // Optionally reset form or navigate after save
      // For example, to go to the dashboard: router.push('/app/dashboard/blog');
      // Or to reset the form for a new post:
      // setCurrentStep(1); setKeyword(''); setGeneratedIdeas([]); setSelectedIdeaIndex(null); // etc.
    } catch (error) {
        console.error("Failed to save post to localStorage", error);
        toast({ title: 'Error', description: 'Failed to save blog post to local storage.', variant: 'destructive' });
    } finally {
        setIsLoading(prev => ({ ...prev, save: false }));
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && selectedIdeaIndex === null) {
      toast({ title: 'Error', description: 'Please select a blog idea to proceed.', variant: 'destructive' });
      return;
    }
     if (currentStep === 1 && generatedIdeas.length === 0 && !keyword.trim()) {
      toast({ title: 'Error', description: 'Please generate or enter keywords and select an idea.', variant: 'destructive' });
      return;
    }
    if (currentStep === 1 && generatedIdeas.length > 0 && selectedIdeaIndex === null) {
      toast({ title: 'Error', description: 'Please select one of the generated ideas.', variant: 'destructive' });
      return;
    }
    if (currentStep === 2 && !draftedContent) {
      toast({ title: 'Error', description: 'Please draft content before proceeding.', variant: 'destructive' });
      return;
    }
    if (currentStep === 3 && (!metaTitle || !metaDescription)) {
       toast({ title: 'Error', description: 'Please optimize SEO before proceeding.', variant: 'destructive' });
      return;
    }
    if (currentStep < totalSteps) setCurrentStep(s => s + 1);
  };
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(s => s - 1);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Blog Writer Studio</CardTitle>
          <CardDescription>Follow the steps below to create your next masterpiece.</CardDescription>
          <Progress value={progressValue} className="mt-4" />
          <p className="text-sm text-muted-foreground mt-2 text-center">Step {currentStep} of {totalSteps}</p>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Step 1: Generate Ideas */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Wand2 className="text-accent" /> Step 1: Generate Blog Ideas</CardTitle>
                <CardDescription>Enter keyword(s) to brainstorm blog titles and outlines. You can use comma-separated keywords from your research.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGenerateIdeas} className="space-y-4">
                  <div>
                    <Label htmlFor="keyword">Keyword(s)</Label>
                    <Input
                      id="keyword"
                      type="text"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder="e.g., AI in Marketing, content strategy tips"
                      className="mt-1"
                    />
                  </div>
                  <Button type="submit" disabled={isLoading.ideas} className="w-full sm:w-auto">
                    {isLoading.ideas && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate Ideas
                  </Button>
                </form>
                {generatedIdeas.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-semibold">Choose an Idea:</h3>
                    {generatedIdeas.map((idea, index) => (
                      <Card 
                        key={index} 
                        className={`cursor-pointer hover:shadow-md transition-shadow ${selectedIdeaIndex === index ? 'border-primary ring-2 ring-primary' : ''}`}
                        onClick={() => handleSelectIdea(index)}
                      >
                        <CardHeader>
                          <CardTitle className="text-md">{idea.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground whitespace-pre-line">{idea.outline}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 2: Draft Content */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><DraftingCompass className="text-accent"/> Step 2: Draft Your Blog Post</CardTitle>
                <CardDescription>Review and refine the AI-generated outline, then draft the content.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="blogTitle">Blog Title</Label>
                  <Input 
                    id="blogTitle" 
                    value={blogTitle} 
                    onChange={(e) => setBlogTitle(e.target.value)}
                    className="mt-1 text-lg font-semibold"
                  />
                </div>
                <div>
                  <Label htmlFor="blogOutline">Blog Outline</Label>
                  <Textarea
                    id="blogOutline"
                    value={blogOutline}
                    onChange={(e) => setBlogOutline(e.target.value)}
                    placeholder="Enter your blog post outline here..."
                    rows={8}
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleDraftContent} disabled={isLoading.draft || !blogOutline.trim()} className="w-full sm:w-auto">
                  {isLoading.draft && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Draft Content
                </Button>
                {draftedContent && (
                  <div className="mt-6">
                    <Label htmlFor="draftedContent">Drafted Content</Label>
                    <Textarea
                      id="draftedContent"
                      value={draftedContent}
                      onChange={(e) => setDraftedContent(e.target.value)}
                      rows={15}
                      className="mt-1 bg-secondary/30"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 3: Optimize SEO */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><SearchCheck className="text-accent"/> Step 3: Optimize for SEO</CardTitle>
                <CardDescription>Generate SEO-friendly meta title and description for your post.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="seoKeyword">Focus SEO Keyword</Label>
                  <Input
                    id="seoKeyword"
                    value={seoKeyword}
                    onChange={(e) => setSeoKeyword(e.target.value)}
                    placeholder="e.g., AI Content Generation"
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleOptimizeSeo} disabled={isLoading.seo || !draftedContent.trim() || !seoKeyword.trim()} className="w-full sm:w-auto">
                  {isLoading.seo && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Optimize SEO
                </Button>
                {metaTitle && (
                  <div className="mt-6 space-y-2">
                    <div>
                      <Label htmlFor="metaTitle">Meta Title</Label>
                      <Input id="metaTitle" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="mt-1 bg-secondary/30"/>
                    </div>
                    <div>
                      <Label htmlFor="metaDescription">Meta Description</Label>
                      <Textarea id="metaDescription" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} className="mt-1 bg-secondary/30"/>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 4: Review & Save */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CheckCircle className="text-accent"/> Step 4: Review and Save</CardTitle>
                <CardDescription>Review your generated blog post and save it.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">Title:</h3>
                  <p className="mt-1 p-3 bg-muted rounded-md">{blogTitle || 'Not set'}</p>
                </div>
                 <div>
                  <h3 className="text-lg font-semibold">Outline:</h3>
                  <p className="mt-1 p-3 bg-muted rounded-md whitespace-pre-line">{blogOutline || 'Not set'}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Content:</h3>
                  <div className="mt-1 p-3 bg-muted rounded-md max-h-96 overflow-y-auto whitespace-pre-line">
                    {draftedContent || 'Not drafted yet'}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Meta Title:</h3>
                  <p className="mt-1 p-3 bg-muted rounded-md">{metaTitle || 'Not generated'}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Meta Description:</h3>
                  <p className="mt-1 p-3 bg-muted rounded-md">{metaDescription || 'Not generated'}</p>
                </div>
                <Button onClick={handleSavePost} disabled={isLoading.save || !blogTitle || !draftedContent} className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                  {isLoading.save && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" /> Save Blog Post
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>

        <CardFooter className="flex justify-between mt-8">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          {currentStep < totalSteps ? (
            <Button onClick={nextStep} disabled={
              (currentStep === 1 && (generatedIdeas.length === 0 || selectedIdeaIndex === null)) || // Ensure idea is selected if ideas were generated
              (currentStep === 2 && !draftedContent) ||
              (currentStep === 3 && (!metaTitle || !metaDescription))
            }>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
             <Button onClick={() => router.push('/app/dashboard/blog')} variant="secondary">
              Finish & Go to My Posts
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default BlogWriterPage;
