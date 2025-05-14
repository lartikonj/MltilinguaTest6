import { Article, Subject } from '@shared/schema';

// Static data for deployment to Vercel/Netlify
// This will be used as a replacement for the backend API

// Get all subjects
export async function getSubjects(): Promise<Subject[]> {
  return [
    { id: 1, name: "Technology", slug: "technology", icon: "ri-computer-line", articleCount: 1 },
    { id: 2, name: "Science", slug: "science", icon: "ri-flask-line", articleCount: 2 },
    { id: 3, name: "Environment", slug: "environment", icon: "ri-plant-line", articleCount: 1 },
    { id: 4, name: "Health", slug: "health", icon: "ri-heart-pulse-line", articleCount: 1 },
    { id: 5, name: "Arts & Culture", slug: "arts-culture", icon: "ri-palette-line", articleCount: 1 },
    { id: 6, name: "Travel", slug: "travel", icon: "ri-plane-line", articleCount: 1 }
  ];
}

// Get subject by slug
export async function getSubjectBySlug(slug: string): Promise<Subject | undefined> {
  const subjects = await getSubjects();
  return subjects.find(subject => subject.slug === slug);
}

// Get all articles
export async function getArticles(): Promise<Article[]> {
  return [
    // existing articles (1-4)
    // ...

    {
      id: 5,
      title: "The Wonders of Quantum Entanglement",
      slug: "quantum-entanglement-wonders",
      excerpt: "Discover how particles can be connected across vast distances, challenging our understanding of reality.",
      content: "Quantum entanglement is a physical phenomenon that occurs when pairs or groups of particles interact in such a way that the state of one particle is directly related to the state of another, no matter the distance between them. This article delves into the implications and mysteries of entanglement in modern physics...",
      imageUrl: "https://images.unsplash.com/photo-1636624497585-2a57db31dcb2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      readTime: 7,
      subjectId: 2,
      author: "Dr. Neil Thomson",
      authorImage: "https://images.unsplash.com/photo-1603415526960-f7e0328f55f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      publishDate: new Date("2023-09-21"),
      translations: {
        en: {
          title: "The Wonders of Quantum Entanglement",
          excerpt: "Discover how particles can be connected across vast distances, challenging our understanding of reality.",
          content: "Quantum entanglement is a physical phenomenon that occurs when pairs or groups of particles interact..."
        },
        fr: {
          title: "Les Merveilles de l’Intrication Quantique",
          excerpt: "Découvrez comment des particules peuvent être connectées à de vastes distances, remettant en question notre compréhension de la réalité.",
          content: "L’intrication quantique est un phénomène physique qui se produit lorsque des paires ou des groupes de particules interagissent..."
        }
      },
      availableLanguages: ["en", "fr"],
      featured: false
    },
    {
      id: 6,
      title: "Street Art as Political Protest",
      slug: "street-art-political-protest",
      excerpt: "Street art has emerged as a powerful medium for political expression and social change. Discover how artists are using public spaces to challenge authority.",
      content: "From graffiti in authoritarian states to murals advocating for equality, street art serves as a vibrant canvas for political messages. This article explores the history and current landscape of protest art around the world...",
      imageUrl: "https://images.unsplash.com/photo-1508919801845-fc2ae1bc2a28?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      readTime: 5,
      subjectId: 5,
      author: "Amina Khalil",
      authorImage: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      publishDate: new Date("2023-08-10"),
      translations: {
        en: {
          title: "Street Art as Political Protest",
          excerpt: "Street art has emerged as a powerful medium for political expression and social change.",
          content: "From graffiti in authoritarian states to murals advocating for equality..."
        },
        ar: {
          title: "فن الشارع كاحتجاج سياسي",
          excerpt: "ظهر فن الشارع كوسيلة قوية للتعبير السياسي والتغيير الاجتماعي.",
          content: "من الجرافيتي في الدول الاستبدادية إلى الجداريات التي تدعو إلى المساواة..."
        }
      },
      availableLanguages: ["en", "ar"],
      featured: false
    },
    {
      id: 7,
      title: "CRISPR and the Ethics of Gene Editing",
      slug: "crispr-ethics-gene-editing",
      excerpt: "Gene editing technologies like CRISPR hold the potential to cure genetic diseases but raise important ethical questions.",
      content: "The ability to precisely edit genes has opened new frontiers in medicine and biology. But with great power comes great responsibility. This article discusses the ethical concerns surrounding the use of CRISPR, from designer babies to ecological risks...",
      imageUrl: "https://images.unsplash.com/photo-1588776814546-ec7e180de7c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      readTime: 9,
      subjectId: 2,
      author: "Prof. Emily Nakamura",
      authorImage: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      publishDate: new Date("2023-10-01"),
      translations: {
        en: {
          title: "CRISPR and the Ethics of Gene Editing",
          excerpt: "Gene editing technologies like CRISPR hold the potential to cure genetic diseases...",
          content: "The ability to precisely edit genes has opened new frontiers..."
        },
        es: {
          title: "CRISPR y la Ética de la Edición Genética",
          excerpt: "Las tecnologías de edición genética como CRISPR tienen el potencial de curar enfermedades genéticas...",
          content: "La capacidad de editar genes con precisión ha abierto nuevas fronteras..."
        }
      },
      availableLanguages: ["en", "es"],
      featured: true
    }
  ];
}

// Get featured articles
export async function getFeaturedArticles(): Promise<Article[]> {
  const articles = await getArticles();
  return articles.filter(article => article.featured);
}

// Get recent articles
export async function getRecentArticles(limit: number = 5): Promise<Article[]> {
  const articles = await getArticles();
  return articles
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, limit);
}

// Get articles by subject ID
export async function getArticlesBySubject(subjectId: number): Promise<Article[]> {
  const articles = await getArticles();
  return articles.filter(article => article.subjectId === subjectId);
}

// Get article by slug
export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const articles = await getArticles();
  return articles.find(article => article.slug === slug);
}
