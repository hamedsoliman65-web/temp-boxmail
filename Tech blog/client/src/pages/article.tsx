import { useState } from "react";
import { useParams } from "wouter";
import Header from "@/components/blog/Header";
import ArticleContent from "@/components/blog/ArticleContent";
import CommentSection, { type Comment } from "@/components/blog/CommentSection";
import Footer from "@/components/blog/Footer";

import mlImage from "@assets/generated_images/machine_learning_article_image.png";
import cyberImage from "@assets/generated_images/cybersecurity_article_image.png";
import cloudImage from "@assets/generated_images/cloud_technology_article_image.png";
import privacyImage from "@assets/generated_images/privacy_protection_article_image.png";
import aiCollab from "@assets/generated_images/ai_collaboration_article_image.png";
import heroImage from "@assets/generated_images/ai_cybersecurity_hero_banner.png";

// todo: remove mock functionality - replace with API data
const mockArticleContent: Record<
  string,
  {
    title: string;
    category: "AI" | "Cybersecurity" | "Technology";
    publishedAt: string;
    readTime: number;
    heroImage: string;
    content: string;
  }
> = {
  "future-of-machine-learning": {
    title: "The Future of Machine Learning in Enterprise Applications",
    category: "AI",
    publishedAt: "2024-12-10T10:00:00Z",
    readTime: 8,
    heroImage: mlImage,
    content: `
      <p>Machine learning has evolved from a niche academic pursuit to a cornerstone of modern enterprise technology. As we look ahead, the integration of ML into business operations is poised to accelerate dramatically.</p>
      
      <h2>The Current State of Enterprise ML</h2>
      <p>Today, organizations across industries are leveraging machine learning for everything from customer service automation to predictive maintenance. The technology has proven its value in reducing costs, improving efficiency, and enabling new business models.</p>
      
      <p>Key areas where ML is making an impact include:</p>
      <ul>
        <li><strong>Customer Experience:</strong> Personalized recommendations and intelligent chatbots</li>
        <li><strong>Operations:</strong> Demand forecasting and supply chain optimization</li>
        <li><strong>Security:</strong> Fraud detection and threat identification</li>
        <li><strong>HR:</strong> Talent acquisition and employee engagement prediction</li>
      </ul>
      
      <h2>Emerging Trends</h2>
      <p>Several trends are shaping the future of enterprise ML:</p>
      
      <h3>AutoML and Low-Code Solutions</h3>
      <p>The democratization of ML through automated machine learning platforms is enabling non-specialists to build and deploy models. This trend is accelerating adoption across organizations that lack dedicated data science teams.</p>
      
      <h3>Edge Computing Integration</h3>
      <p>Running ML models at the edge—on devices close to data sources—is becoming increasingly important for real-time applications. This approach reduces latency and enables use cases in IoT, manufacturing, and autonomous systems.</p>
      
      <h3>Responsible AI</h3>
      <p>As ML systems make more consequential decisions, organizations are focusing on fairness, explainability, and ethical considerations. Regulatory frameworks are emerging to ensure AI systems operate transparently and without bias.</p>
      
      <h2>Implementation Challenges</h2>
      <p>Despite the promise, enterprises face significant challenges in ML adoption:</p>
      <ul>
        <li>Data quality and availability</li>
        <li>Talent scarcity and skills gaps</li>
        <li>Integration with legacy systems</li>
        <li>Model governance and lifecycle management</li>
      </ul>
      
      <h2>Looking Ahead</h2>
      <p>The next five years will see ML become an integral part of enterprise infrastructure, much like databases and cloud computing before it. Organizations that invest now in building ML capabilities will be well-positioned to compete in an increasingly AI-driven economy.</p>
      
      <p>For more insights on protecting your digital identity while exploring these technologies, consider using <a href="https://temp-boxmail.org" target="_blank" rel="noopener noreferrer">temporary email services</a> when testing new AI tools and platforms.</p>
    `,
  },
  "cybersecurity-remote-workers": {
    title: "Essential Cybersecurity Practices for Remote Workers",
    category: "Cybersecurity",
    publishedAt: "2024-12-09T14:30:00Z",
    readTime: 6,
    heroImage: cyberImage,
    content: `
      <p>The shift to remote work has fundamentally changed the cybersecurity landscape. With employees accessing sensitive data from home networks and personal devices, organizations must adapt their security strategies accordingly.</p>
      
      <h2>Understanding the Remote Work Threat Landscape</h2>
      <p>Remote workers face unique security challenges that differ from traditional office environments:</p>
      <ul>
        <li>Unsecured home Wi-Fi networks</li>
        <li>Shared devices with family members</li>
        <li>Phishing attacks targeting remote workers</li>
        <li>Lack of physical security controls</li>
      </ul>
      
      <h2>Essential Security Practices</h2>
      
      <h3>1. Secure Your Home Network</h3>
      <p>Your home router is the first line of defense. Change default passwords, enable WPA3 encryption, and keep firmware updated. Consider using a separate network for work devices.</p>
      
      <h3>2. Use a VPN</h3>
      <p>A Virtual Private Network encrypts your internet traffic and protects sensitive data from interception. Use your company's VPN for all work-related activities.</p>
      
      <h3>3. Enable Multi-Factor Authentication</h3>
      <p>MFA adds an extra layer of security beyond passwords. Enable it on all work accounts, email, and any service that offers it.</p>
      
      <h3>4. Keep Software Updated</h3>
      <p>Software updates often include critical security patches. Enable automatic updates for your operating system, browsers, and applications.</p>
      
      <h3>5. Practice Email Hygiene</h3>
      <p>Be skeptical of unexpected emails, especially those requesting urgent action or containing links. When signing up for new services or testing platforms, use <a href="https://temp-boxmail.org" target="_blank" rel="noopener noreferrer">temporary email addresses</a> to protect your primary inbox.</p>
      
      <h2>Recognizing Phishing Attempts</h2>
      <p>Phishing attacks have become increasingly sophisticated. Watch for these red flags:</p>
      <ul>
        <li>Urgent or threatening language</li>
        <li>Requests for login credentials or personal information</li>
        <li>Mismatched sender addresses and URLs</li>
        <li>Poor grammar and spelling</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Cybersecurity is everyone's responsibility, especially in a remote work environment. By following these practices, you can significantly reduce your risk of falling victim to cyber attacks while maintaining productivity from home.</p>
    `,
  },
  "cloud-computing-trends-2025": {
    title: "Cloud Computing Trends Shaping 2025",
    category: "Technology",
    publishedAt: "2024-12-08T09:15:00Z",
    readTime: 10,
    heroImage: cloudImage,
    content: `
      <p>Cloud computing continues to evolve at a rapid pace, with new technologies and architectural patterns emerging to meet the demands of modern applications. Here are the key trends that will define cloud computing in 2025.</p>
      
      <h2>Multi-Cloud and Hybrid Strategies</h2>
      <p>Organizations are increasingly adopting multi-cloud strategies to avoid vendor lock-in and optimize costs. The ability to seamlessly move workloads between cloud providers and on-premises infrastructure is becoming essential.</p>
      
      <h2>Serverless Evolution</h2>
      <p>Serverless computing is maturing beyond simple functions to support complex applications. New patterns and frameworks are enabling developers to build entire applications without managing infrastructure.</p>
      
      <h2>Edge Computing Integration</h2>
      <p>The line between cloud and edge is blurring as providers extend their services to edge locations. This enables low-latency applications and reduces data transfer costs for IoT and real-time analytics use cases.</p>
      
      <h2>AI/ML Cloud Services</h2>
      <p>Cloud providers are expanding their AI and machine learning offerings, making it easier for organizations to build and deploy intelligent applications without deep expertise in data science.</p>
      
      <h2>Sustainability Focus</h2>
      <p>Environmental concerns are driving innovation in cloud infrastructure. Providers are investing in renewable energy and more efficient hardware to reduce the carbon footprint of cloud computing.</p>
      
      <h2>Security and Compliance</h2>
      <p>As organizations move more sensitive workloads to the cloud, security and compliance capabilities are becoming critical differentiators. New tools and services are emerging to help organizations meet regulatory requirements while maintaining agility.</p>
      
      <p>Stay informed about these developments and protect your privacy when testing new cloud services by using <a href="https://temp-boxmail.org" target="_blank" rel="noopener noreferrer">temporary email addresses</a> for trial accounts.</p>
    `,
  },
  "privacy-first-email-solutions": {
    title: "Privacy-First Email Solutions: Why They Matter",
    category: "Cybersecurity",
    publishedAt: "2024-12-07T16:45:00Z",
    readTime: 5,
    heroImage: privacyImage,
    content: `
      <p>In an era of increasing digital surveillance and data breaches, protecting your email privacy has never been more important. Temporary email services offer a powerful tool for maintaining your digital privacy.</p>
      
      <h2>The Problem with Traditional Email</h2>
      <p>Every time you sign up for a new service, you're asked for an email address. This creates several problems:</p>
      <ul>
        <li>Your inbox gets flooded with promotional emails</li>
        <li>Your email address may be sold to third parties</li>
        <li>Data breaches can expose your personal information</li>
        <li>Your online activities can be tracked across services</li>
      </ul>
      
      <h2>How Temporary Email Helps</h2>
      <p>Temporary email services provide disposable addresses that you can use for one-time registrations or testing. Benefits include:</p>
      
      <h3>Spam Protection</h3>
      <p>By using a temporary address for sign-ups, you keep your primary inbox clean and focused on important communications.</p>
      
      <h3>Privacy Preservation</h3>
      <p>Temporary addresses can't be linked to your real identity, protecting you from targeted advertising and data harvesting.</p>
      
      <h3>Security Enhancement</h3>
      <p>If a service you signed up for gets breached, only the temporary address is exposed—not your real email.</p>
      
      <h2>Best Practices</h2>
      <p>When using temporary email services:</p>
      <ul>
        <li>Use them for non-critical registrations and testing</li>
        <li>Don't use them for important accounts like banking</li>
        <li>Choose reputable services like <a href="https://temp-boxmail.org" target="_blank" rel="noopener noreferrer">Temp Box Mail</a></li>
        <li>Be aware that some services block temporary addresses</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Temporary email is a valuable tool in your privacy toolkit. Used appropriately, it can significantly reduce your digital footprint and protect you from spam and data exploitation.</p>
    `,
  },
  "ai-human-collaboration": {
    title: "AI and Human Collaboration: Finding the Balance",
    category: "AI",
    publishedAt: "2024-12-06T11:20:00Z",
    readTime: 7,
    heroImage: aiCollab,
    content: `
      <p>As artificial intelligence becomes more capable, the question of how humans and AI can work together effectively has become central to discussions about the future of work.</p>
      
      <h2>Beyond Replacement: Augmentation</h2>
      <p>The most successful AI implementations don't replace humans—they augment their capabilities. This collaborative approach combines human creativity, judgment, and emotional intelligence with AI's speed, consistency, and data processing power.</p>
      
      <h2>Examples of Successful Collaboration</h2>
      
      <h3>Healthcare</h3>
      <p>AI assists doctors in diagnosing diseases by analyzing medical images and patient data, but the final decision remains with the physician who considers the full context of the patient's situation.</p>
      
      <h3>Creative Industries</h3>
      <p>Writers and designers use AI tools to generate ideas and handle repetitive tasks, freeing them to focus on the creative work that requires human insight.</p>
      
      <h3>Customer Service</h3>
      <p>AI chatbots handle routine queries while human agents focus on complex issues requiring empathy and nuanced problem-solving.</p>
      
      <h2>Principles for Effective Collaboration</h2>
      <ul>
        <li><strong>Clear Role Definition:</strong> Understand what AI does well and where humans add value</li>
        <li><strong>Continuous Learning:</strong> Both humans and AI systems should improve from each interaction</li>
        <li><strong>Transparency:</strong> Users should know when they're interacting with AI</li>
        <li><strong>Human Oversight:</strong> Critical decisions should have human review</li>
      </ul>
      
      <h2>The Future of Work</h2>
      <p>Rather than a world where AI replaces workers, we're moving toward one where AI becomes a tool that every professional uses—much like computers became ubiquitous in offices. The winners will be those who learn to leverage AI effectively while developing uniquely human skills.</p>
      
      <p>As you explore AI tools, protect your privacy by using <a href="https://temp-boxmail.org" target="_blank" rel="noopener noreferrer">temporary email</a> when creating accounts for new AI services.</p>
    `,
  },
  "zero-trust-architecture-guide": {
    title: "Zero Trust Architecture: A Complete Guide",
    category: "Cybersecurity",
    publishedAt: "2024-12-05T13:00:00Z",
    readTime: 12,
    heroImage: heroImage,
    content: `
      <p>Zero Trust is a security framework that assumes no user or system should be trusted by default, regardless of their location. This guide explains the principles, benefits, and implementation strategies of Zero Trust Architecture.</p>
      
      <h2>Core Principles</h2>
      
      <h3>Never Trust, Always Verify</h3>
      <p>Every access request should be authenticated and authorized, regardless of where it originates. Traditional perimeter-based security assumes internal networks are safe—Zero Trust makes no such assumption.</p>
      
      <h3>Least Privilege Access</h3>
      <p>Users and systems should only have the minimum access necessary to perform their functions. This limits the potential damage from compromised credentials.</p>
      
      <h3>Assume Breach</h3>
      <p>Design your security as if attackers are already inside your network. This mindset leads to better segmentation, monitoring, and incident response capabilities.</p>
      
      <h2>Key Components</h2>
      
      <h3>Identity and Access Management</h3>
      <p>Strong identity verification is the foundation of Zero Trust. This includes multi-factor authentication, single sign-on, and continuous identity verification.</p>
      
      <h3>Micro-Segmentation</h3>
      <p>Divide your network into small segments with separate access controls. This limits lateral movement by attackers who breach one segment.</p>
      
      <h3>Continuous Monitoring</h3>
      <p>Monitor all network traffic and user behavior for anomalies. Use AI and machine learning to detect threats in real-time.</p>
      
      <h2>Implementation Steps</h2>
      <ol>
        <li>Identify your protect surface (critical data, assets, applications)</li>
        <li>Map transaction flows to understand how data moves</li>
        <li>Build a Zero Trust architecture around your protect surface</li>
        <li>Create Zero Trust policies based on identity and context</li>
        <li>Monitor and maintain the environment continuously</li>
      </ol>
      
      <h2>Challenges and Considerations</h2>
      <p>Implementing Zero Trust is a journey, not a destination. Common challenges include:</p>
      <ul>
        <li>Legacy system integration</li>
        <li>Cultural resistance to new security controls</li>
        <li>Complexity of policy management</li>
        <li>Balancing security with user experience</li>
      </ul>
      
      <p>For more security tips and tools, visit <a href="https://temp-boxmail.org" target="_blank" rel="noopener noreferrer">Temp Box Mail</a> to learn how temporary email can enhance your privacy strategy.</p>
    `,
  },
};

// todo: remove mock functionality
const mockInitialComments: Record<string, Comment[]> = {
  "future-of-machine-learning": [
    {
      id: "1",
      name: "Sarah Chen",
      email: "sarah@example.com",
      content: "Excellent overview of ML trends! The section on AutoML really resonated with our team's experience.",
      createdAt: "2024-12-10T14:30:00Z",
    },
  ],
  "cybersecurity-remote-workers": [
    {
      id: "1",
      name: "Michael Torres",
      email: "michael@example.com",
      content: "Great practical tips. I've shared this with my entire team.",
      createdAt: "2024-12-09T18:45:00Z",
    },
    {
      id: "2",
      name: "Emily Watson",
      email: "emily@example.com",
      content: "The phishing section is so important. We've seen a huge increase in targeted attacks.",
      createdAt: "2024-12-10T09:15:00Z",
    },
  ],
};

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? mockArticleContent[slug] : null;
  
  const [comments, setComments] = useState<Comment[]>(
    slug && mockInitialComments[slug] ? mockInitialComments[slug] : []
  );

  const handleAddComment = (comment: Omit<Comment, "id" | "createdAt">) => {
    setComments([
      ...comments,
      {
        ...comment,
        id: String(comments.length + 1),
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  if (!article || !slug) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Article Not Found</h1>
            <p className="text-muted-foreground">The article you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ArticleContent
          title={article.title}
          category={article.category}
          publishedAt={article.publishedAt}
          readTime={article.readTime}
          heroImage={article.heroImage}
          content={article.content}
          slug={slug}
        />
        <CommentSection
          articleId={slug}
          comments={comments}
          onAddComment={handleAddComment}
        />
      </main>
      <Footer />
    </div>
  );
}
