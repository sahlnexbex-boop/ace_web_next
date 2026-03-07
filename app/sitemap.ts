import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://aceinstitutions.com'

    // Main pages
    const routes = [
        '',
        '/public/home',
        '/public/about',
        '/public/contact',
        '/public/courses',
        '/public/learners',
        '/public/exams',
        '/public/highlights',
        '/public/blog',
        '/public/notification',
        '/public/publication',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' || route === '/public/home' ? 1 : 0.8,
    }))

    return routes
}
