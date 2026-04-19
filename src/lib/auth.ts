import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),

    // 카카오 OAuth (Custom Provider)
    {
      id: 'kakao',
      name: 'Kakao',
      type: 'oauth',
      authorization: {
        url: 'https://kauth.kakao.com/oauth/authorize',
        params: { scope: 'profile_nickname profile_image account_email' },
      },
      token: 'https://kauth.kakao.com/oauth/token',
      userinfo: 'https://kapi.kakao.com/v2/user/me',
      clientId: process.env.KAKAO_CLIENT_ID ?? '',
      clientSecret: process.env.KAKAO_CLIENT_SECRET ?? '',
      profile(profile: any) {
        return {
          id: String(profile.id),
          name: profile.kakao_account?.profile?.nickname ?? profile.properties?.nickname ?? '사용자',
          email: profile.kakao_account?.email ?? null,
          image: profile.kakao_account?.profile?.profile_image_url ?? profile.properties?.profile_image ?? null,
        };
      },
    },

    // 게스트 로그인 (개발/데모용)
    CredentialsProvider({
      id: 'guest',
      name: 'Guest',
      credentials: {
        nickname: { label: '닉네임', type: 'text', placeholder: '닉네임을 입력하세요' },
      },
      async authorize(credentials) {
        if (!credentials?.nickname) return null;
        const guestId = `guest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        return {
          id: guestId,
          name: credentials.nickname,
          email: null,
          image: null,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      // 최초 로그인 시 유저 정보 + provider 저장
      if (user) {
        token.userId = user.id;
        token.provider = account?.provider ?? 'guest';
      }
      return token;
    },
    async session({ session, token }) {
      // 세션에 userId, provider 노출
      if (session.user) {
        (session.user as any).id = token.userId as string;
        (session.user as any).provider = token.provider as string;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7일
  },

  secret: process.env.NEXTAUTH_SECRET ?? 'dev-secret-change-in-production',
};
