import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/user-portal/'],
        },
        sitemap: 'https://aceinstitutions.com/sitemap.xml',
    }
}
