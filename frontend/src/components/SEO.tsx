import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  article?: {
    publishedTime?: string;
    author?: string;
    section?: string;
  };
}

export const SEO = ({
  title = "JournalXP - Game-like Mental Wellness Journaling",
  description = "Transform your mental wellness journey into an adventure. Gamified journaling with AI companion, habit tracking, virtual pet, and supportive community. Start free!",
  image = "https://journalxp.com/og-image.png",
  url = "https://journalxp.com",
  type = "website",
  article,
}: SEOProps) => {
  const fullTitle = title.includes("JournalXP") ? title : `${title} | JournalXP`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="JournalXP" />
      <meta property="og:locale" content="en_US" />

      {/* Image dimensions for faster rendering */}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="JournalXP - Gamified mental wellness platform" />

      {/* Article-specific tags */}
      {article && (
        <>
          {article.publishedTime && (
            <meta property="article:published_time" content={article.publishedTime} />
          )}
          {article.author && (
            <meta property="article:author" content={article.author} />
          )}
          {article.section && (
            <meta property="article:section" content={article.section} />
          )}
        </>
      )}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {/* Add your Twitter handle when you create an account */}
      {/* <meta name="twitter:site" content="@journalxp" /> */}
    </Helmet>
  );
};
