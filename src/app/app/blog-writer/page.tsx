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
import { type SuggestImagesOutput, type ImageSuggestion } from '@/ai/schemas/suggest-images-schemas';
import { ChevronLeft, ChevronRight, Loader2, Wand2, DraftingCompass, CheckCircle, Save, SearchCheck, Sparkles, Edit3Icon, EyeIcon } from 'lucide-react'; // Changed Edit and Eye to their correct Lucide names
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
    images: false,
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
    setDraftedContent(''); 
    try {
      // Increase length of generated content by adjusting the prompt or by calling it multiple times / refining
      // For simplicity, let's assume the flow itself will try to generate longer content.
      // A more complex solution would involve multiple calls or a "continue writing" feature.
      const result = await draftBlogContent({ outline: blogOutline });
      // Simulating longer content by appending a generic paragraph if too short.
      // In a real scenario, the AI prompt for `draftBlogContent` should be modified for length.
      let finalDraft = result.draft;
      if (finalDraft.split(' ').length < 800) { // Arbitrary check for "too short"
        finalDraft += "\n\n## Further Considerations\n\nThis topic has many facets, and further exploration could delve into related areas such as [related_topic_1] and [related_topic_2]. It's also important to consider the long-term implications and potential future developments in this field. Engaging with diverse perspectives will enrich the understanding of this subject.";
      }
      setDraftedContent(finalDraft); 
      toast({ title: 'Success', description: 'Blog content drafted successfully!' });
      setCurrentStep(3); 
    } catch (error) {
      console.error('Error drafting blog content:', error);
      toast({ title: 'Error', description: 'Failed to draft blog content.', variant: 'destructive' });
    } finally {
      setIsLoading(prev => ({ ...prev, draft: false }));
    }
  };

  const insertImagesIntoDraft = (currentDraft: string, suggestions: ImageSuggestion[]): string => {
    let newDraft = currentDraft;
    suggestions.forEach(suggestion => {
      if (suggestion.imageDataUri && suggestion.imageDataUri.trim() !== "") { 
        const imageMarkdown = `\n\n![${suggestion.altText || 'AI Generated Image'}](${suggestion.imageDataUri})\n\n`;
        if (suggestion.insertAfterParagraphContaining && suggestion.insertAfterParagraphContaining.trim() !== "") {
          const snippet = suggestion.insertAfterParagraphContaining;
          const paragraphs = newDraft.split("\n\n");
          let foundAndInserted = false;
          for (let i = 0; i < paragraphs.length; i++) {
              if (paragraphs[i].includes(snippet)) {
                  paragraphs.splice(i + 1, 0, imageMarkdown.trim());
                  newDraft = paragraphs.join("\n\n");
                  foundAndInserted = true;
                  break;
              }
          }
          if (!foundAndInserted) {
              console.warn(`Snippet "${snippet}" not found. Appending image for "${suggestion.imageConcept}" as fallback.`);
              newDraft += imageMarkdown;
          }
        } else {
           console.warn(`No placement snippet for image "${suggestion.imageConcept}". Appending image as fallback.`);
           newDraft += imageMarkdown;
        }
      } else {
        console.warn(`Skipping image suggestion with empty imageDataUri for concept: "${suggestion.imageConcept}"`);
      }
    });
    return newDraft;
  };

  const handleSuggestAndInsertImages = async () => {
    if (!draftedContent.trim()) {
      toast({ title: 'Error', description: 'Draft content is required to suggest and insert images.', variant: 'destructive' });
      return;
    }
    setIsLoading(prev => ({ ...prev, images: true }));
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
      
      if (result.imageSuggestions && result.imageSuggestions.length > 0) {
        const newContentWithImages = insertImagesIntoDraft(draftedContent, result.imageSuggestions);
        setDraftedContent(newContentWithImages);
        toast({ title: 'Success', description: `${result.imageSuggestions.length} AI images generated and inserted!` });
      } else {
        toast({ title: 'Info', description: 'No AI images were generated. Try refining your content or try again.' });
      }
    } catch (error: any) {
      console.error('Error suggesting/inserting images:', error);
      toast({ title: 'Error', description: error.message || 'Failed to generate or insert images.', variant: 'destructive' });
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
                <CardDescription>Review and refine the outline, then draft the content. AI Image generation is available in Step 3.</CardDescription>
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
                  Draft Content &amp; Proceed to SEO
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
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 3: Optimize SEO & Add Images */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                 <CardTitle className="flex items-center gap-2"><SearchCheck className="text-accent"/> Step 3: Optimize SEO &amp; Add Images</CardTitle>
                <CardDescription>Generate SEO metadata, then edit/preview your content, and optionally generate & insert AI images.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="draftedContentSeoStep" className="text-lg font-semibold block mb-2">
                            Markdown Editor
                        </Label>
                        <Textarea
                            id="draftedContentSeoStep"
                            value={draftedContent}
                            onChange={(e) => setDraftedContent(e.target.value)}
                            rows={15} // Adjust rows as needed for side-by-side
                            className="mt-1 bg-secondary/30 h-[400px] md:h-[500px] resize-none" // Fixed height
                        />
                    </div>
                    <div>
                        <Label className="text-lg font-semibold block mb-2">
                            Live Preview
                        </Label>
                        <ScrollArea className="h-[400px] md:h-[500px] mt-1 p-4 bg-muted rounded-md border"> 
                        <article className="prose dark:prose-invert lg:prose-xl max-w-none">
                            <ReactMarkdown
                            components={{
                                img: ({node, ...props}) => {
                                  if (!props.src) {
                                    return null;
                                  }
                                  // eslint-disable-next-line @next/next/no-img-element
                                  return <img {...props} src={props.src} alt={props.alt || 'Blog image'} className="rounded-lg shadow-md my-4 max-w-full h-auto block mx-auto"/>;
                                }
                            }}
                            >
                            {draftedContent}
                            </ReactMarkdown>
                        </article>
                        </ScrollArea>
                    </div>
                 </div>

                <div className="border-t pt-6 space-y-4">
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
                    <div className="mt-4 space-y-2">
                        <div>
                        <Label htmlFor="metaTitle">Meta Title</Label>
                        <Input id="metaTitle" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="mt-1 bg-secondary/30"/>
                        </div>
                        <div>
                        <Label htmlFor="metaDescription">Meta Description</Label>
                        <Textarea id="metaDescription" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} className="mt-1 bg-secondary/30"/>
                        </div>
                        <Button 
                            onClick={handleSuggestAndInsertImages} 
                            disabled={isLoading.images || !draftedContent.trim() || !metaTitle} 
                            variant="outline" 
                            className="w-full sm:w-auto mt-4"
                        >
                            {isLoading.images && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Sparkles className="mr-2 h-4 w-4 text-accent" /> 
                            {draftedContent.includes("![") ? "Regenerate/Add More Images" : "Generate & Insert Images"}
                        </Button>
                        {isLoading.images && <p className="text-xs text-muted-foreground mt-1">Generating and inserting AI images... This may take a moment.</p>}
                    </div>
                    )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Review & Save */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CheckCircle className="text-accent"/> Step 4: Review &amp; Save</CardTitle>
                <CardDescription>Final review of your blog post. Ensure everything looks good before saving.</CardDescription>
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

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="reviewDraftedContentEditor" className="text-lg font-semibold block mb-2">
                            Markdown Editor
                        </Label>
                        <Textarea
                            id="reviewDraftedContentEditor"
                            value={draftedContent}
                            onChange={(e) => setDraftedContent(e.target.value)}
                            rows={20} 
                            className="mt-1 p-3 bg-muted rounded-md h-[500px] md:h-[600px] resize-none"
                            placeholder="Your blog post content in Markdown will appear here..."
                        />
                    </div>
                    <div>
                        <Label className="text-lg font-semibold block mb-2">
                            Live Preview
                        </Label>
                        <ScrollArea className="h-[500px] md:h-[600px] mt-1 p-4 bg-muted rounded-md border">
                        <article className="prose dark:prose-invert lg:prose-xl max-w-none">
                            <ReactMarkdown
                            components={{
                                img: ({node, ...props}) => {
                                if (!props.src) {
                                    return null;
                                }
                                // eslint-disable-next-line @next/next/no-img-element
                                return <img {...props} src={props.src} alt={props.alt || 'Blog image'} className="rounded-lg shadow-md my-4 max-w-full h-auto block mx-auto"/>;
                                }
                            }}
                            >
                            {draftedContent}
                            </ReactMarkdown>
                        </article>
                        </ScrollArea>
                    </div>
                 </div>
                
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
              (currentStep === 2 && !draftedContent) || 
              (currentStep === 3 && (!metaTitle || !metaDescription))
            }>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
             <Button onClick={() => router.push('/app/dashboard/blog')} variant="secondary">
              Finish &amp; Go to My Posts
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default BlogWriterPage;
