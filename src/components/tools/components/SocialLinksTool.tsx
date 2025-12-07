import { ToolComponentProps } from "../types";
import { CardGridPattern } from "../index";
import { Github, Linkedin, Instagram, Mail, Calendar } from "lucide-react";

export default function SocialLinksTool({ invocation }: ToolComponentProps) {
  // Extract platforms from args, with defaults
  const args = invocation.args as { platforms?: string[] };
  const platformsToShow = args?.platforms || [
    "github",
    "linkedin",
    "instagram",
    "email",
    "calendly"
  ];

  // Social data configuration
  const socialData = {
    github: {
      id: "github",
      icon: <Github className="w-5 h-5" />,
      label: "GitHub",
      username: "AaronCGoidel",
      url: "https://github.com/AaronCGoidel",
      bgColor: "bg-gray-800 hover:bg-gray-900",
    },
    linkedin: {
      id: "linkedin",
      icon: <Linkedin className="w-5 h-5" />,
      label: "LinkedIn",
      username: "AaronCGoidel",
      url: "https://linkedin.com/in/AaronCGoidel",
      bgColor: "bg-blue-600 hover:bg-blue-700",
    },
    instagram: {
      id: "instagram",
      icon: <Instagram className="w-5 h-5" />,
      label: "Instagram",
      username: "im_an_aaron",
      url: "https://instagram.com/im_an_aaron",
      bgColor: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
    },
    email: {
      id: "email",
      icon: <Mail className="w-5 h-5" />,
      label: "Email",
      username: "acgoidel@gmail.com",
      url: "mailto:acgoidel@gmail.com",
      bgColor: "border border-gray-300 hover:border-gray-400 hover:bg-gray-800",
    },
    calendly: {
      id: "calendly",
      icon: <Calendar className="w-5 h-5" />,
      label: "Calendly",
      username: "acgoidel",
      url: "https://calendly.com/acgoidel",
      bgColor: "bg-yellow-600 hover:bg-yellow-700",
    },
  };

  // Filter cards based on requested platforms
  const cards = platformsToShow
    .map(platform => socialData[platform as keyof typeof socialData])
    .filter(Boolean);

  return (
    <CardGridPattern
      invocation={invocation}
      title="Connect with Aaron"
      cards={cards}
      columns={2}
    />
  );
}