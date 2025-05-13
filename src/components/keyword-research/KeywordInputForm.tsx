
'use client';

import { useState, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search } from 'lucide-react';
import type { KeywordResearchRequest } from '@/types/keyword-research';

interface KeywordInputFormProps {
  onSubmit: (data: KeywordResearchRequest) => void;
  isLoading: boolean;
}

const countries = [
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'GL', label: 'Global (Default)' },
];

const languages = [
  { value: 'en', label: 'English (Default)' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
];

export function KeywordInputForm({ onSubmit, isLoading }: KeywordInputFormProps) {
  const [seedKeywords, setSeedKeywords] = useState('');
  const [targetCountry, setTargetCountry] = useState('GL');
  const [targetLanguage, setTargetLanguage] = useState('en');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const keywordsArray = seedKeywords.split(',').map(kw => kw.trim()).filter(kw => kw.length > 0);
    if (keywordsArray.length === 0) {
      // Basic validation, can be enhanced with toast
      alert('Please enter at least one seed keyword.');
      return;
    }
    onSubmit({
      seedKeywords: keywordsArray,
      targetCountry,
      targetLanguage,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-card rounded-lg shadow-md border">
      <div className="space-y-2">
        <Label htmlFor="seedKeywords" className="text-lg font-semibold">Seed Keyword(s)</Label>
        <p className="text-sm text-muted-foreground">Enter one or more keywords, separated by commas.</p>
        <Input
          id="seedKeywords"
          value={seedKeywords}
          onChange={(e) => setSeedKeywords(e.target.value)}
          placeholder="e.g., AI content creation, blog SEO"
          required
          className="text-base"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="targetCountry">Target Country</Label>
          <Select value={targetCountry} onValueChange={setTargetCountry}>
            <SelectTrigger id="targetCountry">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map(country => (
                <SelectItem key={country.value} value={country.value}>
                  {country.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetLanguage">Target Language</Label>
          <Select value={targetLanguage} onValueChange={setTargetLanguage}>
            <SelectTrigger id="targetLanguage">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map(lang => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" disabled={isLoading} size="lg" className="w-full sm:w-auto">
        {isLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Search className="mr-2 h-5 w-5" />
        )}
        Research Keywords
      </Button>
    </form>
  );
}
