import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Default translations for UI elements
const resources = {
  en: {
    translation: {
      // Navigation
      'nav.home': 'Home',
      'nav.subjects': 'Subjects',
      'nav.popular': 'Popular',
      'nav.recent': 'Recent',
      'nav.about': 'About',
      
      // Language names
      'english': 'English',
      'french': 'French',
      'spanish': 'Spanish',
      'arabic': 'Arabic',
      
      // About page
      'about': {
        'title': 'About MultiLingua',
        'mission': {
          'title': 'Our Mission',
          'content': 'MultiLingua bridges language barriers by providing high-quality educational content in multiple languages, making knowledge accessible to all.'
        },
        'values': {
          'accessibility': 'Make knowledge accessible to everyone',
          'quality': 'Maintain high-quality, accurate content',
          'diversity': 'Celebrate linguistic and cultural diversity',
          'innovation': 'Continuously improve the learning experience'
        },
        'features': {
          'title': 'Key Features',
          'multilingual': {
            'title': 'Multilingual Content',
            'description': 'Read the same article in different languages to enhance comprehension.'
          },
          'subjects': {
            'title': 'Diverse Subjects',
            'description': 'Explore technology, science, health, arts, culture and travel.'
          },
          'learning': {
            'title': 'Language Learning',
            'description': 'Compare translations to improve your language skills.'
          }
        },
        'stats': {
          'languages': 'Languages',
          'articles': 'Articles',
          'subjects': 'Subjects',
          'users': 'Active Learners'
        },
        'cta': {
          'explore': 'Explore Subjects',
          'read': 'Start Reading'
        }
      },
      
      // Subject names
      'technology': 'Technology',
      'science': 'Science',
      'environment': 'Environment',
      'health': 'Health',
      'arts-culture': 'Arts & Culture',
      'travel': 'Travel',
      
      // Homepage
      'hero.title': 'Discover Knowledge Across Languages',
      'hero.subtitle': 'Explore articles on diverse subjects and enhance your learning by reading in multiple languages.',
      'start.reading': 'Start Reading',
      'browse.subjects': 'Browse Subjects',
      'featured.articles': 'Featured Articles',
      'view.all': 'View all',
      'explore.by.subject': 'Explore by Subject',
      'explore.description': 'Discover articles across various categories in multiple languages',
      'latest.articles': 'Latest Articles',
      'recent.updates': 'Recent Updates',
      'min.read': 'min read',
      'articles': 'articles',
      
      // CTA section
      'cta.title': 'Ready to explore in your language?',
      'cta.subtitle': 'Enhance your learning experience by reading content in multiple languages. Start your journey today.',
      'get.started': 'Get Started',
      'learn.more': 'Learn More',
      
      // Footer
      'footer.description': 'A multilingual platform for knowledge sharing and language learning through diverse content.',
      'footer.explore': 'Explore',
      'footer.languages': 'Languages',
      'footer.about': 'About',
      'footer.mission': 'Our Mission',
      'footer.contact': 'Contact Us',
      'footer.privacy': 'Privacy Policy',
      'footer.terms': 'Terms of Service',
      'footer.contributors': 'Contributors',
      'footer.copyright': '© 2023 MultiLingua. All rights reserved.',
      'footer.cookies': 'Cookies',
      
      // Theme
      'theme.toggle': 'Toggle theme',
      'language.switch': 'Switch language',
      
      // Search
      'search': 'Search',
      'search.title': 'Search Articles',
      'search.placeholder': 'Enter keywords to search...',
      'search.no.results': 'No articles found matching your search.',
      
      // Not found page
      'not.found.title': '404 Page Not Found',
      'not.found.description': 'The page you are looking for does not exist.',
      'back.home': 'Back to Home',
      'popular.topics': 'Popular Topics'
    }
  },
  fr: {
    translation: {
      // Navigation
      'nav.home': 'Accueil',
      'nav.subjects': 'Sujets',
      'nav.popular': 'Populaire',
      'nav.recent': 'Récent',
      'nav.about': 'À propos',
      
      // Language names
      'english': 'Anglais',
      'french': 'Français',
      'spanish': 'Espagnol',
      'arabic': 'Arabe',
      
      // About page
      'about': {
        'title': 'À propos de MultiLingua',
        'mission': {
          'title': 'Notre Mission',
          'content': 'MultiLingua brise les barrières linguistiques en fournissant du contenu éducatif de haute qualité en plusieurs langues, rendant la connaissance accessible à tous.'
        },
        // ... add other about translations following same structure
      },
      
      // Subject names
      'technology': 'Technologie',
      'science': 'Science',
      'environment': 'Environnement',
      'health': 'Santé',
      'arts-culture': 'Arts & Culture',
      'travel': 'Voyage',
      
      // ... rest of French translations remain same
    }
  },
  es: {
    translation: {
      // Navigation
      'nav.home': 'Inicio',
      'nav.subjects': 'Temas',
      'nav.popular': 'Popular',
      'nav.recent': 'Reciente',
      'nav.about': 'Acerca de',
      
      // Language names
      'english': 'Inglés',
      'french': 'Francés',
      'spanish': 'Español',
      'arabic': 'Árabe',
      
      // About page
      'about': {
        'title': 'Acerca de MultiLingua',
        'mission': {
          'title': 'Nuestra Misión',
          'content': 'MultiLingua elimina barreras lingüísticas proporcionando contenido educativo de alta calidad en múltiples idiomas, haciendo el conocimiento accesible para todos.'
        },
        // ... add other about translations following same structure
      },
      
      // ... rest of Spanish translations remain same
    }
  },
  ar: {
    translation: {
      // Navigation
      'nav.home': 'الرئيسية',
      'nav.subjects': 'المواضيع',
      'nav.popular': 'شائع',
      'nav.recent': 'حديث',
      'nav.about': 'حول',
      
      // Language names
      'english': 'الإنجليزية',
      'french': 'الفرنسية',
      'spanish': 'الإسبانية',
      'arabic': 'العربية',
      
      // About page
      'about': {
        'title': 'حول مالتي لينجوا',
        'mission': {
          'title': 'مهمتنا',
          'content': 'تزيل مالتي لينجوا الحواجز اللغوية من خلال توفير محتوى تعليمي عالي الجودة بعدة لغات، مما يجعل المعرفة في متناول الجميع.'
        },
        // ... add other about translations following same structure
      },
      
      // ... rest of Arabic translations remain same
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already safes from XSS
    },
    react: {
      useSuspense: true
    }
  });

export default i18n;
