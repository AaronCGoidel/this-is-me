export interface CannedPrompt {
  label: string;
  prompt: string;
  description: string;
  useInMenu: boolean;
  useInCarousel: boolean;
}

export const cannedPrompts: CannedPrompt[] = [
  {
    label: "About Aaron",
    prompt: "Give me a brief bio for Aaron",
    description: "Learn about Aaron's background",
    useInMenu: true,
    useInCarousel: true,
  },
  {
    label: "Résumé",
    prompt: "Can I have a copy of Aaron's résumé?",
    description: "View and download Aaron's résumé",
    useInMenu: true,
    useInCarousel: true,
  },
  {
    label: "Connect",
    prompt: "How can I connect with Aaron?",
    description: "Get Aaron's social links and contact info",
    useInMenu: true,
    useInCarousel: true,
  },
  {
    label: "Schedule Meeting",
    prompt: "Schedule a meeting with Aaron",
    description: "Book a call with Aaron",
    useInMenu: true,
    useInCarousel: true,
  },
  {
    label: "Projects",
    prompt: "What are some of Aaron's notable projects?",
    description: "Explore Aaron's work and projects",
    useInMenu: true,
    useInCarousel: false,
  },
  {
    label: "Outside Work",
    prompt: "What does Aaron like to do outside of work?",
    description: "Learn about Aaron's hobbies and interests",
    useInMenu: false,
    useInCarousel: true,
  },
  {
    label: "Favorite Book",
    prompt: "What is Aaron's favorite book?",
    description: "Discover Aaron's reading preferences",
    useInMenu: false,
    useInCarousel: true,
  },
  {
    label: "Write a Poem",
    prompt: "Write me a poem about Aaron",
    description: "Get creative with AI poetry",
    useInMenu: false,
    useInCarousel: true,
  },
];

// Helper functions to filter prompts
export const getMenuPrompts = () =>
  cannedPrompts.filter((prompt) => prompt.useInMenu);
export const getCarouselPrompts = () =>
  cannedPrompts.filter((prompt) => prompt.useInCarousel);
