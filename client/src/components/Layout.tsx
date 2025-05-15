import Header from "./Header";
import Footer from "./Footer";
import { useEffect, ReactNode } from "react";
import { Helmet } from "react-helmet";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
}

export default function Layout({ 
  children, 
  title = "MultiLingua - Discover Knowledge Across Languages",
  description = "Explore multilingual articles on diverse subjects with MultiLingua - read content in English, French, Spanish, and Arabic.",
  keywords = "multilingual, articles, languages, learning, education",
  image = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4"
}) {
  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden pt-16">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
      </Helmet>
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}