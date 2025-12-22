import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/merch/admin/'],
      },
    ],
    sitemap: 'https://root5dao.github.io/sitemap.xml',
  };
}

