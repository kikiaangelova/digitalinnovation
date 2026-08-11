import { Helmet } from 'react-helmet-async';

const SITE = 'https://digitalinnovation.lovable.app';

interface PageMetaProps {
  title: string;
  description: string;
  path: string;
}

/** Per-route head tags: unique title, description, canonical and og:* values. */
export default function PageMeta({ title, description, path }: PageMetaProps) {
  const url = `${SITE}${path}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}