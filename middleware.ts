// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Root path '/' is now served by app/(public)/page.tsx directly.

    return NextResponse.next()
}
