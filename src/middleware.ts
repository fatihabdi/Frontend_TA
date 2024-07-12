import { NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

export async function middleware(req) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    const loginUrl = new URL('/login', req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const decodedToken = jwtDecode(token);

    const userRole = decodedToken.role;

    const pathname = req.nextUrl.pathname;

    // Role-based access control
    if (pathname.startsWith('/admin') && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.nextUrl.origin));
    }

    if (pathname.startsWith('/guru') && userRole !== 'teacher') {
      return NextResponse.redirect(new URL('/unauthorized', req.nextUrl.origin));
    }

    if (pathname.startsWith('/siswa') && userRole !== 'student') {
      return NextResponse.redirect(new URL('/unauthorized', req.nextUrl.origin));
    }

    if (pathname.startsWith('/wali') && userRole !== 'parent') {
      return NextResponse.redirect(new URL('/unauthorized', req.nextUrl.origin));
    }
  } catch (error) {
    const loginUrl = new URL('/login', req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/guru/:path*', '/siswa/:path*', '/wali/:path*'] // Protect admin, guru, siswa, and wali routes
};
