
"use client"

import React, { useRef } from "react" // Added React import
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, FileText, SearchCheck, Download, Lightbulb, Target, PenLine, CircleCheckBig, Zap, Clock, Search, ThumbsUp, TrendingUp, CalendarDays, Users, BarChart3 } from "lucide-react"
import Image from 'next/image';

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import LocalHeader from '@/components/layout/Header'; // Renamed to avoid conflict with global Header
import Footer from '@/components/layout/Footer';
import { cn } from "@/lib/utils";


export default function Home() {
  const heroRef = useRef(null);
  const problemSolutionRef = useRef(null);
  const howItWorksRef = useRef(null);
  const coreFeaturesRef = useRef(null);
  const targetAudienceRef = useRef(null);
  const ctaRef = useRef(null);


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      <motion.div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, hsl(var(--primary) / 0.1) 0%, hsl(var(--primary) / 0.05) 30%, transparent 70%)",
        }}
      />
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none -z-10" />

      <LocalHeader />
      <main className="flex-grow">
        <Hero ref={heroRef} />
        <ProblemSolutionSection ref={problemSolutionRef} />
        <HowItWorksSection ref={howItWorksRef} />
        <CoreFeaturesSection ref={coreFeaturesRef} />
        <TargetAudienceSection ref={targetAudienceRef} />
        <CallToAction ref={ctaRef} />
      </main>
      <Footer />
    </div>
  )
}

const Hero = React.forwardRef<HTMLElement>((props, ref) => {
  return (
    <section ref={ref} className="w-full py-20 md:py-32 bg-gradient-to-br from-background to-secondary/10 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          className="space-y-8 text-center md:text-left"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight">
            <span className="block text-primary leading-tight">Stop Staring at a Blank Page.</span>
            <span className="block text-foreground mt-2 leading-tight">
              Craft Blogs in Minutes with AI.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            BlogCraft AI: Your intelligent co-writer for lightning-fast, SEO-smart blog creation. Go from a simple keyword to a compelling draft, effortlessly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg !py-7 !text-lg transform hover:scale-105 transition-transform duration-200 group">
              <Link href="/signup">
                Start Your Free Trial <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="shadow-md border-primary/50 text-primary hover:bg-primary/10 hover:text-primary !py-7 !text-lg transform hover:scale-105 transition-transform duration-200 group">
              <Link href="#how-it-works">
                Learn How It Works <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </motion.div>
        <motion.div
          className="relative aspect-[16/10] rounded-xl shadow-2xl overflow-hidden group"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Image
            src="https://picsum.photos/seed/ai-writer-desk/1280/800"
            alt="AI helping a writer craft blog content on a modern interface"
            layout="fill"
            objectFit="cover"
            className="transform group-hover:scale-105 transition-transform duration-300 ease-in-out"
            priority
            data-ai-hint="modern writer interface"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-primary/10 to-transparent" />
          <div className="absolute bottom-6 left-6 bg-background/80 backdrop-blur-md p-4 rounded-lg shadow-xl">
            <p className="text-md font-semibold text-primary">AI-Powered Content Drafting</p>
            <p className="text-sm text-muted-foreground">Visualize your ideas taking shape instantly.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
});
Hero.displayName = "Hero";


const ProblemSolutionSection = React.forwardRef<HTMLElement>((props, ref) => {
  const problems = [
    { title: "Tired of writer's block?", icon: Zap, description: "The blank page can be intimidating, making it hard to start and stay creative.", delay: 0.2, imageSeed: "writer-block-frustration" },
    { title: "Struggling to find time?", icon: Clock, description: "Content creation is time-consuming, especially when juggling multiple responsibilities.", delay: 0.3, imageSeed: "busy-schedule-clock" },
    { title: "Overwhelmed by SEO basics?", icon: Search, description: "Getting started with SEO can feel complex, delaying your content's reach.", delay: 0.4, imageSeed: "seo-complexity-chart" },
  ];

  const solutions = [
    { title: "Saves Time", icon: Sparkles, description: "Cut down hours of research and writing.", delay: 0.2 },
    { title: "Sparks Creativity", icon: Lightbulb, description: "Overcome writer's block with fresh AI-generated ideas.", delay: 0.3 },
    { title: "Simplifies SEO", icon: TrendingUp, description: "Get foundational SEO suggestions without the headache.", delay: 0.4 },
    { title: "Boosts Productivity", icon: ThumbsUp, description: "Publish more high-quality content, more often.", delay: 0.5 },
  ]

  return (
    <>
      <section ref={ref} className="w-full py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold mb-6 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            Feeling Stuck with Content Creation?
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            You're not alone. Many writers and marketers face these common hurdles:
          </motion.p>
          <div className="grid md:grid-cols-3 gap-8">
            {problems.map((problem) => (
              <motion.div
                key={problem.title}
                className="group p-1 rounded-xl bg-gradient-to-br from-primary/20 via-accent/10 to-transparent hover:shadow-2xl transition-all duration-500"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: problem.delay }}
              >
                <Card className="h-full bg-card/90 backdrop-blur-lg border border-border/30 group-hover:border-primary/50 transition-colors duration-300 overflow-hidden rounded-lg">
                  <CardHeader className="items-center pt-8 pb-4">
                    <div className="p-4 bg-primary/10 rounded-full mb-4 inline-block shadow-md group-hover:scale-110 transition-transform duration-300">
                      <problem.icon className="w-12 h-12 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-foreground">{problem.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-8">
                    <p className="text-muted-foreground px-2">{problem.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24 bg-secondary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold mb-6 text-primary"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            Welcome to Effortless Blogging
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            BlogCraft AI is the solution. Imagine effortlessly generating compelling blog ideas, drafting content, and getting initial SEO guidance, all in one place.
          </motion.p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {solutions.map((solution) => (
              <motion.div
                key={solution.title}
                className="group"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: solution.delay }}
              >
                <Card className="h-full p-6 bg-card/90 backdrop-blur-lg rounded-xl shadow-lg flex flex-col items-center text-center border border-border/30 group-hover:border-accent/50 group-hover:shadow-accent/20 group-hover:shadow-xl transform group-hover:-translate-y-1.5 transition-all duration-300">
                  <div className="p-3 bg-accent/10 rounded-full mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <solution.icon className="w-8 h-8 text-accent" />
                  </div>
                  <CardTitle className="text-xl font-semibold mb-2 text-foreground group-hover:text-accent transition-colors duration-300">{solution.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{solution.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
});
ProblemSolutionSection.displayName = "ProblemSolutionSection";


const HowItWorksSection = React.forwardRef<HTMLElement>((props, ref) => {

  const steps = [
    { title: "1. Spark Ideas", icon: Sparkles, description: "Enter your keywords and get instant blog title & outline suggestions from our AI blog generator.", imageSeed: "step1-ideas", imageAlt: "Visual for 1. Spark Ideas", aiHint: "keyword input idea list", delay: 0.2 },
    { title: "2. Draft Instantly", icon: PenLine, description: "Select an idea, and let our AI writer draft your blog post in minutes.", imageSeed: "step2-draft", imageAlt: "Visual for 2. Draft Instantly", aiHint: "text editor AI draft", delay: 0.4 },
    { title: "3. Optimize Smartly", icon: SearchCheck, description: "Get AI-powered meta title and description suggestions for better SEO content.", imageSeed: "step3-seo", imageAlt: "Visual for 3. Optimize Smartly", aiHint: "SEO suggestions form", delay: 0.6 },
    { title: "4. Export & Go", icon: Download, description: "Download your content easily and get ready to publish on your platform.", imageSeed: "step4-export", imageAlt: "Visual for 4. Export & Go", aiHint: "export options dialog", delay: 0.8 },
  ];

  return (
    <section id="how-it-works" ref={ref} className="w-full py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-center mb-16 text-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          Create Stunning Blogs in 4 Simple Steps
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-primary/40 -translate-y-1/2" style={{ zIndex: -1 }} />
          
          {steps.map((step) => (
            <motion.div
              key={step.title}
              className="group relative z-10"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: step.delay }}
            >
              <Card className="flex flex-col h-full text-center shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 bg-card/80 backdrop-blur-lg border border-border/30 hover:border-primary/50 overflow-hidden rounded-xl">
                <div className="p-6 bg-gradient-to-br from-primary/10 to-accent/10">
                   <step.icon className="w-12 h-12 text-primary mx-auto group-hover:animate-pulse" />
                </div>
                <CardHeader className="pt-6">
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors duration-300">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col p-6 pt-0">
                  <p className="text-muted-foreground mb-6 flex-grow">{step.description}</p>
                  <div className="aspect-video bg-muted/50 rounded-lg overflow-hidden relative mt-auto shadow-inner">
                     <Image
                      src={`https://picsum.photos/seed/${step.imageSeed}/400/225`}
                      alt={step.imageAlt}
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint={step.aiHint}
                      className="transform group-hover:scale-110 transition-transform duration-500 ease-in-out"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300"></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});
HowItWorksSection.displayName = "HowItWorksSection";

const CoreFeaturesSection = React.forwardRef<HTMLElement>((props, ref) => {

  const features = [
    { title: "AI Idea Generation", icon: Lightbulb, description: "Never run out of topics. Enter a keyword and BlogCraft AI instantly provides engaging titles and structured outlines. Overcome writer's block and keep your content calendar full.", benefit: "Benefit: End writer's block, continuous topic supply.", delay: 0.15 },
    { title: "AI Content Drafting", icon: FileText, description: "Transform outlines into comprehensive first drafts in minutes. Our advanced AI writer crafts well-structured, coherent content, saving you hours of writing time.", benefit: "Benefit: Get solid first drafts fast, save writing hours.", delay: 0.3 },
    { title: "Basic SEO Suggestions", icon: SearchCheck, description: "Start your SEO right from the beginning. BlogCraft AI suggests optimized meta titles and descriptions to improve your content's discoverability on search engines.", benefit: "Benefit: Improve discoverability, simplify initial SEO.", delay: 0.45 },
    { title: "Simple Export", icon: Download, description: "Easily take your generated content wherever you need it. Download your drafts in common formats, ready for editing and publishing on your preferred platform.", benefit: "Benefit: Seamlessly integrate into your workflow.", delay: 0.6 },
  ];

  return (
    <section ref={ref} className="w-full py-16 md:py-24 bg-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-center mb-12 text-primary"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          Powerful Features to Elevate Your Content
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              className="group"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: feature.delay }}
            >
              <Card className="h-full shadow-lg hover:shadow-xl border border-border/30 hover:border-accent/50 transform hover:-translate-y-1.5 transition-all duration-300 rounded-xl bg-card/80 backdrop-blur-lg overflow-hidden">
                <CardHeader className="flex flex-row items-start gap-4 p-6 bg-gradient-to-r from-accent/5 to-transparent">
                  <div className="p-3 bg-accent/10 rounded-lg shadow-sm mt-1 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-foreground group-hover:text-accent transition-colors duration-300">{feature.title}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground pt-1">{feature.benefit}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-2">
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});
CoreFeaturesSection.displayName = "CoreFeaturesSection";


const TargetAudienceSection = React.forwardRef<HTMLElement>((props, ref) => {
  const audiences = [
    { name: "Busy Bloggers", delay: 0.2 },
    { name: "Agile Marketing Teams", delay: 0.3 },
    { name: "Freelance Content Creators", delay: 0.4 },
    { name: "Small & Medium Businesses", delay: 0.5 },
    { name: "Anyone new to SEO content", delay: 0.6 },
  ];

  return (
    <section ref={ref} className="w-full py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold mb-6 text-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          Perfect For...
        </motion.h2>
        <motion.p
          className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          BlogCraft AI is the ideal content creation tool for a diverse range of users looking to enhance their blogging efficiency and quality.
        </motion.p>
        <div className="flex flex-wrap justify-center gap-4">
          {audiences.map((audience) => (
            <motion.div
              key={audience.name}
              className="flex items-center gap-2 bg-card/80 backdrop-blur-md p-4 rounded-lg shadow-md border border-border/30 hover:border-primary/50 transform hover:scale-105 hover:shadow-lg transition-all duration-200"
              initial={{ opacity: 0, scale:0.9 }}
              whileInView={{ opacity: 1, scale:1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.4, delay: audience.delay }}
            >
              <CircleCheckBig className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground/90">{audience.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});
TargetAudienceSection.displayName = "TargetAudienceSection";

const CallToAction = React.forwardRef<HTMLElement>((props, ref) => {
  return (
    <section id="cta" ref={ref} className="w-full py-20 md:py-32 bg-gradient-to-br from-primary to-accent/80 text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          Ready to Revolutionize Your Blogging Workflow?
        </motion.h2>
        <motion.p
          className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Be among the first to experience the power of AI in content creation. Try BlogCraft MVP now and transform how you write.
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, scale:0.95 }}
          whileInView={{ opacity: 1, scale:1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button asChild size="lg" className="bg-background text-primary hover:bg-background/90 shadow-xl transform hover:scale-105 transition-transform duration-200 group">
            <Link href="/signup">
              Start Your Free Trial <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground shadow-lg transform hover:scale-105 transition-transform duration-200">
             <Link href="#how-it-works">
              Learn More
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
});
CallToAction.displayName = "CallToAction";
