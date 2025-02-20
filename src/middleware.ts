import { NextResponse } from 'next/server'

export default function middleware(req) {
  if (process.env.HTTP_USER) {
    const auth = req.headers.get("authorization");

    // Usuario y contraseña en Base64 → user:password
    const validAuth = "Basic " + Buffer.from(`${process.env.HTTP_USER}:${process.env.HTTP_PASSWORD}`).toString("base64");
  
    if (auth !== validAuth) {
      return new Response("No autorizado", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/", // Protege toda la aplicación
};
  