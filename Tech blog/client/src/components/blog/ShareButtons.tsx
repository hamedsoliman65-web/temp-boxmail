import { Button } from "@/components/ui/button";
import { SiFacebook, SiX, SiLinkedin } from "react-icons/si";
import { Mail, Link as LinkIcon, Check } from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
  title: string;
  url: string;
  vertical?: boolean;
}

export default function ShareButtons({ title, url, vertical = false }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const shareLinks = [
    {
      name: "Facebook",
      icon: SiFacebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "bg-[#1877F2] text-white border-[#1877F2]",
    },
    {
      name: "X",
      icon: SiX,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: "bg-[#000000] text-white border-[#000000]",
    },
    {
      name: "LinkedIn",
      icon: SiLinkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "bg-[#0A66C2] text-white border-[#0A66C2]",
    },
    {
      name: "Email",
      icon: Mail,
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      color: "bg-muted text-foreground",
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      console.log("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div
      className={`flex ${vertical ? "flex-col" : "flex-row flex-wrap"} gap-2`}
      data-testid="share-buttons"
    >
      {shareLinks.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            data-testid={`button-share-${link.name.toLowerCase()}`}
          >
            <Button
              variant="outline"
              size={vertical ? "sm" : "default"}
              className={`${link.color} ${vertical ? "w-full justify-start" : ""}`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {link.name}
            </Button>
          </a>
        );
      })}
      <Button
        variant="outline"
        size={vertical ? "sm" : "default"}
        onClick={copyToClipboard}
        className={vertical ? "w-full justify-start" : ""}
        data-testid="button-copy-link"
      >
        {copied ? (
          <Check className="w-4 h-4 mr-2 text-green-500" />
        ) : (
          <LinkIcon className="w-4 h-4 mr-2" />
        )}
        {copied ? "Copied!" : "Copy Link"}
      </Button>
    </div>
  );
}
