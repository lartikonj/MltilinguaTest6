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
      // Technology articles
      {
        title: "The Rise of Quantum Computing",
        slug: "rise-quantum-computing",
        excerpt: "Explore the revolutionary potential of quantum computers and how they're reshaping our technological landscape.",
        content: "Quantum computing represents a fundamental shift in how we process information. Unlike classical computers that use bits, quantum computers leverage quantum bits or 'qubits' that can exist in multiple states simultaneously...",
        imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        readTime: 8,
        subjectId: 1,
        author: "Dr. Michael Chen",
        authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        publishDate: new Date("2023-10-15"),
        translations: {
          en: {
            title: "The Rise of Quantum Computing",
            excerpt: "Explore the revolutionary potential of quantum computers and how they're reshaping our technological landscape.",
            content: "Quantum computing represents a fundamental shift in how we process information...",
            notes: ["Quantum computers use qubits instead of classical bits", "Can solve complex problems exponentially faster", "Major tech companies investing heavily in quantum research"],
            resources: ["Introduction to Quantum Computing", "Latest Quantum Breakthroughs", "Quantum Computing Applications"]
          },
          es: {
            title: "El Auge de la Computación Cuántica",
            excerpt: "Explora el potencial revolucionario de las computadoras cuánticas y cómo están remodelando nuestro panorama tecnológico.",
            content: "La computación cuántica representa un cambio fundamental en cómo procesamos la información...",
            notes: ["Las computadoras cuánticas usan qubits en lugar de bits clásicos", "Pueden resolver problemas complejos exponencialmente más rápido", "Grandes empresas tecnológicas invierten en investigación cuántica"],
            resources: ["Introducción a la Computación Cuántica", "Últimos Avances Cuánticos", "Aplicaciones de la Computación Cuántica"]
          },
          fr: {
            title: "L'Essor de l'Informatique Quantique",
            excerpt: "Découvrez le potentiel révolutionnaire des ordinateurs quantiques et comment ils transforment notre paysage technologique.",
            content: "L'informatique quantique représente un changement fondamental dans notre façon de traiter l'information...",
            notes: ["Les ordinateurs quantiques utilisent des qubits au lieu de bits classiques", "Peuvent résoudre des problèmes complexes exponentiellement plus rapidement", "Les grandes entreprises technologiques investissent massivement dans la recherche quantique"],
            resources: ["Introduction à l'Informatique Quantique", "Dernières Avancées Quantiques", "Applications de l'Informatique Quantique"]
          },
          ar: {
            title: "صعود الحوسبة الكمية",
            excerpt: "اكتشف الإمكانات الثورية للحواسيب الكمية وكيف تعيد تشكيل مشهدنا التكنولوجي.",
            content: "تمثل الحوسبة الكمية تحولاً أساسياً في كيفية معالجتنا للمعلومات...",
            notes: ["تستخدم الحواسيب الكمية الكيوبتات بدلاً من البتات التقليدية", "يمكنها حل المشكلات المعقدة بشكل أسرع أسياً", "شركات التكنولوجيا الكبرى تستثمر بكثافة في البحث الكمي"],
            resources: ["مقدمة في الحوسبة الكمية", "أحدث الاختراقات الكمية", "تطبيقات الحوسبة الكمية"]
          }
        },
        availableLanguages: ["en", "es", "fr", "ar"],
        featured: true
      },
      // Science articles
      {
        title: "Breaking the Code of DNA",
        slug: "breaking-code-dna",
        excerpt: "Recent advancements in genetic research are revolutionizing our understanding of life itself.",
        content: "The discovery of DNA's structure was just the beginning. Today, scientists are not only reading but writing genetic code, opening new frontiers in medicine and biotechnology...",
        imageUrl: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        readTime: 7,
        subjectId: 2,
        author: "Dr. Sarah Williams",
        authorImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        publishDate: new Date("2023-10-01"),
        translations: {
          en: {
            title: "Breaking the Code of DNA",
            excerpt: "Recent advancements in genetic research are revolutionizing our understanding of life itself.",
            content: "The discovery of DNA's structure was just the beginning...",
            notes: ["DNA sequencing becoming more accessible", "CRISPR technology revolutionizing gene editing", "Implications for personalized medicine"],
            resources: ["Understanding DNA Structure", "Advances in Genetic Research", "Future of Gene Therapy"]
          },
          es: {
            title: "Descifrando el Código del ADN",
            excerpt: "Los recientes avances en la investigación genética están revolucionando nuestra comprensión de la vida misma.",
            content: "El descubrimiento de la estructura del ADN fue solo el comienzo...",
            notes: ["La secuenciación del ADN es cada vez más accesible", "La tecnología CRISPR revoluciona la edición genética", "Implicaciones para la medicina personalizada"],
            resources: ["Entendiendo la Estructura del ADN", "Avances en Investigación Genética", "Futuro de la Terapia Génica"]
          },
          fr: {
            title: "Décoder l'ADN",
            excerpt: "Les récentes avancées en recherche génétique révolutionnent notre compréhension de la vie elle-même.",
            content: "La découverte de la structure de l'ADN n'était que le début...",
            notes: ["Le séquençage de l'ADN devient plus accessible", "La technologie CRISPR révolutionne l'édition génétique", "Implications pour la médecine personnalisée"],
            resources: ["Comprendre la Structure de l'ADN", "Avancées en Recherche Génétique", "Avenir de la Thérapie Génique"]
          },
          ar: {
            title: "فك شفرة الحمض النووي",
            excerpt: "التطورات الأخيرة في البحث الجيني تحدث ثورة في فهمنا للحياة نفسها.",
            content: "كان اكتشاف بنية الحمض النووي مجرد البداية...",
            notes: ["تسلسل الحمض النووي يصبح أكثر سهولة", "تقنية كريسبر تحدث ثورة في تحرير الجينات", "آثار على الطب الشخصي"],
            resources: ["فهم بنية الحمض النووي", "التقدم في البحث الجيني", "مستقبل العلاج الجيني"]
          }
        },
        availableLanguages: ["en", "es", "fr", "ar"],
        featured: true
      },
      // Science articles
{
  title: "The Water Cycle — A Clear and Simple Explanation",
  slug: "water-cycle-explained",
  excerpt: "Discover how water moves through nature in a never-ending cycle of evaporation, condensation, precipitation, and collection.",
  content: "Water on Earth is always moving — it’s in a continuous journey known as the water cycle. This natural system includes four key stages: evaporation (when the sun heats water turning it into vapor), condensation (when water vapor cools and forms clouds), precipitation (when water falls as rain, snow, or hail), and collection (where water gathers in oceans, rivers, lakes, and underground). This cycle supports all life on Earth and helps regulate climate, making it one of the planet’s most vital processes.",
  imageUrl: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
  readTime: 5,
  subjectId: 2,
  author: "Multilingua Science Team",
  authorImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
  publishDate: new Date("2023-12-01"),
  translations: {
    en: {
      title: "The Water Cycle — A Clear and Simple Explanation",
      excerpt: "Discover how water moves through nature in a never-ending cycle of evaporation, condensation, precipitation, and collection.",
      content: `The water cycle, also known as the hydrological cycle, is nature’s way of recycling water. It is a continuous and essential process that sustains life on Earth.

**1. Evaporation**  
The cycle begins with the sun heating up water from oceans, rivers, and lakes. This causes the water to evaporate, turning it into vapor that rises into the atmosphere.

**2. Condensation**  
As the water vapor rises and cools, it turns back into tiny droplets, forming clouds. This process is known as condensation.

**3. Precipitation**  
When the clouds become heavy with water, the droplets fall back to the Earth as precipitation — in the form of rain, snow, sleet, or hail.

**4. Collection**  
The fallen water collects in bodies of water such as rivers, lakes, and oceans, and some seeps underground, replenishing aquifers. Eventually, this water may evaporate again, and the cycle continues.

The water cycle helps regulate Earth’s temperature and supports ecosystems, agriculture, and weather patterns. It's an invisible engine that makes life possible.`,
      notes: [
        "The water cycle is powered by solar energy.",
        "It connects oceans, the atmosphere, and the land.",
        "Essential for drinking water, agriculture, and weather systems."
      ],
      resources: [
        "NASA Earth Science: https://earthobservatory.nasa.gov/features/Water",
        "USGS Water Cycle: https://www.usgs.gov/special-topics/water-science-school/science/water-cycle",
        "BBC Bitesize: https://www.bbc.co.uk/bitesize/topics/zkgg87h/articles/z3wpp39"
      ]
    },
    fr: {
      title: "Le cycle de l’eau — Une explication claire et accessible",
      excerpt: "Découvrez comment l’eau circule dans la nature : évaporation, condensation, précipitations et collecte.",
      content: `Le cycle de l’eau, aussi appelé cycle hydrologique, est le moyen par lequel la nature recycle l’eau. C’est un processus continu et essentiel qui soutient la vie sur Terre.

**1. Évaporation**  
Le cycle commence lorsque le soleil chauffe l’eau des océans, des rivières et des lacs. L’eau s’évapore alors et se transforme en vapeur qui monte dans l’atmosphère.

**2. Condensation**  
En montant, la vapeur d’eau se refroidit et se transforme en fines gouttelettes qui forment les nuages. C’est la condensation.

**3. Précipitations**  
Lorsque les nuages deviennent trop chargés en eau, celle-ci retombe sur Terre sous forme de précipitations : pluie, neige, grêle ou bruine.

**4. Collecte**  
L’eau tombée s’accumule dans les rivières, les lacs et les océans. Une partie s’infiltre aussi dans le sol pour alimenter les nappes phréatiques. Ensuite, l’eau peut de nouveau s’évaporer, et le cycle recommence.

Ce cycle régule la température de la Terre, nourrit les écosystèmes, soutient l’agriculture et influence les conditions météorologiques. C’est un mécanisme naturel indispensable à la vie.`,
      notes: [
        "Le cycle de l’eau est alimenté par l’énergie solaire.",
        "Il relie les océans, l’atmosphère et la terre.",
        "Essentiel pour l’eau potable, l’agriculture et les systèmes météorologiques."
      ],
      resources: [
        "CNRS : https://www.insu.cnrs.fr/fr/le-cycle-de-leau",
        "Futura Sciences : https://www.futura-sciences.com/planete/definitions/developpement-durable-cycle-eau-1531/"
      ]
    },
    ar: {
      title: "دورة الماء — شرح مبسّط وواضح",
      excerpt: "اكتشف كيف يتحرك الماء في الطبيعة من خلال التبخر والتكاثف والهطول والتجمع.",
      content: `تُعرف دورة الماء، أو الدورة الهيدرولوجية، بأنها الطريقة التي تُعيد بها الطبيعة تدوير المياه. إنها عملية مستمرة وأساسية تدعم الحياة على الأرض.

**1. التبخر**  
تبدأ الدورة عندما تسخن الشمس الماء الموجود في المحيطات والأنهار والبحيرات، مما يؤدي إلى تبخره وتحوله إلى بخار يصعد إلى الغلاف الجوي.

**2. التكاثف**  
عند صعود بخار الماء ولقائه بالهواء البارد، يتكاثف ويتحول إلى قطرات صغيرة تُشكّل السحب.

**3. الهطول**  
عندما تصبح السحب ممتلئة بالماء، ينزل على شكل أمطار أو ثلوج أو برد.

**4. التجمع**  
يتجمع الماء في الأنهار والبحيرات والمحيطات، وقد يتسرب جزء منه إلى باطن الأرض ليغذي المياه الجوفية. بعد ذلك، يمكن أن يتبخر مرة أخرى ويبدأ الدورة من جديد.

تُعد هذه الدورة ضرورية لتنظيم مناخ الأرض، ودعم الزراعة، وتوفير مياه الشرب. إنها آلية طبيعية تحافظ على الحياة.`,
      notes: [
        "تعتمد دورة الماء على طاقة الشمس.",
        "تربط بين المحيطات والغلاف الجوي واليابسة.",
        "ضرورية لمياه الشرب والزراعة والطقس."
      ],
      resources: [
        "اليونسكو: https://ar.unesco.org/themes/water-security/hydrology",
        "الجزيرة: https://www.aljazeera.net/encyclopedia/events/2015/3/22/دورة-الماء"
      ]
    },
    es: {
      title: "El ciclo del agua — Explicado de forma clara y sencilla",
      excerpt: "Aprende cómo el agua se mueve en la naturaleza a través de evaporación, condensación, precipitación y recolección.",
      content: `El ciclo del agua, también llamado ciclo hidrológico, es el proceso mediante el cual la naturaleza recicla el agua. Es un ciclo constante y vital para la vida en la Tierra.

**1. Evaporación**  
El sol calienta el agua de los océanos, ríos y lagos, lo que provoca su evaporación y su transformación en vapor que sube a la atmósfera.

**2. Condensación**  
A medida que el vapor se eleva y se enfría, se condensa y forma pequeñas gotas que crean las nubes.

**3. Precipitación**  
Cuando las nubes están cargadas de agua, esta cae en forma de lluvia, nieve o granizo.

**4. Recolección**  
El agua caída se acumula en ríos, lagos, océanos o se filtra al subsuelo. Posteriormente, puede volver a evaporarse y repetir el ciclo.

Este ciclo regula el clima, mantiene los ecosistemas, permite la agricultura y garantiza el agua potable. Es una maravilla natural esencial para la vida.`,
      notes: [
        "El ciclo del agua es impulsado por la energía solar.",
        "Conecta océanos, atmósfera y tierra.",
        "Esencial para el agua potable, la agricultura y el clima."
      ],
      resources: [
        "National Geographic: https://www.nationalgeographic.com.es/medio-ambiente/ciclo-del-agua_18171",
        "AEMET: https://www.aemet.es/es/conocermas/educacion/clima/ciclo_agua"
      ]
    }
  },
  availableLanguages: ["en", "fr", "ar", "es"],
  featured: true
},

      // Environment articles
      {
        title: "Ocean Conservation Breakthroughs",
        slug: "ocean-conservation-breakthroughs",
        excerpt: "Innovative solutions are emerging to protect our oceans and marine life from pollution and climate change.",
        content: "From plastic-eating bacteria to floating cleanup systems, scientists and engineers are developing groundbreaking solutions to address ocean pollution...",
        imageUrl: "https://images.unsplash.com/photo-1583842761844-be1a5348c70a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        readTime: 6,
        subjectId: 3,
        author: "Marina Costa",
        authorImage: "https://images.unsplash.com/photo-1619967161441-78b613c7dd09?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        publishDate: new Date("2023-09-28"),
        translations: {
          en: {
            title: "Ocean Conservation Breakthroughs",
            excerpt: "Innovative solutions are emerging to protect our oceans and marine life from pollution and climate change.",
            content: "From plastic-eating bacteria to floating cleanup systems...",
            notes: ["New technologies for ocean cleanup", "Marine ecosystem restoration projects", "Community-led conservation efforts"],
            resources: ["Ocean Conservation Guide", "Marine Protection Initiatives", "Sustainable Fishing Practices"]
          },
          es: {
            title: "Avances en la Conservación Oceánica",
            excerpt: "Están surgiendo soluciones innovadoras para proteger nuestros océanos y la vida marina de la contaminación y el cambio climático.",
            content: "Desde bacterias que comen plástico hasta sistemas flotantes de limpieza...",
            notes: ["Nuevas tecnologías para limpieza oceánica", "Proyectos de restauración de ecosistemas marinos", "Esfuerzos de conservación liderados por la comunidad"],
            resources: ["Guía de Conservación Oceánica", "Iniciativas de Protección Marina", "Prácticas de Pesca Sostenible"]
          },
          fr: {
            title: "Avancées en Conservation des Océans",
            excerpt: "Des solutions innovantes émergent pour protéger nos océans et la vie marine de la pollution et du changement climatique.",
            content: "Des bactéries mangeuses de plastique aux systèmes flottants de nettoyage...",
            notes: ["Nouvelles technologies pour le nettoyage des océans", "Projets de restauration des écosystèmes marins", "Efforts de conservation communautaires"],
            resources: ["Guide de Conservation des Océans", "Initiatives de Protection Marine", "Pratiques de Pêche Durable"]
          },
          ar: {
            title: "اختراقات في حماية المحيطات",
            excerpt: "تظهر حلول مبتكرة لحماية محيطاتنا والحياة البحرية من التلوث وتغير المناخ.",
            content: "من البكتيريا التي تأكل البلاستيك إلى أنظمة التنظيف العائمة...",
            notes: ["تقنيات جديدة لتنظيف المحيطات", "مشاريع استعادة النظم البيئية البحرية", "جهود الحفظ التي يقودها المجتمع"],
            resources: ["دليل حماية المحيطات", "مبادرات حماية البحار", "ممارسات الصيد المستدام"]
          }
        },
        availableLanguages: ["en", "es", "fr", "ar"],
        featured: false
      },
      // Health articles 
      {
        title: "Mindfulness and Mental Health",
        slug: "mindfulness-mental-health",
        excerpt: "Research shows how mindfulness practices can significantly improve mental well-being and reduce stress.",
        content: "Mindfulness meditation isn't just about relaxation - it's a powerful tool for mental health that's backed by scientific research...",
        imageUrl: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        readTime: 5,
        subjectId: 4,
        author: "Dr. Lisa Thompson",
        authorImage: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        publishDate: new Date("2023-09-15"),
        translations: {
          en: {
            title: "Mindfulness and Mental Health",
            excerpt: "Research shows how mindfulness practices can significantly improve mental well-being and reduce stress.",
            content: "Mindfulness meditation isn't just about relaxation...",
            notes: ["Regular practice reduces anxiety", "Improves focus and concentration", "Helps with emotional regulation"],
            resources: ["Getting Started with Mindfulness", "Scientific Research on Meditation", "Daily Mindfulness Exercises"]
          },
          es: {
            title: "Mindfulness y Salud Mental",
            excerpt: "La investigación muestra cómo las prácticas de mindfulness pueden mejorar significativamente el bienestar mental y reducir el estrés.",
            content: "La meditación mindfulness no se trata solo de relajación...",
            notes: ["La práctica regular reduce la ansiedad", "Mejora el enfoque y la concentración", "Ayuda con la regulación emocional"],
            resources: ["Comenzando con Mindfulness", "Investigación Científica sobre Meditación", "Ejercicios Diarios de Mindfulness"]
          },
          fr: {
            title: "Pleine Conscience et Santé Mentale",
            excerpt: "La recherche montre comment les pratiques de pleine conscience peuvent améliorer significativement le bien-être mental et réduire le stress.",
            content: "La méditation de pleine conscience n'est pas qu'une question de relaxation...",
            notes: ["La pratique régulière réduit l'anxiété", "Améliore la concentration", "Aide à la régulation émotionnelle"],
            resources: ["Débuter avec la Pleine Conscience", "Recherche Scientifique sur la Méditation", "Exercices Quotidiens de Pleine Conscience"]
          },
          ar: {
            title: "اليقظة الذهنية والصحة النفسية",
            excerpt: "تظهر الأبحاث كيف يمكن لممارسات اليقظة الذهنية أن تحسن بشكل كبير الصحة النفسية وتقلل التوتر.",
            content: "تأمل اليقظة الذهنية لا يتعلق فقط بالاسترخاء...",
            notes: ["الممارسة المنتظمة تقلل القلق", "تحسين التركيز والانتباه", "تساعد في التنظيم العاطفي"],
            resources: ["البدء مع اليقظة الذهنية", "البحث العلمي حول التأمل", "تمارين اليقظة اليومية"]
          }
        },
        availableLanguages: ["en", "es", "fr", "ar"],
        featured: false
      },
      // Arts & Culture articles
      {
        title: "Digital Art Revolution",
        slug: "digital-art-revolution",
        excerpt: "How NFTs and digital platforms are transforming the art world and creating new opportunities for artists.",
        content: "The digital art revolution is changing how we create, collect, and value art. From NFTs to virtual galleries, technology is opening new frontiers for artistic expression...",
        imageUrl: "https://images.unsplash.com/photo-1561735445-df7e2f9b504e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        readTime: 7,
        subjectId: 5,
        author: "Alex Rivera",
        authorImage: "https://images.unsplash.com/photo-1558203728-00f45181dd84?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        publishDate: new Date("2023-09-10"),
        translations: {
          en: {
            title: "Digital Art Revolution",
            excerpt: "How NFTs and digital platforms are transforming the art world and creating new opportunities for artists.",
            content: "The digital art revolution is changing how we create, collect, and value art...",
            notes: ["NFTs create new revenue streams", "Virtual galleries expand reach", "Digital tools democratize art creation"],
            resources: ["Understanding NFTs", "Digital Art Platforms", "Getting Started in Digital Art"]
          },
          es: {
            title: "La Revolución del Arte Digital",
            excerpt: "Cómo los NFTs y las plataformas digitales están transformando el mundo del arte y creando nuevas oportunidades para los artistas.",
            content: "La revolución del arte digital está cambiando cómo creamos, coleccionamos y valoramos el arte...",
            notes: ["Los NFTs crean nuevas fuentes de ingresos", "Las galerías virtuales amplían el alcance", "Las herramientas digitales democratizan la creación artística"],
            resources: ["Entendiendo los NFTs", "Plataformas de Arte Digital", "Comenzando en Arte Digital"]
          },
          fr: {
            title: "La Révolution de l'Art Numérique",
            excerpt: "Comment les NFT et les plateformes numériques transforment le monde de l'art et créent de nouvelles opportunités pour les artistes.",
            content: "La révolution de l'art numérique change notre façon de créer, collectionner et valoriser l'art...",
            notes: ["Les NFT créent de nouvelles sources de revenus", "Les galeries virtuelles élargissent la portée", "Les outils numériques démocratisent la création artistique"],
            resources: ["Comprendre les NFT", "Plateformes d'Art Numérique", "Débuter dans l'Art Numérique"]
          },
          ar: {
            title: "ثورة الفن الرقمي",
            excerpt: "كيف تعمل الرموز غير القابلة للاستبدال والمنصات الرقمية على تحويل عالم الفن وخلق فرص جديدة للفنانين.",
            content: "ثورة الفن الرقمي تغير كيفية إنشائنا وجمعنا وتقييمنا للفن...",
            notes: ["تخلق NFTs مصادر دخل جديدة", "المعارض الافتراضية توسع النطاق", "الأدوات الرقمية تجعل إنشاء الفن ديمقراطياً"],
            resources: ["فهم NFTs", "منصات الفن الرقمي", "البدء في الفن الرقمي"]
          }
        },
        availableLanguages: ["en", "es", "fr", "ar"],
        featured: false
      },
      // Travel articles
      {
        title: "Sustainable Tourism Trends",
        slug: "sustainable-tourism-trends",
        excerpt: "Discover how eco-friendly travel practices are shaping the future of tourism and protecting destinations worldwide.",
        content: "Sustainable tourism is more than just a trend - it's a necessary evolution in how we explore our world. From carbon-neutral accommodations to community-based tourism...",
        imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        readTime: 6,
        subjectId: 6,
        author: "Emma Wilson",
        authorImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        publishDate: new Date("2023-09-05"),
        translations: {
          en: {
            title: "Sustainable Tourism Trends",
            excerpt: "Discover how eco-friendly travel practices are shaping the future of tourism and protecting destinations worldwide.",
            content: "Sustainable tourism is more than just a trend - it's a necessary evolution in how we explore our world...",
            notes: ["Rise of eco-friendly accommodations", "Community-based tourism growing", "Carbon offset programs becoming standard"],
            resources: ["Eco-Tourism Guide", "Sustainable Travel Tips", "Green Accommodation Directory"]
          },
          es: {
            title: "Tendencias en Turismo Sostenible",
            excerpt: "Descubre cómo las prácticas de viaje ecológicas están dando forma al futuro del turismo y protegiendo destinos en todo el mundo.",
            content: "El turismo sostenible es más que una tendencia - es una evolución necesaria en cómo exploramos nuestro mundo...",
            notes: ["Aumento de alojamientos ecológicos", "Crecimiento del turismo comunitario", "Programas de compensación de carbono se vuelven estándar"],
            resources: ["Guía de Ecoturismo", "Consejos de Viaje Sostenible", "Directorio de Alojamientos Verdes"]
          },
          fr: {
            title: "Tendances du Tourisme Durable",
            excerpt: "Découvrez comment les pratiques de voyage écologiques façonnent l'avenir du tourisme et protègent les destinations dans le monde entier.",
            content: "Le tourisme durable est plus qu'une tendance - c'est une évolution nécessaire dans notre façon d'explorer le monde...",
            notes: ["Essor des hébergements écologiques", "Croissance du tourisme communautaire", "Les programmes de compensation carbone deviennent la norme"],
            resources: ["Guide d'Écotourisme", "Conseils de Voyage Durable", "Répertoire d'Hébergements Verts"]
          },
          ar: {
            title: "اتجاهات السياحة المستدامة",
            excerpt: "اكتشف كيف تشكل ممارسات السفر الصديقة للبيئة مستقبل السياحة وتحمي الوجهات في جميع أنحاء العالم.",
            content: "السياحة المستدامة أكثر من مجرد اتجاه - إنها تطور ضروري في كيفية استكشافنا لعالمنا...",
            notes: ["ازدهار أماكن الإقامة الصديقة للبيئة", "نمو السياحة المجتمعية", "برامج تعويض الكربون تصبح معياراً"],
            resources: ["دليل السياحة البيئية", "نصائح السفر المستدام", "دليل الإقامة الخضراء"]
          }
        },
        availableLanguages: ["en", "es", "fr", "ar"],
        featured: false
      },
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
