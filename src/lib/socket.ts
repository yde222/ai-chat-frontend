'use client';

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(token?: string): Socket {
  if (!socket) {
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    socket = io(`${url}/chat`, {
      transports: ['websocket'],
      autoConnect: false,
      auth: token ? { token } : { token: 'dev-token' },
    });
  }
  // 토큰이 바뀌면 auth 갱신
  if (token && socket.auth) {
    (socket.auth as any).token = token;
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
