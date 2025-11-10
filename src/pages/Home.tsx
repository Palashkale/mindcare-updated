import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Shield,
  Clock,
  Star,
  Heart,
  Award,
  Zap,
  Users,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";
import Navbar from "../components/Navbar";

const Home: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: "Privacy First",
      description:
        "End-to-end encryption with HIPAA-compliant security standards ensuring your data remains confidential.",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description:
        "Round-the-clock access to mental health resources and crisis support whenever you need it.",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: Star,
      title: "Expert Care",
      description:
        "Board-certified therapists and psychiatrists using evidence-based treatment methodologies.",
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: Heart,
      title: "Compassionate Support",
      description:
        "Trauma-informed care with a focus on building resilience and sustainable mental wellness.",
      color: "from-rose-500 to-pink-600",
    },
  ];

  const advanced_features = [
    {
      icon: Zap,
      title: "AI-Powered Insights",
      description:
        "Advanced analytics to track patterns and provide personalized recommendations.",
      color: "from-purple-500 to-violet-600",
    },
    {
      icon: Users,
      title: "Community Support",
      description:
        "Connect with peer support groups and therapy communities for shared healing.",
      color: "from-cyan-500 to-blue-600",
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description:
        "Comprehensive mood tracking with detailed analytics and progress visualization.",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: CheckCircle,
      title: "Personalized Care",
      description:
        "Tailored treatment plans adapted to your unique needs and preferences.",
      color: "from-indigo-500 to-purple-600",
    },
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Clinical Psychologist",
      content:
        "MindCare's platform has revolutionized how I provide therapy. The integrated tools and analytics help me deliver more personalized care to my patients.",
      rating: 5,
      avatar:
        "https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
    {
      name: "Michael Chen",
      role: "Software Engineer",
      content:
        "The combination of professional therapy and AI-powered insights has helped me manage my anxiety more effectively than traditional methods.",
      rating: 5,
      avatar:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
    {
      name: "Emily Rodriguez",
      role: "Healthcare Worker",
      content:
        "Having immediate access to mental health support during the pandemic was crucial. The 24/7 availability and quality of care exceeded my expectations.",
      rating: 5,
      avatar:
        "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
  ];

  const stats = [
    { number: "25k+", label: "Active Users", sublabel: "Worldwide" },
    { number: "24/7", label: "Support", sublabel: "Available" },
    { number: "800+", label: "Licensed", sublabel: "Professionals" },
    { number: "4.9★", label: "User", sublabel: "Rating" },
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden min-h-screen flex items-center">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-float delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <div className="space-y-8">
                <div className="space-y-6">
                  <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                    <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Transform
                    </span>
                    <br />
                    <span className="text-white">Your Mental</span>
                    <br />
                    <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-orange-400 bg-clip-text text-transparent">
                      Wellness Journey
                    </span>
                  </h1>
                  <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
                    Revolutionary mental health platform combining AI-powered
                    insights, expert clinical care, and personalized treatment
                    plans to optimize your psychological wellbeing.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                  <Link
                    to="/signup"
                    className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center shadow-2xl hover:shadow-blue-500/25 hover:scale-105"
                  >
                    Start Your Journey
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </Link>
                  <Link
                    to="/login"
                    className="border-2 border-slate-400 hover:border-white text-slate-300 hover:text-white px-10 py-4 rounded-xl font-semibold transition-all duration-300 text-center hover:bg-white/5"
                  >
                    Sign In
                  </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                  {stats.map((stat, index) => (
                    <AnimatedSection key={index} delay={index * 200}>
                      <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                        <div className="text-2xl font-bold text-blue-400">
                          {stat.number}
                        </div>
                        <div className="text-sm text-slate-300">
                          {stat.label}
                        </div>
                        <div className="text-xs text-slate-400">
                          {stat.sublabel}
                        </div>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={300}>
              <div className="relative flex items-center justify-center">
                {/* Hero Image */}
                <div className="relative z-10">
                  <img
                    src="https://images.pexels.com/photos/4672553/pexels-photo-4672553.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Mental health support"
                    className="rounded-2xl shadow-2xl w-full max-w-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl"></div>
                </div>

                {/* Glowing Orb */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Comprehensive Mental Health{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Ecosystem
                </span>
              </h2>
              <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                Our platform integrates cutting-edge technology with
                evidence-based clinical practices to deliver personalized mental
                health solutions that adapt to your unique needs.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <AnimatedSection key={feature.title} delay={index * 150}>
                <div className="group relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 hover:border-slate-200 overflow-hidden">
                  {/* Background Gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  ></div>

                  <div className="relative z-10">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${feature.color} text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4 text-center">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-center">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Advanced Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advanced_features.map((feature, index) => (
              <AnimatedSection key={feature.title} delay={index * 150 + 600}>
                <div className="group relative p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-700 hover:border-slate-600 overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}
                  ></div>

                  <div className="relative z-10">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${feature.color} text-white rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <div className="space-y-8">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Pioneering the Future of{" "}
                  <span className="bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
                    Mental Healthcare
                  </span>
                </h2>
                <div className="space-y-6 text-lg text-slate-300 leading-relaxed">
                  <p>
                    At MindCare, we're revolutionizing mental healthcare through
                    the integration of advanced AI technology, evidence-based
                    clinical practices, and personalized treatment modalities.
                    Our platform represents the convergence of neuroscience,
                    psychology, and cutting-edge technology.
                  </p>
                  <p>
                    We believe mental wellness should be proactive, not
                    reactive. Our comprehensive approach combines real-time
                    monitoring, predictive analytics, and human expertise to
                    create a new paradigm in psychological care.
                  </p>
                </div>
                <div className="flex items-center space-x-6 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <Award className="h-12 w-12 text-yellow-400 flex-shrink-0" />
                  <div>
                    <div className="text-xl font-bold text-white">
                      Industry Recognition
                    </div>
                    <div className="text-slate-300">
                      Trusted by leading healthcare institutions worldwide
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={300}>
              <div className="relative">
                <div className="relative z-10">
                  <img
                    src="https://images.pexels.com/photos/2401442/pexels-photo-2401442.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Mental health support"
                    className="rounded-2xl shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl"></div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Transforming Lives{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Every Day
                </span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Real stories from healthcare professionals and individuals
                who've experienced breakthrough results with our platform.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <AnimatedSection key={testimonial.name} delay={index * 200}>
                <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 hover:border-slate-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative z-10">
                    <div className="flex items-center mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center space-x-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-bold text-slate-900 text-lg">
                          {testimonial.name}
                        </div>
                        <div className="text-slate-500">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float delay-1000"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <AnimatedSection>
            <div className="space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                Ready to Transform Your{" "}
                <span className="bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
                  Mental Wellness?
                </span>
              </h2>
              <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Join over 25,000 individuals and healthcare professionals who
                have revolutionized their approach to mental health with
                MindCare's advanced platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  to="/signup"
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center shadow-2xl hover:shadow-blue-500/25 hover:scale-105"
                >
                  Begin Your Journey
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-slate-400 hover:border-white text-slate-300 hover:text-white px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:bg-white/5"
                >
                  Professional Access
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Home;
