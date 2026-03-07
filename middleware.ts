// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    if (pathname === '/') {
        return NextResponse.redirect(
            new URL('/public/home', request.url),
            { status: 301 }
        )
    }

    return NextResponse.next()
}