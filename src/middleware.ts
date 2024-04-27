import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {

    const isAbout = request.url.includes('/about')
    if(isAbout) {
        return NextResponse.redirect(new URL('/investing', request.url))  
    }
    return NextResponse.redirect(new URL('/', request.url))
}

export const config = {
	matcher: ['/services', '/dashboard/:path*'],
}
