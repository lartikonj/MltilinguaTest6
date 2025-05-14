import { 
  users, type User, type InsertUser,
  subjects, type Subject, type InsertSubject,
  articles, type Article, type InsertArticle
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Subject methods
  getAllSubjects(): Promise<Subject[]>;
  getSubjectBySlug(slug: string): Promise<Subject | undefined>;
  getSubject(id: number): Promise<Subject | undefined>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  
  // Article methods
  getAllArticles(): Promise<Article[]>;
  getFeaturedArticles(): Promise<Article[]>;
  getRecentArticles(limit: number): Promise<Article[]>;
  getArticlesBySubject(subjectId: number): Promise<Article[]>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  getArticle(id: number): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private subjects: Map<number, Subject>;
  private articles: Map<number, Article>;
  currentUserId: number;
  currentSubjectId: number;
  currentArticleId: number;

  constructor() {
    this.users = new Map();
    this.subjects = new Map();
    this.articles = new Map();
    this.currentUserId = 1;
    this.currentSubjectId = 1;
    this.currentArticleId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Subject methods
  async getAllSubjects(): Promise<Subject[]> {
    return Array.from(this.subjects.values());
  }
  
  async getSubjectBySlug(slug: string): Promise<Subject | undefined> {
    return Array.from(this.subjects.values()).find(
      (subject) => subject.slug === slug,
    );
  }
  
  async getSubject(id: number): Promise<Subject | undefined> {
    return this.subjects.get(id);
  }
  
  async createSubject(insertSubject: InsertSubject): Promise<Subject> {
    const id = this.currentSubjectId++;
    const subject: Subject = { ...insertSubject, id };
    this.subjects.set(id, subject);
    return subject;
  }
  
  // Article methods
  async getAllArticles(): Promise<Article[]> {
    return Array.from(this.articles.values());
  }
  
  async getFeaturedArticles(): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.featured)
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  }
  
  async getRecentArticles(limit: number): Promise<Article[]> {
    return Array.from(this.articles.values())
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      .slice(0, limit);
  }
  
  async getArticlesBySubject(subjectId: number): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.subjectId === subjectId)
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  }
  
  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    return Array.from(this.articles.values()).find(
      (article) => article.slug === slug,
    );
  }
  
  async getArticle(id: number): Promise<Article | undefined> {
    return this.articles.get(id);
  }
  
  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.currentArticleId++;
    const article: Article = { ...insertArticle, id };
    this.articles.set(id, article);
    
    // Update the article count for the subject
    const subject = this.subjects.get(article.subjectId);
    if (subject) {
      subject.articleCount = (subject.articleCount || 0) + 1;
      this.subjects.set(subject.id, subject);
    }
    
    return article;
  }
  
  // Initialize with sample data
  private initializeData() {
    // Add subjects
    const subjects: InsertSubject[] = [
      { name: "Technology", slug: "technology", icon: "ri-computer-line", articleCount: 0 },
      { name: "Science", slug: "science", icon: "ri-flask-line", articleCount: 0 },
      { name: "Environment", slug: "environment", icon: "ri-plant-line", articleCount: 0 },
      { name: "Health", slug: "health", icon: "ri-heart-pulse-line", articleCount: 0 },
      { name: "Arts & Culture", slug: "arts-culture", icon: "ri-palette-line", articleCount: 0 },
      { name: "Travel", slug: "travel", icon: "ri-plane-line", articleCount: 0 },
    ];
    
    subjects.forEach(subject => {
      this.createSubject(subject);
    });
    
    // Add articles
    const articles: InsertArticle[] = [
      {
        title: "The Future of Artificial Intelligence",
        slug: "future-of-artificial-intelligence",
        excerpt: "Explore how AI is transforming industries and our daily lives. From smart assistants to autonomous vehicles, the impact is revolutionary.",
        content: "Artificial Intelligence (AI) is rapidly evolving and changing the way we interact with technology and each other. This article explores the current state of AI and what the future might hold...",
        imageUrl: "https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        readTime: 5,
        subjectId: 1, // Technology
        author: "Alex Johnson",
        authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        publishDate: new Date("2023-05-15"),
        translations: {
          en: {
            title: "The Future of Artificial Intelligence",
            excerpt: "Explore how AI is transforming industries and our daily lives. From smart assistants to autonomous vehicles, the impact is revolutionary.",
            content: "Artificial Intelligence (AI) is rapidly evolving and changing the way we interact with technology and each other. This article explores the current state of AI and what the future might hold..."
          },
          es: {
            title: "El Futuro de la Inteligencia Artificial",
            excerpt: "Explora cómo la IA está transformando industrias y nuestra vida diaria. Desde asistentes inteligentes hasta vehículos autónomos, el impacto es revolucionario.",
            content: "La Inteligencia Artificial (IA) está evolucionando rápidamente y cambiando la forma en que interactuamos con la tecnología y entre nosotros. Este artículo explora el estado actual de la IA y lo que podría deparar el futuro..."
          },
          fr: {
            title: "L'Avenir de l'Intelligence Artificielle",
            excerpt: "Découvrez comment l'IA transforme les industries et notre vie quotidienne. Des assistants intelligents aux véhicules autonomes, l'impact est révolutionnaire.",
            content: "L'Intelligence Artificielle (IA) évolue rapidement et change la façon dont nous interagissons avec la technologie et entre nous. Cet article explore l'état actuel de l'IA et ce que l'avenir pourrait réserver..."
          }
        },
        availableLanguages: ["en", "es", "fr"],
        featured: true
      },
      {
        title: "Hidden Gems: 10 Breathtaking Destinations",
        slug: "hidden-gems-breathtaking-destinations",
        excerpt: "Discover less-known but stunning places around the world that will take your breath away. These destinations offer unique experiences away from tourist crowds.",
        content: "While popular destinations like Paris and Tokyo get all the attention, there are countless breathtaking places around the world that remain relatively unknown to most travelers...",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        readTime: 8,
        subjectId: 6, // Travel
        author: "Maria González",
        authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        publishDate: new Date("2023-06-03"),
        translations: {
          en: {
            title: "Hidden Gems: 10 Breathtaking Destinations",
            excerpt: "Discover less-known but stunning places around the world that will take your breath away. These destinations offer unique experiences away from tourist crowds.",
            content: "While popular destinations like Paris and Tokyo get all the attention, there are countless breathtaking places around the world that remain relatively unknown to most travelers..."
          },
          fr: {
            title: "Joyaux Cachés : 10 Destinations à Couper le Souffle",
            excerpt: "Découvrez des endroits moins connus mais magnifiques à travers le monde qui vous couperont le souffle. Ces destinations offrent des expériences uniques loin des foules touristiques.",
            content: "Alors que des destinations populaires comme Paris et Tokyo attirent toute l'attention, il existe d'innombrables endroits à couper le souffle à travers le monde qui restent relativement inconnus de la plupart des voyageurs..."
          },
          ar: {
            title: "كنوز مخفية: 10 وجهات خلابة",
            excerpt: "اكتشف أماكن أقل شهرة ولكنها مذهلة حول العالم ستأخذ أنفاسك. تقدم هذه الوجهات تجارب فريدة بعيدًا عن حشود السياح.",
            content: "بينما تحظى الوجهات الشهيرة مثل باريس وطوكيو بكل الاهتمام، هناك عدد لا يحصى من الأماكن الخلابة حول العالم التي لا تزال غير معروفة نسبيًا لمعظم المسافرين..."
          }
        },
        availableLanguages: ["en", "fr", "ar"],
        featured: true
      },
      {
        title: "Nutrition Myths Debunked by Science",
        slug: "nutrition-myths-debunked",
        excerpt: "Separate fact from fiction in the world of nutrition. We examine common food myths and present the scientific evidence behind healthy eating.",
        content: "In the age of social media and quick-fix diets, nutrition misinformation spreads rapidly. This article examines some of the most persistent nutrition myths and what science actually says...",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        readTime: 6,
        subjectId: 4, // Health
        author: "Dr. Sarah Chen",
        authorImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        publishDate: new Date("2023-04-29"),
        translations: {
          en: {
            title: "Nutrition Myths Debunked by Science",
            excerpt: "Separate fact from fiction in the world of nutrition. We examine common food myths and present the scientific evidence behind healthy eating.",
            content: "In the age of social media and quick-fix diets, nutrition misinformation spreads rapidly. This article examines some of the most persistent nutrition myths and what science actually says..."
          },
          es: {
            title: "Mitos Nutricionales Desmentidos por la Ciencia",
            excerpt: "Separa los hechos de la ficción en el mundo de la nutrición. Examinamos mitos alimentarios comunes y presentamos la evidencia científica detrás de una alimentación saludable.",
            content: "En la era de las redes sociales y las dietas de solución rápida, la desinformación nutricional se propaga rápidamente. Este artículo examina algunos de los mitos nutricionales más persistentes y lo que la ciencia realmente dice..."
          },
          fr: {
            title: "Mythes Nutritionnels Démystifiés par la Science",
            excerpt: "Séparez les faits de la fiction dans le monde de la nutrition. Nous examinons les mythes alimentaires courants et présentons les preuves scientifiques derrière une alimentation saine.",
            content: "À l'ère des médias sociaux et des régimes à solution rapide, la désinformation nutritionnelle se propage rapidement. Cet article examine certains des mythes nutritionnels les plus persistants et ce que la science dit réellement..."
          }
        },
        availableLanguages: ["en", "es", "fr"],
        featured: true
      },
      {
        title: "The Evolution of Urban Spaces: How Cities Are Adapting to Climate Change",
        slug: "evolution-urban-spaces-climate-change",
        excerpt: "Cities worldwide are implementing innovative solutions to combat rising temperatures and extreme weather events. From green rooftops to urban forests, discover how urban planning is evolving.",
        content: "As climate change intensifies, cities around the world are on the front lines of both its impacts and potential solutions. Urban areas are particularly vulnerable to rising temperatures...",
        imageUrl: "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=700",
        readTime: 12,
        subjectId: 3, // Environment
        author: "Elena Rodriguez",
        authorImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        publishDate: new Date("2023-07-08"),
        translations: {
          en: {
            title: "The Evolution of Urban Spaces: How Cities Are Adapting to Climate Change",
            excerpt: "Cities worldwide are implementing innovative solutions to combat rising temperatures and extreme weather events. From green rooftops to urban forests, discover how urban planning is evolving.",
            content: "As climate change intensifies, cities around the world are on the front lines of both its impacts and potential solutions. Urban areas are particularly vulnerable to rising temperatures..."
          },
          es: {
            title: "La Evolución de los Espacios Urbanos: Cómo las Ciudades se Adaptan al Cambio Climático",
            excerpt: "Las ciudades de todo el mundo están implementando soluciones innovadoras para combatir el aumento de las temperaturas y los fenómenos meteorológicos extremos. Descubre cómo está evolucionando la planificación urbana.",
            content: "A medida que el cambio climático se intensifica, las ciudades de todo el mundo están en primera línea tanto de sus impactos como de las posibles soluciones. Las áreas urbanas son particularmente vulnerables al aumento de las temperaturas..."
          },
          fr: {
            title: "L'Évolution des Espaces Urbains : Comment les Villes s'Adaptent au Changement Climatique",
            excerpt: "Les villes du monde entier mettent en œuvre des solutions innovantes pour lutter contre la hausse des températures et les phénomènes météorologiques extrêmes. Découvrez comment l'urbanisme évolue.",
            content: "Alors que le changement climatique s'intensifie, les villes du monde entier sont en première ligne de ses impacts et des solutions potentielles. Les zones urbaines sont particulièrement vulnérables à la hausse des températures..."
          },
          ar: {
            title: "تطور المساحات الحضرية: كيف تتكيف المدن مع تغير المناخ",
            excerpt: "تنفذ المدن في جميع أنحاء العالم حلولًا مبتكرة لمكافحة ارتفاع درجات الحرارة والظواهر الجوية المتطرفة. اكتشف كيف يتطور التخطيط الحضري.",
            content: "مع تزايد حدة تغير المناخ، تقف المدن حول العالم في الخطوط الأمامية لكل من تأثيراته والحلول المحتملة. المناطق الحضرية معرضة بشكل خاص لارتفاع درجات الحرارة..."
          }
        },
        availableLanguages: ["en", "es", "fr", "ar"],
        featured: false
      }
      
    ];
    
    articles.forEach(article => {
      this.createArticle(article);
    });
  }
}

export const storage = new MemStorage();
