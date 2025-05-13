"use client"

import type React from "react"

import { useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { ArrowRight, Check, Sparkles, FileText, Search, Zap, Download, Brain, Clock, Lightbulb } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function Home() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  return (
    <div ref={ref} className="relative min-h-screen bg-white text-gray-900 overflow-hidden">
      {/* Background gradient effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(124, 58, 237, 0.1) 0%, rgba(124, 58, 237, 0.05) 50%, transparent 100%)",
          y: backgroundY,
        }}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.png')] bg-repeat opacity-5 pointer-events-none" />

      <Header />
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <FeaturesSection />
      <TargetAudienceSection />
      <TestimonialsSection />
      <PricingSection />
      <CallToAction />
      <Footer />
    </div>
  )
}

function Header() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-opacity-50 backdrop-blur-md bg-white/80"
    >
      <div className="flex items-center">
        <motion.div
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.5 }}
          className="w-8 h-8 mr-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center"
        >
          <Sparkles className="h-4 w-4 text-white" />
        </motion.div>
        <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-purple-600">
          BlogCraft AI
        </span>
      </div>

      <nav className="hidden md:flex items-center space-x-8">
        <NavLink href="#features">Features</NavLink>
        <NavLink href="#how-it-works">How It Works</NavLink>
        <NavLink href="#pricing">Pricing</NavLink>
        <NavLink href="#testimonials">Testimonials</NavLink>
      </nav>

      <div className="flex items-center space-x-4">
        <Link href={'/login'}>
          <Button variant="ghost" size="sm" className="text-gray-700">
            Sign in
          </Button>
        </Link>
        <Link href={'/signup'}>
          <Button
            size="sm"
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
          >
            Try for free
          </Button>
        </Link>
      </div>
    </motion.header>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm text-gray-700 hover:text-violet-700 transition-colors">
      {children}
    </Link>
  )
}

function Hero() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })

  return (
    <section ref={ref} className="relative pt-32 pb-20 px-6 flex flex-col items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-0 left-0 right-0 h-full max-h-[500px] bg-gradient-to-b from-violet-50 to-transparent pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center mb-4 text-violet-600 font-medium"
      >
        AI-Powered Content Creation
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-4xl md:text-6xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-700 to-purple-600"
      >
        Transform Ideas into Engaging Blog Content
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 40 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="text-lg text-center text-gray-600 max-w-2xl mb-10"
      >
        Generate SEO-optimized blog posts in minutes, not hours. Your AI co-writer for faster, smarter blogging.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 mb-20"
      >
        <Link href={'/app/dashboard'}>
          <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-6 text-lg">
            Start Creating
          </Button>
        </Link>
        <Button variant="outline" className="border-violet-300 text-violet-700 hover:bg-violet-50 px-8 py-6 text-lg">
          Watch Demo <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.9 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="relative w-full max-w-5xl rounded-xl overflow-hidden shadow-2xl"
      >
        <div className="bg-white p-4 border-b border-gray-200">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
        </div>

        <div className="bg-gray-50 p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <motion.div
              className="flex-1 bg-white rounded-lg shadow-md p-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -20 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <h3 className="font-medium text-violet-700 mb-2">Topic Generator</h3>
              <div className="space-y-2">
                <div className="h-8 bg-gray-100 rounded-md w-full"></div>
                <div className="space-y-1">
                  <div className="h-6 bg-violet-100 rounded-md w-full"></div>
                  <div className="h-6 bg-violet-100 rounded-md w-full"></div>
                  <div className="h-6 bg-violet-100 rounded-md w-3/4"></div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="flex-[2] bg-white rounded-lg shadow-md p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <h3 className="font-medium text-violet-700 mb-2">Content Draft</h3>
              <div className="space-y-2">
                <div className="h-8 bg-gray-100 rounded-md w-3/4"></div>
                <div className="space-y-1">
                  <div className="h-4 bg-gray-100 rounded-md w-full"></div>
                  <div className="h-4 bg-gray-100 rounded-md w-full"></div>
                  <div className="h-4 bg-gray-100 rounded-md w-5/6"></div>
                </div>
                <div className="h-4 bg-gray-100 rounded-md w-full"></div>
                <div className="space-y-1">
                  <div className="h-4 bg-gray-100 rounded-md w-full"></div>
                  <div className="h-4 bg-gray-100 rounded-md w-full"></div>
                  <div className="h-4 bg-gray-100 rounded-md w-4/5"></div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="flex-1 bg-white rounded-lg shadow-md p-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <h3 className="font-medium text-violet-700 mb-2">SEO Insights</h3>
              <div className="space-y-3">
                <div className="h-6 bg-green-100 rounded-md w-full"></div>
                <div className="h-6 bg-yellow-100 rounded-md w-full"></div>
                <div className="h-6 bg-green-100 rounded-md w-full"></div>
                <div className="h-6 bg-red-100 rounded-md w-full"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

function ProblemSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })

  const problems = [
    {
      title: "Creative Burnout",
      description: "Constantly coming up with fresh blog ideas is exhausting and time-consuming.",
      icon: Brain,
    },
    {
      title: "Time Constraints",
      description: "Creating quality content takes hours that busy professionals simply don't have.",
      icon: Clock,
    },
    {
      title: "SEO Complexity",
      description: "Understanding and implementing SEO best practices requires specialized knowledge.",
      icon: Search,
    },
  ]

  return (
    <section ref={ref} className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-6"
        >
          Struggling with Content Creation?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-16"
        >
          You're not alone. Content creators face these common challenges every day.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-xl p-8 shadow-md"
            >
              <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center mb-6">
                <problem.icon className="h-6 w-6 text-violet-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{problem.title}</h3>
              <p className="text-gray-600">{problem.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SolutionSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })

  const benefits = [
    {
      title: "Save Hours of Work",
      description: "Generate complete blog drafts in minutes instead of hours.",
      icon: Clock,
    },
    {
      title: "Never Run Out of Ideas",
      description: "Get AI-powered topic suggestions based on your keywords and industry.",
      icon: Lightbulb,
    },
    {
      title: "Boost Your SEO",
      description: "Receive built-in SEO recommendations to improve your content's visibility.",
      icon: Search,
    },
    {
      title: "Accelerate Publishing",
      description: "Publish more frequently with less effort to grow your audience faster.",
      icon: Zap,
    },
  ]

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-6"
        >
          Introducing BlogCraft AI
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-16"
        >
          Your AI-powered co-writer that transforms how you create blog content.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : index % 2 === 0 ? -30 : 30 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="flex items-start"
            >
              <div className="w-12 h-12 rounded-full bg-violet-100 flex-shrink-0 flex items-center justify-center mr-4">
                <benefit.icon className="h-6 w-6 text-violet-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 40 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-6 text-lg">
            Experience the Difference
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })

  const steps = [
    {
      number: "01",
      title: "Enter Your Topic",
      description: "Start with a keyword or topic idea. Our AI will suggest engaging blog titles and outlines.",
      icon: Lightbulb,
    },
    {
      number: "02",
      title: "Generate Content",
      description: "Select your preferred outline and let our AI craft a comprehensive first draft.",
      icon: FileText,
    },
    {
      number: "03",
      title: "Optimize for SEO",
      description: "Receive SEO recommendations to improve your content's search visibility.",
      icon: Search,
    },
    {
      number: "04",
      title: "Export & Publish",
      description: "Download your content in your preferred format and publish it on your platform.",
      icon: Download,
    },
  ]

  return (
    <section id="how-it-works" ref={ref} className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-6"
        >
          How It Works
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-16"
        >
          Create stunning blog content in just four simple steps.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-xl p-8 shadow-md relative"
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center text-white font-bold">
                {step.number}
              </div>
              <div className="mb-6 pt-4">
                <step.icon className="h-10 w-10 text-violet-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.9 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-20 relative rounded-xl overflow-hidden shadow-xl"
        >
          <div className="bg-white p-4 border-b border-gray-200">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
          </div>

          <div className="bg-gray-50 p-6">
            <div className="flex flex-col space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center mr-3">
                    <Lightbulb className="h-4 w-4 text-violet-600" />
                  </div>
                  <h3 className="font-medium">Topic: Digital Marketing Trends</h3>
                </div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isInView ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <div className="h-8 bg-violet-100 rounded-md w-full p-1 px-3 text-violet-800 font-medium">
                    10 Digital Marketing Trends That Will Define 2025
                  </div>
                  <div className="h-8 bg-gray-100 rounded-md w-full"></div>
                  <div className="h-8 bg-gray-100 rounded-md w-full"></div>
                </motion.div>
              </div>

              <motion.div
                className="bg-white rounded-lg p-4 shadow-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: isInView ? 1 : 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center mr-3">
                    <FileText className="h-4 w-4 text-violet-600" />
                  </div>
                  <h3 className="font-medium">Generated Outline</h3>
                </div>

                <div className="space-y-2">
                  <div className="h-6 bg-gray-100 rounded-md w-full"></div>
                  <div className="h-6 bg-gray-100 rounded-md w-full"></div>
                  <div className="h-6 bg-gray-100 rounded-md w-3/4"></div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white rounded-lg p-4 shadow-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: isInView ? 1 : 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <div className="flex justify-end">
                  <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white">
                    Generate Full Draft
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })

  const features = [
    {
      title: "AI Topic Generator",
      description: "Get endless blog topic ideas based on your keywords and industry.",
      icon: Lightbulb,
    },
    {
      title: "Smart Content Drafting",
      description: "Generate comprehensive first drafts with proper structure and flow.",
      icon: FileText,
    },
    {
      title: "SEO Optimization",
      description: "Receive keyword suggestions and SEO tips to improve your content's visibility.",
      icon: Search,
    },
    {
      title: "Multiple Export Options",
      description: "Download your content in various formats including Markdown, HTML, and Word.",
      icon: Download,
    },
    {
      title: "Content Calendar",
      description: "Plan and schedule your blog posts with our integrated content calendar.",
      icon: Clock,
    },
    {
      title: "Performance Analytics",
      description: "Track how your AI-generated content performs over time.",
      icon: Zap,
    },
  ]

  return (
    <section id="features" ref={ref} className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-6"
        >
          Powerful Features
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-16"
        >
          Everything you need to create exceptional blog content efficiently.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-xl p-8 shadow-md border border-gray-100 hover:border-violet-200 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center mb-6">
                <feature.icon className="h-6 w-6 text-violet-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TargetAudienceSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })

  const audiences = [
    {
      title: "Content Marketers",
      description: "Create more content in less time to meet your marketing goals.",
    },
    {
      title: "Small Business Owners",
      description: "Maintain a consistent blog without hiring a full-time writer.",
    },
    {
      title: "Freelance Writers",
      description: "Increase your output and take on more clients with AI assistance.",
    },
    {
      title: "Digital Agencies",
      description: "Scale your content production for multiple clients efficiently.",
    },
  ]

  return (
    <section ref={ref} className="py-20 px-6 bg-violet-50">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-6"
        >
          Who Benefits from BlogCraft AI?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-16"
        >
          Our AI writing assistant is perfect for anyone who needs to create quality blog content regularly.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {audiences.map((audience, index) => (
            <motion.div
              key={audience.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : index % 2 === 0 ? -30 : 30 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-xl p-8 shadow-md flex items-start"
            >
              <div className="w-10 h-10 rounded-full bg-violet-600 flex-shrink-0 flex items-center justify-center mr-4 text-white font-bold">
                {index + 1}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{audience.title}</h3>
                <p className="text-gray-600">{audience.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })

  const testimonials = [
    {
      quote:
        "BlogCraft AI has transformed our content strategy. We're publishing twice as much content with half the effort.",
      author: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechStart Inc.",
    },
    {
      quote: "As a freelancer, time is money. This tool has helped me take on more clients while maintaining quality.",
      author: "Michael Chen",
      role: "Freelance Content Writer",
    },
    {
      quote:
        "The SEO recommendations alone are worth the price. Our organic traffic has increased by 45% in just three months.",
      author: "Emily Rodriguez",
      role: "SEO Specialist",
      company: "Growth Digital",
    },
  ]

  return (
    <section id="testimonials" ref={ref} className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-6"
        >
          What Our Users Say
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-16"
        >
          Join thousands of content creators who have revolutionized their blogging workflow.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-xl p-8 shadow-md border border-gray-100"
            >
              <div className="mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-gray-600 text-sm">
                  {testimonial.role}
                  {testimonial.company && `, ${testimonial.company}`}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PricingSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })

  const plans = [
    {
      name: "Starter",
      price: 19,
      features: ["5 blog posts per month", "Basic SEO recommendations", "Export to Markdown & HTML", "Email support"],
      popular: false,
    },
    {
      name: "Professional",
      price: 49,
      features: [
        "20 blog posts per month",
        "Advanced SEO optimization",
        "All export formats",
        "Content calendar",
        "Priority support",
      ],
      popular: true,
    },
    {
      name: "Agency",
      price: 99,
      features: [
        "Unlimited blog posts",
        "Advanced SEO optimization",
        "All export formats",
        "Content calendar",
        "Analytics dashboard",
        "Dedicated account manager",
      ],
      popular: false,
    },
  ]

  return (
    <section id="pricing" ref={ref} className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-6"
        >
          Simple, Transparent Pricing
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-16"
        >
          Choose the plan that fits your content creation needs.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{
                opacity: isInView ? 1 : 0,
                y: isInView ? 0 : 30,
                scale: isInView ? 1 : 0.95,
              }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className={cn(
                "rounded-xl overflow-hidden border relative",
                plan.popular ? "bg-white border-violet-200 shadow-xl" : "bg-white border-gray-200 shadow-md",
              )}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className={cn("p-8", plan.popular && "pt-10")}>
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-500 ml-2">/month</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -10 }}
                      transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
                      className="flex items-center"
                    >
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <Button
                  className={cn(
                    "w-full",
                    plan.popular
                      ? "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                      : "bg-white border-2 border-violet-600 text-violet-600 hover:bg-violet-50",
                  )}
                >
                  Get Started
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center text-gray-600 mt-12"
        >
          All plans include a 14-day free trial. No credit card required.
        </motion.p>
      </div>
    </section>
  )
}

function CallToAction() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
          transition={{ duration: 0.6 }}
          className="rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 p-12 text-center text-white"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to Transform Your Content Creation?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-violet-100 max-w-2xl mx-auto mb-8 text-lg"
          >
            Join thousands of content creators who have revolutionized their blogging workflow with BlogCraft AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Button className="bg-white text-violet-700 hover:bg-gray-100 px-8 py-6 text-lg">
              Start Your Free Trial
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
              Schedule a Demo
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="py-12 px-6 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center mr-2">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-xl">BlogCraft AI</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Your AI co-writer for faster, smarter blogging. Go from keyword to drafted post with SEO insights,
              effortlessly.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  Testimonials
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  API Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  Status
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2025 BlogCraft AI. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
