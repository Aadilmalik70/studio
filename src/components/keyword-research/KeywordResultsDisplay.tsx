
'use client';

import type { ChangeEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from 'lucide-react';
import type { KeywordResearchResponse, KeywordMetric, TopicCluster } from '@/types/keyword-research';

interface KeywordResultsDisplayProps {
  data: KeywordResearchResponse;
  selectedKeywords: string[];
  onKeywordSelect: (keyword: string, isSelected: boolean) => void;
  onClusterSelect: (cluster: TopicCluster, isSelected: boolean) => void;
}

const intentColorMap: Record<string, string> = {
  Informational: 'bg-blue-500',
  Navigational: 'bg-green-500',
  Commercial: 'bg-yellow-500 text-black',
  Transactional: 'bg-red-500',
  Unknown: 'bg-gray-400',
};


const KeywordTable = ({ 
    title, 
    keywords,
    selectedKeywords,
    onKeywordSelect,
    showIntent = true,
 } : { 
    title: string, 
    keywords: KeywordMetric[], 
    selectedKeywords: string[],
    onKeywordSelect: (keyword: string, isSelected: boolean) => void,
    showIntent?: boolean,
}) => {
  if (!keywords || keywords.length === 0) {
    return <p className="text-muted-foreground">No {title.toLowerCase()} found.</p>;
  }
  return (
    <Card>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="w-[50px]">Select</TableHead>
                    <TableHead>Keyword</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>CPC</TableHead>
                    {showIntent && <TableHead>Intent</TableHead>}
                </TableRow>
                </TableHeader>
                <TableBody>
                {keywords.map((kw) => (
                    <TableRow key={kw.keyword}>
                    <TableCell>
                        <Checkbox
                            checked={selectedKeywords.includes(kw.keyword)}
                            onCheckedChange={(checked) => onKeywordSelect(kw.keyword, !!checked)}
                        />
                    </TableCell>
                    <TableCell className="font-medium">{kw.keyword}</TableCell>
                    <TableCell>{kw.volume}</TableCell>
                    <TableCell>{kw.difficulty}</TableCell>
                    <TableCell>{kw.cpc}</TableCell>
                    {showIntent && kw.intent && (
                         <TableCell>
                            <Badge className={`${intentColorMap[kw.intent] || intentColorMap.Unknown} text-white`}>
                                {kw.intent}
                            </Badge>
                        </TableCell>
                    )}
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
};

export function KeywordResultsDisplay({ data, selectedKeywords, onKeywordSelect, onClusterSelect }: KeywordResultsDisplayProps) {
  return (
    <div className="space-y-8 mt-8 animate-in fade-in-0 duration-500">
      <Tabs defaultValue="seed">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6">
          <TabsTrigger value="seed">Seed Keywords ({data.seedKeywordMetrics?.length || 0})</TabsTrigger>
          <TabsTrigger value="related">Related ({data.relatedKeywords?.length || 0})</TabsTrigger>
          <TabsTrigger value="questions">Questions ({data.questionKeywords?.length || 0})</TabsTrigger>
          <TabsTrigger value="longtail">Long-Tail ({data.longTailKeywords?.length || 0})</TabsTrigger>
          <TabsTrigger value="clusters">Topic Clusters ({data.topicClusters?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="seed">
          <KeywordTable title="Seed Keyword Metrics" keywords={data.seedKeywordMetrics || []} selectedKeywords={selectedKeywords} onKeywordSelect={onKeywordSelect} />
        </TabsContent>
        <TabsContent value="related">
          <KeywordTable title="Related Keywords" keywords={data.relatedKeywords || []} selectedKeywords={selectedKeywords} onKeywordSelect={onKeywordSelect} />
        </TabsContent>
        <TabsContent value="questions">
          <KeywordTable title="Question Keywords" keywords={data.questionKeywords || []} selectedKeywords={selectedKeywords} onKeywordSelect={onKeywordSelect} />
        </TabsContent>
        <TabsContent value="longtail">
          <KeywordTable title="Long-Tail Keywords" keywords={data.longTailKeywords || []} selectedKeywords={selectedKeywords} onKeywordSelect={onKeywordSelect} />
        </TabsContent>
        <TabsContent value="clusters">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Topic Clusters
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>AI-generated topic clusters based on all fetched keywords.</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
              </CardTitle>
              <CardDescription>Select entire clusters to focus your content strategy.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(data.topicClusters || []).length === 0 && <p className="text-muted-foreground">No topic clusters generated.</p>}
              {data.topicClusters?.map((cluster) => {
                const isClusterSelected = cluster.keywords.every(kw => selectedKeywords.includes(kw));
                return (
                    <Card key={cluster.clusterName} className="bg-secondary/30">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg">{cluster.clusterName}</CardTitle>
                        <div className="flex items-center space-x-2">
                            <Label htmlFor={`cluster-${cluster.clusterName}`} className="text-sm">Select all ({cluster.keywords.length})</Label>
                            <Checkbox
                                id={`cluster-${cluster.clusterName}`}
                                checked={isClusterSelected}
                                onCheckedChange={(checked) => onClusterSelect(cluster, !!checked)}
                            />
                        </div>
                        </CardHeader>
                        <CardContent>
                        <ul className="list-disc list-inside pl-2 space-y-1">
                            {cluster.keywords.map(kw => (
                            <li key={kw} className="text-sm text-muted-foreground">{kw}</li>
                            ))}
                        </ul>
                        </CardContent>
                    </Card>
                );
                })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
