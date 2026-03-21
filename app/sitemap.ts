import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://aceinstitutions.com'

    // Main pages
    const routes = [
        '',
        '/',
        '/about',
        '/contact',
        '/courses',
        '/learners',
        '/exams',
        '/highlights',
        '/blog',
        '/notification',
        '/publication',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' || route === '/' ? 1 : 0.8,
    }))

    return routes
}
