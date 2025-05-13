
'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, Lightbulb, CheckSquare, Send } from 'lucide-react';
import type { KeywordResearchRequest, KeywordResearchResponse, KeywordMetric, TopicCluster } from '@/types/keyword-research';
import { KeywordInputForm } from '@/components/keyword-research/KeywordInputForm';
import { KeywordResultsDisplay } from '@/components/keyword-research/KeywordResultsDisplay';

const KeywordResearchPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [keywordData, setKeywordData] = useState<KeywordResearchResponse | null>(null);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  const handleResearch = async (requestData: KeywordResearchRequest) => {
    setIsLoading(true);
    setKeywordData(null); // Clear previous results
    setSelectedKeywords([]); // Clear selected keywords
    try {
      const response = await fetch('/api/keyword-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch keyword data');
      }

      const data: KeywordResearchResponse = await response.json();
      setKeywordData(data);
      if (data.error) {
         toast({ title: 'API Info', description: data.error, variant: 'default' });
      } else {
        toast({ title: 'Success', description: 'Keyword research completed.' });
      }
    } catch (error: any) {
      console.error('Error fetching keyword data:', error);
      toast({ title: 'Error', description: error.message || 'An unexpected error occurred.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeywordSelect = (keyword: string, isSelected: boolean) => {
    setSelectedKeywords(prev => 
      isSelected ? [...prev, keyword] : prev.filter(k => k !== keyword)
    );
  };

  const handleClusterSelect = (cluster: TopicCluster, isSelected: boolean) => {
    setSelectedKeywords(prev => {
      const keywordsWithoutCluster = prev.filter(k => !cluster.keywords.includes(k));
      return isSelected ? [...keywordsWithoutCluster, ...cluster.keywords] : keywordsWithoutCluster;
    });
  };
  
  const handleUseKeywordsForIdeas = () => {
    if (selectedKeywords.length === 0) {
      toast({ title: 'No Keywords Selected', description: 'Please select some keywords or a topic cluster to proceed.', variant: 'destructive'});
      return;
    }
    const keywordsQueryParam = encodeURIComponent(selectedKeywords.join(','));
    router.push(`/app/blog-writer?keywords=${keywordsQueryParam}`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-xl animate-in fade-in-0 duration-500">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary flex items-center gap-2">
            <Search className="w-8 h-8" /> Keyword Research Studio
          </CardTitle>
          <CardDescription>
            Uncover valuable keywords, analyze search intent, and discover topic clusters to supercharge your content strategy.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <KeywordInputForm onSubmit={handleResearch} isLoading={isLoading} />
          
          {isLoading && (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="mr-2 h-10 w-10 animate-spin text-primary" />
              <p className="text-lg text-muted-foreground">Researching keywords...</p>
            </div>
          )}

          {keywordData && !keywordData.error && (
            <KeywordResultsDisplay 
              data={keywordData} 
              selectedKeywords={selectedKeywords}
              onKeywordSelect={handleKeywordSelect}
              onClusterSelect={handleClusterSelect}
            />
          )}
          {keywordData?.error && !isLoading && (
             <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">Research Note</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{keywordData.error}</p>
                </CardContent>
             </Card>
          )}
        </CardContent>
        <CardFooter className="mt-8">
            {keywordData && !keywordData.error && (
                 <Button 
                    onClick={handleUseKeywordsForIdeas} 
                    disabled={selectedKeywords.length === 0 || isLoading}
                    size="lg"
                    className="w-full sm:w-auto"
                >
                    <Send className="mr-2 h-5 w-5" /> Use Selected ({selectedKeywords.length}) Keywords for Ideas
                </Button>
            )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default KeywordResearchPage;
