'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { generateBlogIdeas, type GenerateBlogIdeasOutput } from '@/ai/flows/generate-blog-ideas';
import { draftBlogContent, type DraftBlogContentOutput } from '@/ai/flows/draft-blog-content';
import { optimizeSeo, type OptimizeSeoOutput } from '@/ai/flows/optimize-seo';
import { suggestImages, type SuggestImagesOutput, type ImageSuggestion } from '@/ai/flows/suggest-images-flow';
import { ChevronLeft, ChevronRight, Loader2, Wand2, DraftingCompass, CheckCircle, Save, SearchCheck, Eye, Edit, Image as ImageIcon, Sparkles } from 'lucide-react';
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

  const [imageSuggestions, setImageSuggestions] = useState<ImageSuggestion[]>([]);

  const [isLoading, setIsLoading] = useState({
    ideas: false,
    draft: false,
    seo: false,
    save: false,
    images: false,
  });

  const [showPreview, setShowPreview] = useState(false);

  const totalSteps = 4; // Can be adjusted if image suggestions becomes a full step
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
    setImageSuggestions([]); // Clear previous image suggestions
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

  const handleSuggestImages = async () => {
    if (!draftedContent.trim()) {
      toast({ title: 'Error', description: 'Draft content is required to suggest images.', variant: 'destructive' });
      return;
    }
    setIsLoading(prev => ({ ...prev, images: true }));
    setImageSuggestions([]);
    try {
      const response = await fetch('/api/suggest-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blogPostContent: draftedContent, mainTitle: blogTitle }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to suggest images.');
      }
      const result: SuggestImagesOutput = await response.json();
      setImageSuggestions(result.imageSuggestions || []);
      if (result.imageSuggestions && result.imageSuggestions.length > 0) {
        toast({ title: 'Success', description: `${result.imageSuggestions.length} image suggestions generated!` });
      } else {
        toast({ title: 'Info', description: 'No specific image suggestions were generated. Try refining your content.' });
      }
    } catch (error: any) {
      console.error('Error suggesting images:', error);
      toast({ title: 'Error', description: error.message || 'Failed to suggest images.', variant: 'destructive' });
    } finally {
      setIsLoading(prev => ({ ...prev, images: false }));
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
      setShowPreview(true); // Default to preview mode in step 4
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
      // Allow proceeding from step 2 even without drafted content IF they want to go to image suggestions or SEO later.
      // Forcing draft for SEO is better, but image suggestions can be standalone.
      // The "Draft Content" button will transition to step 3 (SEO).
      // The "Optimize SEO" button will transition to step 4 (Review).
      // This logic might need refinement depending on if Image Suggestion is a distinct step.
      // For now, nextStep just moves forward. Buttons like "Draft Content" or "Optimize SEO" also move steps.
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
                    <ScrollArea className="h-[400px] pr-4">
                      {generatedIdeas.map((idea, index) => (
                        <Card 
                          key={index} 
                          className={`cursor-pointer hover:shadow-md transition-shadow mb-4 ${selectedIdeaIndex === index ? 'border-primary ring-2 ring-primary' : ''}`}
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
                    </ScrollArea>
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
                <CardDescription>Review and refine the AI-generated outline, then draft the content. You can also get image suggestions for your draft.</CardDescription>
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
                  Draft Content & Proceed to SEO
                </Button>
                
                {draftedContent && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <Label htmlFor="draftedContent">Drafted Content (Markdown)</Label>
                      <Textarea
                        id="draftedContent"
                        value={draftedContent}
                        onChange={(e) => setDraftedContent(e.target.value)}
                        rows={15}
                        className="mt-1 bg-secondary/30"
                      />
                    </div>
                    <Button onClick={handleSuggestImages} disabled={isLoading.images || !draftedContent.trim()} variant="outline" className="w-full sm:w-auto">
                      {isLoading.images && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <ImageIcon className="mr-2 h-4 w-4" /> Suggest Images
                    </Button>
                    {isLoading.images && <p className="text-sm text-muted-foreground">Generating image suggestions...</p>}
                    {imageSuggestions.length > 0 && (
                      <div className="mt-4 space-y-4">
                        <h4 className="text-md font-semibold">Image Suggestions:</h4>
                        <ScrollArea className="h-[300px] pr-3">
                        {imageSuggestions.map((suggestion, idx) => (
                          <Card key={idx} className="mb-3 bg-muted/50">
                            <CardHeader className="pb-2 pt-4">
                              {suggestion.sectionContext && <p className="text-xs text-muted-foreground mb-1">For: {suggestion.sectionContext}</p>}
                              <CardTitle className="text-sm font-medium">{suggestion.imageConcept}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs pb-3">
                              <p className="mb-1"><strong>Search Keywords:</strong> {suggestion.searchKeywords.map((kw, kIdx) => (
                                <a 
                                  key={kIdx}
                                  href={`https://unsplash.com/s/photos/${encodeURIComponent(kw)}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-block bg-accent text-accent-foreground px-1.5 py-0.5 rounded-sm mr-1 mb-1 hover:bg-accent/80 transition-colors"
                                >
                                  {kw}
                                </a>
                              ))}</p>
                              {suggestion.placementHint && <p><strong>Placement:</strong> {suggestion.placementHint}</p>}
                            </CardContent>
                          </Card>
                        ))}
                        </ScrollArea>
                      </div>
                    )}
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
                  Optimize SEO & Proceed to Review
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
                {draftedContent && imageSuggestions.length === 0 && !isLoading.images && (
                   <Button onClick={handleSuggestImages} disabled={isLoading.images} variant="outline" className="w-full sm:w-auto mt-4">
                      {isLoading.images && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                       <ImageIcon className="mr-2 h-4 w-4" /> Get Image Suggestions
                    </Button>
                )}
                 {isLoading.images && <p className="text-sm text-muted-foreground mt-2">Generating image suggestions...</p>}
                 {imageSuggestions.length > 0 && (
                      <div className="mt-4 space-y-4">
                        <h4 className="text-md font-semibold">Image Suggestions:</h4>
                         <ScrollArea className="h-[300px] pr-3">
                        {imageSuggestions.map((suggestion, idx) => (
                          <Card key={idx} className="mb-3 bg-muted/50">
                            <CardHeader className="pb-2 pt-4">
                               {suggestion.sectionContext && <p className="text-xs text-muted-foreground mb-1">For: {suggestion.sectionContext}</p>}
                              <CardTitle className="text-sm font-medium">{suggestion.imageConcept}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs pb-3">
                              <p className="mb-1"><strong>Search Keywords:</strong> {suggestion.searchKeywords.map((kw, kIdx) => (
                                <a 
                                  key={kIdx}
                                  href={`https://unsplash.com/s/photos/${encodeURIComponent(kw)}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-block bg-accent text-accent-foreground px-1.5 py-0.5 rounded-sm mr-1 mb-1 hover:bg-accent/80 transition-colors"
                                >
                                  {kw}
                                </a>
                              ))}</p>
                              {suggestion.placementHint && <p><strong>Placement:</strong> {suggestion.placementHint}</p>}
                            </CardContent>
                          </Card>
                        ))}
                        </ScrollArea>
                      </div>
                    )}
              </CardContent>
            </Card>
          )}

          {/* Step 4: Review & Save */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2"><CheckCircle className="text-accent"/> Step 4: Review and Save</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
                    {showPreview ? <Edit className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                    {showPreview ? 'Edit Markdown' : 'Preview Content'}
                  </Button>
                </div>
                <CardDescription>Review your generated blog post and save it. {showPreview ? "Previewing content." : "You can make final edits to the Markdown content below."}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="reviewBlogTitle" className="text-lg font-semibold">Title:</Label>
                  <Input 
                    id="reviewBlogTitle" 
                    value={blogTitle} 
                    onChange={(e) => setBlogTitle(e.target.value)}
                    className="mt-1 p-3 bg-muted rounded-md text-lg font-semibold"
                  />
                </div>
                 <div>
                  <Label htmlFor="reviewBlogOutline" className="text-lg font-semibold">Outline:</Label>
                  <Textarea
                    id="reviewBlogOutline"
                    value={blogOutline}
                    onChange={(e) => setBlogOutline(e.target.value)}
                    rows={6}
                    className="mt-1 p-3 bg-muted rounded-md"
                  />
                </div>
                <div>
                  <Label htmlFor="reviewDraftedContent" className="text-lg font-semibold">Content:</Label>
                  {showPreview ? (
                    <ScrollArea className="h-[500px] mt-1 p-3 bg-muted rounded-md border">
                      <article className="prose dark:prose-invert lg:prose-xl max-w-none">
                        <ReactMarkdown>{draftedContent}</ReactMarkdown>
                      </article>
                    </ScrollArea>
                  ) : (
                    <Textarea
                      id="reviewDraftedContent"
                      value={draftedContent}
                      onChange={(e) => setDraftedContent(e.target.value)}
                      rows={20}
                      className="mt-1 p-3 bg-muted rounded-md"
                      placeholder="Your blog post content in Markdown will appear here..."
                    />
                  )}
                </div>
                 {imageSuggestions.length > 0 && (
                    <div className="mt-4 space-y-4">
                        <h4 className="text-md font-semibold flex items-center gap-2"><ImageIcon className="text-accent" /> Image Suggestions:</h4>
                         <ScrollArea className="h-[300px] pr-3">
                        {imageSuggestions.map((suggestion, idx) => (
                          <Card key={idx} className="mb-3 bg-muted/50 border-border">
                            <CardHeader className="pb-2 pt-4">
                               {suggestion.sectionContext && <p className="text-xs text-muted-foreground mb-1">For: {suggestion.sectionContext}</p>}
                              <CardTitle className="text-sm font-medium">{suggestion.imageConcept}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs pb-3">
                              <p className="mb-1"><strong>Search Keywords:</strong> {suggestion.searchKeywords.map((kw, kIdx) => (
                                <a 
                                  key={kIdx}
                                  href={`https://unsplash.com/s/photos/${encodeURIComponent(kw.replace(/\s+/g, '-'))}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-block bg-accent text-accent-foreground px-1.5 py-0.5 rounded-sm mr-1 mb-1 hover:bg-accent/80 transition-colors"
                                >
                                  {kw}
                                </a>
                              ))}</p>
                              {suggestion.placementHint && <p><strong>Placement:</strong> {suggestion.placementHint}</p>}
                            </CardContent>
                          </Card>
                        ))}
                        </ScrollArea>
                    </div>
                )}
                {draftedContent && imageSuggestions.length === 0 && !isLoading.images && (
                   <Button onClick={handleSuggestImages} disabled={isLoading.images} variant="outline" size="sm" className="mt-2">
                      {isLoading.images && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                       <Sparkles className="mr-2 h-4 w-4 text-accent" /> Get Fresh Image Ideas
                    </Button>
                )}
                <div>
                  <Label htmlFor="reviewMetaTitle" className="text-lg font-semibold">Meta Title:</Label>
                  <Input
                    id="reviewMetaTitle"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="mt-1 p-3 bg-muted rounded-md"
                  />
                </div>
                <div>
                  <Label htmlFor="reviewMetaDescription" className="text-lg font-semibold">Meta Description:</Label>
                  <Textarea
                    id="reviewMetaDescription"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    rows={3}
                    className="mt-1 p-3 bg-muted rounded-md"
                  />
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
              (currentStep === 1 && (generatedIdeas.length === 0 || selectedIdeaIndex === null)) || 
              (currentStep === 2 && !draftedContent && !metaTitle && !metaDescription) || // Allow next from step 2 if content is drafted, OR if SEO is done (meaning draft must have happened)
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
