"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, BarChart3, Brain, Database, FileUp, Zap } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AutoML Insight
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/auth" className="text-foreground/70 hover:text-foreground transition">
              Sign In
            </Link>
            <Button asChild>
              <Link href="/auth">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center space-y-6 mb-16">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
            AI-Powered Model Evaluation Platform
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-balance">
            Instantly Compare{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">ML Algorithms</span>
          </h1>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto text-balance">
            Upload your dataset, describe your goal with natural language, and let our AI automatically test multiple ML
            algorithms to find the best model for your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" asChild className="gap-2">
              <Link href="/auth">
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="relative mb-20 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm p-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
          <div className="relative space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 h-64 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg" />
              <div className="w-64 space-y-4">
                <div className="h-12 bg-muted rounded-lg" />
                <div className="h-12 bg-muted rounded-lg" />
                <div className="h-12 bg-muted rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-foreground/60 max-w-2xl mx-auto">
            Everything you need to find the perfect ML model for your dataset
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Feature 1 */}
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm hover:border-border/60 transition p-8">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <FileUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Data Upload</h3>
            <p className="text-foreground/60">
              Upload CSV, XLSX, or other dataset formats. Our system automatically handles data preprocessing and
              validation.
            </p>
          </Card>

          {/* Feature 2 */}
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm hover:border-border/60 transition p-8">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Analysis</h3>
            <p className="text-foreground/60">
              Describe your task in natural language. Our LLM interprets your needs and recommends optimal algorithms.
            </p>
          </Card>

          {/* Feature 3 */}
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm hover:border-border/60 transition p-8">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Multi-Algorithm Testing</h3>
            <p className="text-foreground/60">
              Automatically test Linear Regression, SVM, Random Forest, K-Fold CV, and more in seconds.
            </p>
          </Card>

          {/* Feature 4 */}
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm hover:border-border/60 transition p-8">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Visual Comparisons</h3>
            <p className="text-foreground/60">
              Interactive charts and tables comparing accuracy, R², MSE, and more across all tested models.
            </p>
          </Card>

          {/* Feature 5 */}
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm hover:border-border/60 transition p-8">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Database className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Dataset Insights</h3>
            <p className="text-foreground/60">
              View statistical summaries, missing values analysis, and correlations before model evaluation.
            </p>
          </Card>

          {/* Feature 6 */}
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm hover:border-border/60 transition p-8">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <ArrowRight className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Export & Deploy</h3>
            <p className="text-foreground/60">
              Download detailed reports, export models, or deploy your best performer directly.
            </p>
          </Card>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border/40">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Built with Modern Stack</h2>
          <p className="text-foreground/60">Enterprise-grade technologies for production-ready ML solutions</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {["React", "Next.js", "FastAPI", "PostgreSQL", "TensorFlow", "Docker"].map((tech) => (
            <div
              key={tech}
              className="flex items-center justify-center p-4 rounded-lg bg-card/50 border border-border/40"
            >
              <span className="font-medium text-sm">{tech}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 p-12 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold">Ready to find your perfect model?</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Start comparing ML algorithms on your dataset in minutes. No credit card required.
          </p>
          <Button size="lg" asChild>
            <Link href="/auth">Get Started for Free</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-20 py-12 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold">AutoML Insight</span>
            </div>
            <div className="flex gap-8 text-sm text-foreground/60">
              <Link href="#" className="hover:text-foreground transition">
                Documentation
              </Link>
              <Link href="#" className="hover:text-foreground transition">
                GitHub
              </Link>
              <Link href="#" className="hover:text-foreground transition">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/40 text-center text-foreground/40 text-sm">
            <p>&copy; 2025 AutoML Insight. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
