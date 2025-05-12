import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Download, Edit3, FileText, Lightbulb, SearchCheck, Sparkles, Target, ThumbsUp, TrendingUp, Users, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center text-foreground overflow-x-hidden"> {/* Added overflow-x-hidden to prevent horizontal scrollbars from animations */}
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 bg-gradient-to-br from-background to-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-primary animate-in fade-in slide-in-from-left-8 duration-700 delay-100">
              Stop Staring at a Blank Page:
              <br />
              <span className="text-foreground">Generate Blog Posts in Minutes with AI</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground animate-in fade-in slide-in-from-left-8 duration-700 delay-200">
              BlogCraft AI: Your AI Co-writer for Faster, Smarter Blogging. Go from keyword to drafted post with SEO insights, effortlessly.
            </p>
            <p className="text-md text-foreground/80 animate-in fade-in slide-in-from-left-8 duration-700 delay-300">
              BlogCraft AI is an innovative, AI-powered assistant designed to revolutionize the initial stages of blog creation. It helps you overcome writer's block and efficiently generate drafted, SEO-friendly content, transforming your ideas into publishable material in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-in fade-in slide-in-from-left-8 duration-700 delay-400">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg transform hover:scale-105 transition-transform duration-200">
                <Link href="#cta">Start Creating Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="shadow-md border-primary/50 text-primary hover:bg-primary/10 hover:text-primary transform hover:scale-105 transition-transform duration-200">
                <Link href="#how-it-works">Learn How It Works</Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-video rounded-xl shadow-2xl overflow-hidden group animate-in zoom-in-95 duration-500 delay-300">
            <Image
              src="https://picsum.photos/seed/blogcraft-hero/1280/720"
              alt="BlogCraft AI interface screenshot showing AI writing assistance"
              layout="fill"
              objectFit="cover"
              className="transform group-hover:scale-105 transition-transform duration-300 ease-in-out"
              data-ai-hint="AI writing interface"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm p-3 rounded-lg shadow-md">
              <p className="text-sm font-semibold text-primary">AI-Powered Content Drafting</p>
              <p className="text-xs text-muted-foreground">Visualize your ideas taking shape.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Pain Section */}
      <section className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground animate-in fade-in slide-in-from-bottom-5 duration-500">Feeling Stuck with Content Creation?</h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-500 delay-100">
            You're not alone. Many writers and marketers face these common hurdles:
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Zap className="w-12 h-12 text-primary" />, title: "Tired of writer's block?", desc: "The blank page can be intimidating, making it hard to start and stay creative.", delay: 200 },
              { icon: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>, title: "Struggling to find time?", desc: "Content creation is time-consuming, especially when juggling multiple responsibilities.", delay: 300 },
              { icon: <Target className="w-12 h-12 text-primary" />, title: "Overwhelmed by SEO basics?", desc: "Getting started with SEO can feel complex, delaying your content's reach.", delay: 400 }
            ].map((problem) => (
              <Card key={problem.title} className={`shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 animate-in fade-in zoom-in-95 delay-${problem.delay}`}>
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {problem.icon}
                  </div>
                  <CardTitle className="text-2xl">{problem.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{problem.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution/Benefit Section */}
      <section className="w-full py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-primary animate-in fade-in slide-in-from-bottom-5 duration-500">Welcome to Effortless Blogging</h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-500 delay-100">
            BlogCraft AI is the solution. Imagine effortlessly generating compelling blog ideas, drafting content, and getting initial SEO guidance, all in one place.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Saves Time", desc: "Cut down hours of research and writing.", icon: <Sparkles className="w-8 h-8 text-accent" /> },
              { title: "Sparks Creativity", desc: "Overcome writer's block with fresh AI-generated ideas.", icon: <Lightbulb className="w-8 h-8 text-accent" /> },
              { title: "Simplifies SEO", desc: "Get foundational SEO suggestions without the headache.", icon: <TrendingUp className="w-8 h-8 text-accent" /> },
              { title: "Boosts Productivity", desc: "Publish more high-quality content, more often.", icon: <ThumbsUp className="w-8 h-8 text-accent" /> }
            ].map((benefit, index) => (
              <div key={benefit.title} className={`p-6 bg-card rounded-lg shadow-md flex flex-col items-center text-center transform hover:-translate-y-1 transition-all duration-300 animate-in fade-in zoom-in-95 delay-${(index + 2) * 100} duration-300`}>
                <div className="p-3 bg-accent/10 rounded-full mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-foreground animate-in fade-in slide-in-from-bottom-5 duration-500">
            Create Stunning Blogs in 4 Simple Steps
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Dashed line connecting steps - for larger screens */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-primary/50 -translate-y-1/2" style={{zIndex: -1}}></div>
            
            {[
              { 
                icon: <Sparkles className="w-10 h-10 text-primary mb-4" />, 
                title: "1. Spark Ideas", 
                desc: "Enter your keywords and get instant blog title & outline suggestions from our AI blog generator.",
                imgHint: "keyword input idea list"
              },
              { 
                icon: <Edit3 className="w-10 h-10 text-primary mb-4" />, 
                title: "2. Draft Instantly", 
                desc: "Select an idea, and let our AI writer draft your blog post in minutes.",
                imgHint: "text editor AI draft"
              },
              { 
                icon: <SearchCheck className="w-10 h-10 text-primary mb-4" />, 
                title: "3. Optimize Smartly", 
                desc: "Get AI-powered meta title and description suggestions for better SEO content.",
                imgHint: "SEO suggestions form"
              },
              { 
                icon: <Download className="w-10 h-10 text-primary mb-4" />, 
                title: "4. Export & Go", 
                desc: "Download your content easily and get ready to publish on your platform.",
                imgHint: "export options dialog"
              }
            ].map((step, index) => (
              <Card key={step.title} className={`text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group relative z-10 bg-card animate-in fade-in zoom-in-95 delay-${(index + 1) * 150} duration-300`}>
                <CardHeader className="items-center">
                  {step.icon}
                  <CardTitle className="text-2xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{step.desc}</p>
                  <div className="aspect-video bg-muted rounded-md overflow-hidden relative mt-4">
                    <Image 
                      src={`https://picsum.photos/seed/step${index+1}/400/225`} 
                      alt={`Visual for ${step.title}`}
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint={step.imgHint}
                      className="transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features & Benefits Section */}
      <section className="w-full py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-primary animate-in fade-in slide-in-from-bottom-5 duration-500">
            Powerful Features to Elevate Your Content
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { 
                icon: <Lightbulb className="w-8 h-8 text-accent" />, 
                title: "AI Idea Generation", 
                desc: "Never run out of topics. Enter a keyword and BlogCraft AI instantly provides engaging titles and structured outlines. Overcome writer's block and keep your content calendar full.",
                benefit: "Benefit: End writer's block, continuous topic supply."
              },
              { 
                icon: <FileText className="w-8 h-8 text-accent" />, 
                title: "AI Content Drafting", 
                desc: "Transform outlines into comprehensive first drafts in minutes. Our advanced AI writer crafts well-structured, coherent content, saving you hours of writing time.",
                benefit: "Benefit: Get solid first drafts fast, save writing hours."
              },
              { 
                icon: <SearchCheck className="w-8 h-8 text-accent" />, 
                title: "Basic SEO Suggestions", 
                desc: "Start your SEO right from the beginning. BlogCraft AI suggests optimized meta titles and descriptions to improve your content's discoverability on search engines.",
                benefit: "Benefit: Improve discoverability, simplify initial SEO."
              },
              { 
                icon: <Download className="w-8 h-8 text-accent" />, 
                title: "Simple Export", 
                desc: "Easily take your generated content wherever you need it. Download your drafts in common formats, ready for editing and publishing on your preferred platform.",
                benefit: "Benefit: Seamlessly integrate into your workflow."
              }
            ].map((feature, index) => (
               <Card key={feature.title} className={`shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 animate-in fade-in zoom-in-95 delay-${(index + 1) * 150} duration-300`}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-3 bg-accent/10 rounded-full">{feature.icon}</div>
                  <div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-sm">{feature.benefit}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Who Is BlogCraft For? Section */}
      <section className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground animate-in fade-in slide-in-from-bottom-5 duration-500">Perfect For...</h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-500 delay-100">
            BlogCraft AI is the ideal content creation tool for a diverse range of users looking to enhance their blogging efficiency and quality.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Busy Bloggers", "Agile Marketing Teams", "Freelance Content Creators", "Small & Medium Businesses", "Anyone new to SEO content"].map((target, index) => (
              <div key={target} className={`flex items-center gap-2 bg-card p-4 rounded-lg shadow-sm border border-border transform hover:scale-105 hover:shadow-md transition-all duration-200 animate-in fade-in zoom-in-90 delay-${(index + 2) * 100} duration-200`}>
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground/90">{target}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="cta" className="w-full py-20 md:py-32 bg-gradient-to-br from-primary to-accent/80 text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
            Ready to Revolutionize Your Blogging Workflow?
          </h2>
          <p className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-500 delay-100">
            Be among the first to experience the power of AI in content creation. Try BlogCraft MVP now and transform how you write.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in zoom-in-95 duration-300 delay-200">
            <Button asChild size="lg" className="bg-background text-primary hover:bg-background/90 shadow-xl transform hover:scale-105 transition-transform duration-200">
              <Link href="#">Try BlogCraft MVP Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground shadow-lg transform hover:scale-105 transition-transform duration-200">
              <Link href="#">Join Our Beta</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

