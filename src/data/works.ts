export interface Work {
  id: number;
  title: string;
  category: string;
  image: string;
  description?: string;
  details?: string[];
  year?: string;
}

export const works: Work[] = [
  {
    id: 1,
    title: "Artwork One",
    category: "Art",
    image: "/image/art01.jpg",
    description: "A captivating artwork showcasing creative expression and artistic vision.",
    details: [
      "Creative concept development",
      "Visual composition",
      "Color harmony",
      "Artistic expression"
    ],
    year: "2024"
  },
  {
    id: 2,
    title: "Artwork Two",
    category: "Art",
    image: "/image/art02.jpg",
    description: "An expressive piece that explores contemporary themes and visual storytelling.",
    details: [
      "Conceptual design",
      "Visual narrative",
      "Style exploration",
      "Creative execution"
    ],
    year: "2024"
  },
  {
    id: 3,
    title: "Artwork Three",
    category: "Art",
    image: "/image/art03.jpg",
    description: "A unique artistic creation that blends traditional and modern techniques.",
    details: [
      "Technique innovation",
      "Style fusion",
      "Visual impact",
      "Artistic integrity"
    ],
    year: "2024"
  },
  {
    id: 4,
    title: "Artwork Four",
    category: "Art",
    image: "/image/art04.jpg",
    description: "An inspiring artwork that captures emotion and movement through visual elements.",
    details: [
      "Emotional expression",
      "Dynamic composition",
      "Color dynamics",
      "Visual rhythm"
    ],
    year: "2024"
  },
  {
    id: 5,
    title: "Artwork Five",
    category: "Art",
    image: "/image/art05.jpg",
    description: "A striking piece that demonstrates mastery of form and composition.",
    details: [
      "Form exploration",
      "Compositional balance",
      "Visual harmony",
      "Artistic mastery"
    ],
    year: "2023"
  },
  {
    id: 6,
    title: "Artwork Six",
    category: "Art",
    image: "/image/art06.jpg",
    description: "An innovative artwork pushing the boundaries of visual expression.",
    details: [
      "Boundary pushing",
      "Innovation",
      "Visual experimentation",
      "Creative risk-taking"
    ],
    year: "2023"
  },
  {
    id: 7,
    title: "Artwork Seven",
    category: "Art",
    image: "/image/art07.jpg",
    description: "A thoughtful piece that invites contemplation and reflection.",
    details: [
      "Contemplative design",
      "Reflective quality",
      "Visual depth",
      "Meaningful expression"
    ],
    year: "2023"
  },
  {
    id: 8,
    title: "Artwork Eight",
    category: "Art",
    image: "/image/art08.jpg",
    description: "A vibrant artwork full of energy and life.",
    details: [
      "Energetic composition",
      "Vibrant colors",
      "Dynamic movement",
      "Lively expression"
    ],
    year: "2023"
  },
  {
    id: 9,
    title: "Artwork Nine",
    category: "Art",
    image: "/image/art09.jpg",
    description: "An elegant piece demonstrating refined aesthetic sensibilities.",
    details: [
      "Elegant design",
      "Refined aesthetics",
      "Sophisticated composition",
      "Artistic refinement"
    ],
    year: "2023"
  },
  {
    id: 10,
    title: "Artwork Ten",
    category: "Art",
    image: "/image/art10.jpg",
    description: "A powerful artwork that makes a bold visual statement.",
    details: [
      "Bold statement",
      "Powerful imagery",
      "Strong composition",
      "Visual impact"
    ],
    year: "2024"
  },
  {
    id: 11,
    title: "Artwork Eleven",
    category: "Art",
    image: "/image/art11.jpg",
    description: "A delicate piece showcasing attention to detail and craftsmanship.",
    details: [
      "Attention to detail",
      "Craftsmanship",
      "Delicate composition",
      "Fine execution"
    ],
    year: "2024"
  },
  {
    id: 12,
    title: "Artwork Twelve",
    category: "Art",
    image: "/image/art12.jpg",
    description: "An abstract work exploring the relationship between form and space.",
    details: [
      "Abstract exploration",
      "Form and space",
      "Visual relationships",
      "Abstract expression"
    ],
    year: "2024"
  },
  {
    id: 13,
    title: "Artwork Thirteen",
    category: "Art",
    image: "/image/art13.jpg",
    description: "A compelling artwork that draws the viewer into its visual world.",
    details: [
      "Compelling imagery",
      "Visual engagement",
      "Immersive quality",
      "Artistic vision"
    ],
    year: "2023"
  },
  {
    id: 14,
    title: "Artwork Fourteen",
    category: "Art",
    image: "/image/art14.jpg",
    description: "A masterful piece that represents the culmination of artistic exploration.",
    details: [
      "Masterful execution",
      "Artistic culmination",
      "Visual excellence",
      "Creative achievement"
    ],
    year: "2024"
  },
];

export function getWorkById(id: number): Work | undefined {
  return works.find(work => work.id === id);
}

