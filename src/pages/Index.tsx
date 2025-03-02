
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Shield, CheckCircle, Award, Users, ChevronRight } from "lucide-react";
import { useSidebar } from "@/components/Sidebar";

const Index = () => {
  const { setExpanded } = useSidebar();

  useEffect(() => {
    setExpanded(false);
    
    // Setup animation observations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px"
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);
    
    document.querySelectorAll('.animate-on-scroll, .scroll-reveal-stagger').forEach(el => {
      observer.observe(el);
    });
    
    return () => {
      observer.disconnect();
    };
  }, [setExpanded]);

  const features = [
    {
      icon: <Shield className="h-6 w-6 text-cyber-primary" />,
      title: "Comprehensive Cybersecurity Curriculum",
      description: "Expert-designed courses covering ethical hacking, network security, cryptography, and more."
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-cyber-primary" />,
      title: "Hands-on Learning Labs",
      description: "Practice your skills in realistic environments with virtual labs and simulations."
    },
    {
      icon: <Award className="h-6 w-6 text-cyber-primary" />,
      title: "Industry-Recognized Certifications",
      description: "Prepare for top certifications including CompTIA, CISSP, CEH, and more."
    },
    {
      icon: <Users className="h-6 w-6 text-cyber-primary" />,
      title: "Community & Mentorship",
      description: "Connect with peers and industry professionals for guidance and networking."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-cyber-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-primary/5 to-cyber-secondary/10 z-0" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="animate-on-scroll">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Master Cybersecurity Skills with <span className="text-cyber-primary">Expert Guidance</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Join our comprehensive cybersecurity academy and gain the knowledge and skills needed to protect systems, networks, and data in today's digital landscape.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-cyber-primary hover:bg-cyber-primary/90">
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  View Courses
                </Button>
              </div>
            </div>
            <div className="relative animate-on-scroll">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyber-primary/20 to-cyber-secondary/10 rounded-xl transform rotate-3"></div>
              <img 
                src="public/lovable-uploads/45068f08-6c7a-4e06-8cff-d96e12b4e2bd.png" 
                alt="Cybersecurity Training" 
                className="relative rounded-xl shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-500 ease-in-out" 
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Academy</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive approach to cybersecurity education ensures you're prepared for real-world challenges.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 scroll-reveal-stagger">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="p-6 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="bg-cyber-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-cyber-primary to-cyber-secondary">
        <div className="max-w-4xl mx-auto text-center animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to start your cybersecurity journey?</h2>
          <p className="text-white/80 text-lg mb-8">
            Join thousands of students already learning with our industry-leading platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button size="lg" className="bg-white text-cyber-primary hover:bg-white/90" asChild>
              <Link to="/courses">Explore Courses</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-10 px-4 bg-cyber-dark text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <Shield className="h-8 w-8 text-cyber-primary mr-2" />
              <span className="text-2xl font-bold">CyberEdu</span>
            </div>
            <div className="flex space-x-6">
              <Link to="#" className="text-white/70 hover:text-white transition-colors">About</Link>
              <Link to="#" className="text-white/70 hover:text-white transition-colors">Courses</Link>
              <Link to="#" className="text-white/70 hover:text-white transition-colors">Contact</Link>
              <Link to="#" className="text-white/70 hover:text-white transition-colors">Privacy</Link>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center md:text-left">
            <p className="text-white/60 text-sm">© 2024 CyberEdu. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
