export interface Project {
  id: string;
  title: string;
  style: string;
  materials: string;
  location: string;
  image: string;
  size: "tall" | "wide" | "square";
  year: string;
}

export const projects: Project[] = [
  {
    id: "onyx-residence",
    title: "Onyx Residence Kitchen",
    style: "Modern Minimalist",
    materials: "Dark Walnut, Brushed Brass, Matte Black",
    location: "Beverly Hills, CA",
    image: "/images/project-1.jpg",
    size: "wide",
    year: "2025",
  },
  {
    id: "linen-house",
    title: "Linen House Kitchen",
    style: "Scandinavian Luxury",
    materials: "White Oak, Carrara Marble",
    location: "Aspen, CO",
    image: "/images/project-2.jpg",
    size: "tall",
    year: "2025",
  },
  {
    id: "amber-loft",
    title: "Amber Loft Island",
    style: "Warm Contemporary",
    materials: "Rift-Sawn Oak, Bronze Fixtures",
    location: "Austin, TX",
    image: "/images/project-3.jpg",
    size: "square",
    year: "2024",
  },
  {
    id: "obsidian-penthouse",
    title: "Obsidian Penthouse",
    style: "Dark Architectural",
    materials: "Matte Black Lacquer, Smoked Oak",
    location: "Manhattan, NY",
    image: "/images/project-4.jpg",
    size: "wide",
    year: "2024",
  },
  {
    id: "walnut-wardrobe",
    title: "The Walnut Wardrobe",
    style: "Bespoke Joinery",
    materials: "American Walnut, Brass Inlay",
    location: "Malibu, CA",
    image: "/images/project-5.jpg",
    size: "tall",
    year: "2024",
  },
  {
    id: "still-water-bath",
    title: "Still Water Vanity",
    style: "Floating Minimalist",
    materials: "Walnut Veneer, Honed Stone",
    location: "Lake Tahoe, NV",
    image: "/images/project-6.jpg",
    size: "square",
    year: "2023",
  },
];
