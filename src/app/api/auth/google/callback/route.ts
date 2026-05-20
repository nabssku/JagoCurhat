import { NextRequest, NextResponse } from "next/server";
import { loginOrRegisterWithGoogle } from "@/actions/authActions";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const origin = req.nextUrl.origin;

  // User membatalkan Google consent
  if (error || !code) {
    return NextResponse.redirect(`${origin}/login?error=google_cancelled`);
  }

  try {
    // 1. Tukar authorization code → access token
    const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${origin}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      console.error("Google token exchange failed:", await tokenRes.text());
      return NextResponse.redirect(`${origin}/login?error=google_token`);
    }

    const tokenData = await tokenRes.json();
    const accessToken: string = tokenData.access_token;

    // 2. Ambil info user dari Google
    const userRes = await fetch(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userRes.ok) {
      return NextResponse.redirect(`${origin}/login?error=google_userinfo`);
    }

    const googleUser = await userRes.json() as {
      email: string;
      name: string;
      picture: string;
      email_verified: boolean;
    };

    if (!googleUser.email_verified) {
      return NextResponse.redirect(`${origin}/login?error=google_unverified`);
    }

    // 3. Upsert ke DB (login jika sudah ada, register jika baru)
    const dbUser = await loginOrRegisterWithGoogle({
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
    });

    // 4. Buat session payload (sama persis dengan format AuthProvider)
    const sessionUser = {
      id: dbUser.id,
      email: dbUser.email,
      nickname: dbUser.username,
      avatar: dbUser.avatar,
      accentColor: dbUser.accentColor,
      cardStyle: dbUser.cardStyle,
      isPrivate: dbUser.isPrivate,
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      friends: [] as string[],
    };

    // 5. Simpan session di cookie lalu redirect ke home
    //    AuthProvider akan baca dari cookie ini saat mount
    const response = NextResponse.redirect(`${origin}/`);
    response.cookies.set("jc_google_session", JSON.stringify(sessionUser), {
      httpOnly: false, // Harus bisa dibaca client (localStorage sync)
      maxAge: 60 * 60 * 24 * 7, // 7 hari
      sameSite: "lax",
      path: "/",
    });

    // Juga tandai onboarding selesai
    response.cookies.set("jc_onboarding_completed", "true", {
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Google OAuth callback error:", err);
    return NextResponse.redirect(`${origin}/login?error=google_server`);
  }
}
