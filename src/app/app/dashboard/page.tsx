
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lightbulb, FileText, SearchCheck, Home, FileSignature, ListChecks, FilePlus, SearchIcon, NotebookPen } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          BlogCraft AI Dashboard
        </h1>
        <p className="mt-3 text-lg text-muted-foreground sm:mt-4">
          Welcome! Let's create some amazing blog content.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden group">
          <CardHeader className="bg-gradient-to-br from-primary/10 to-accent/10 p-6">
            <div className="flex items-center gap-4">
              <NotebookPen className="w-10 h-10 text-primary" />
              <CardTitle className="text-2xl group-hover:text-primary transition-colors">Keyword Research</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-6">
              Discover trending keywords, analyze search intent, and find topic clusters to fuel your content strategy.
            </p>
            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/app/keyword-research">
                <SearchIcon className="mr-2 h-5 w-5" /> Start Researching
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden group">
          <CardHeader className="bg-gradient-to-br from-primary/10 to-accent/10 p-6">
            <div className="flex items-center gap-4">
              <FileSignature className="w-10 h-10 text-primary" />
              <CardTitle className="text-2xl group-hover:text-primary transition-colors">Blog Writer Studio</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-6">
              A guided workflow to generate blog ideas, draft content, and optimize SEO all in one place.
            </p>
            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/app/blog-writer">
                <FilePlus className="mr-2 h-5 w-5" /> Create New Blog Post
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden group">
          <CardHeader className="bg-gradient-to-br from-primary/10 to-accent/10 p-6">
            <div className="flex items-center gap-4">
              <ListChecks className="w-10 h-10 text-primary" />
              <CardTitle className="text-2xl group-hover:text-primary transition-colors">Manage Blog Posts</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-6">
              View, edit, or delete your existing blog posts. Keep your content organized and up-to-date.
            </p>
            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/app/dashboard/blog">
                <ListChecks className="mr-2 h-5 w-5" /> View My Posts
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden group opacity-50 cursor-not-allowed">
          <CardHeader className="bg-gradient-to-br from-primary/10 to-accent/10 p-6">
            <div className="flex items-center gap-4">
              <Lightbulb className="w-10 h-10 text-primary" />
              <CardTitle className="text-2xl">Generate Blog Ideas</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-6">
              (Quick Access) Kickstart your writing process. Discover engaging blog post titles and structured outlines.
            </p>
            <Button disabled className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Lightbulb className="mr-2 h-5 w-5" /> Generate Ideas
            </Button>
             <p className="text-xs text-muted-foreground mt-2">Use Blog Writer Studio for full workflow.</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden group opacity-50 cursor-not-allowed">
          <CardHeader className="bg-gradient-to-br from-primary/10 to-accent/10 p-6">
            <div className="flex items-center gap-4">
                <FileText className="w-10 h-10 text-primary" />
                <CardTitle className="text-2xl">Draft Blog Content</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-6">
              (Quick Access) Transform your chosen outline into a well-structured first draft.
            </p>
            <Button disabled className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <FileText className="mr-2 h-5 w-5" /> Draft Content
            </Button>
            <p className="text-xs text-muted-foreground mt-2">Use Blog Writer Studio for full workflow.</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden group opacity-50 cursor-not-allowed">
          <CardHeader className="bg-gradient-to-br from-primary/10 to-accent/10 p-6">
             <div className="flex items-center gap-4">
                <SearchCheck className="w-10 h-10 text-primary" />
                <CardTitle className="text-2xl">Optimize SEO</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-6">
             (Quick Access) Enhance your blog's visibility. Get AI-driven suggestions for meta titles and descriptions.
            </p>
            <Button disabled className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
               <SearchCheck className="mr-2 h-5 w-5" /> Optimize SEO
            </Button>
            <p className="text-xs text-muted-foreground mt-2">Use Blog Writer Studio for full workflow.</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-16 text-center">
        <Button variant="outline" asChild size="lg" className="border-primary text-primary hover:bg-primary/10">
          <Link href="/">
            <Home className="mr-2 h-5 w-5" /> Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
