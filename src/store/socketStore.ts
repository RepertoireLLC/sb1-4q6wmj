import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { useUserStore } from './userStore';
import { useAuthStore } from './authStore';
import { useFriendStore } from './friendStore';
import { useChatStore } from './chatStore';

interface SocketState {
  socket: Socket | null;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (toUserId: string, content: string) => void;
  sendFriendRequest: (toUserId: string) => void;
  updatePosition: (position: [number, number, number]) => void;
}

const SOCKET_URL = 'https://29ef-2600-1011-a03d-1e51-5fd6-ce2b-5429-1910.ngrok-free.app';

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,

  connect: () => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    const currentUser = useAuthStore.getState().user;
    const { setOnlineStatus, addUser, removeUser, updateUserPosition } = useUserStore.getState();
    const { addMessage } = useChatStore.getState();
    const { updateFriendRequest } = useFriendStore.getState();

    // Connection events
    socket.on('connect', () => {
      console.log('Connected to Socket.io server');
      if (currentUser) {
        socket.emit('userOnline', {
          userId: currentUser.id,
          userData: {
            name: currentUser.name,
            color: currentUser.color,
            profilePicture: currentUser.profilePicture,
          },
        });
      }
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      // Implement exponential backoff
      setTimeout(() => {
        socket.connect();
      }, 1000);
    });

    // User events
    socket.on('userConnected', ({ userId, userData, position }) => {
      if (userId !== currentUser?.id) {
        addUser({
          id: userId,
          ...userData,
          online: true,
          position,
        });
        setOnlineStatus(userId, true);
      }
    });

    socket.on('userDisconnected', ({ userId }) => {
      setOnlineStatus(userId, false);
    });

    socket.on('userLeft', ({ userId }) => {
      removeUser(userId);
    });

    socket.on('userPositionUpdate', ({ userId, position }) => {
      updateUserPosition(userId, position);
    });

    // Initial state sync
    socket.on('initialState', ({ users, messages }) => {
      users.forEach((user: any) => {
        if (user.userId !== currentUser?.id) {
          addUser({
            id: user.userId,
            ...user.userData,
            online: true,
            position: user.position,
          });
          setOnlineStatus(user.userId, true);
        }
      });

      messages.forEach((message: any) => {
        addMessage(message);
      });
    });

    // Chat events
    socket.on('chatMessage', (message) => {
      addMessage(message);
    });

    // Friend events
    socket.on('friendRequestUpdate', (data) => {
      updateFriendRequest(data);
    });

    // Error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    socket.io.on('reconnect', (attempt) => {
      console.log('Reconnected on attempt:', attempt);
      if (currentUser) {
        socket.emit('userOnline', {
          userId: currentUser.id,
          userData: {
            name: currentUser.name,
            color: currentUser.color,
            profilePicture: currentUser.profilePicture,
          },
        });
      }
    });

    socket.io.on('reconnect_attempt', (attempt) => {
      console.log('Reconnection attempt:', attempt);
    });

    socket.io.on('reconnect_error', (error) => {
      console.error('Reconnection error:', error);
    });

    socket.io.on('reconnect_failed', () => {
      console.error('Failed to reconnect');
    });

    set({ socket });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        socket.emit('userOffline', { userId: currentUser.id });
      }
      socket.disconnect();
      set({ socket: null });
    }
  },

  sendMessage: (toUserId: string, content: string) => {
    const { socket } = get();
    const currentUser = useAuthStore.getState().user;
    if (socket && currentUser) {
      socket.emit('sendMessage', {
        fromUserId: currentUser.id,
        toUserId,
        content,
        timestamp: Date.now(),
      });
    }
  },

  sendFriendRequest: (toUserId: string) => {
    const { socket } = get();
    const currentUser = useAuthStore.getState().user;
    if (socket && currentUser) {
      socket.emit('sendFriendRequest', {
        fromUserId: currentUser.id,
        toUserId,
      });
    }
  },

  updatePosition: (position: [number, number, number]) => {
    const { socket } = get();
    const currentUser = useAuthStore.getState().user;
    if (socket && currentUser) {
      socket.emit('updatePosition', {
        userId: currentUser.id,
        position,
      });
    }
  },
}));