export interface User {
  email: string;
  username: string;
  attributes: {
    email: string;
    name?: string;
  };
}

// Hardcoded user for development
const MOCK_USER: User = {
  email: 'user@example.com',
  username: 'user',
  attributes: {
    email: 'user@example.com',
    name: 'Test User',
  },
};

// Mock session storage key
const SESSION_KEY = 'mock_auth_session';

export const signIn = async (email: string, password: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      if (email === MOCK_USER.email && password === 'password') {
        // Create a mock session
        if (typeof window !== 'undefined') {
          localStorage.setItem(SESSION_KEY, 'true');
        }
        resolve({
          isValid: () => true,
          getIdToken: () => ({ getJwtToken: () => 'mock-jwt-token' }),
          getAccessToken: () => ({ getJwtToken: () => 'mock-access-token' }),
        });
      } else {
        reject(new Error('Incorrect username or password.'));
      }
    }, 500);
  });
};

export const signUp = async (email: string, password: string, name: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Always succeed for mock signup
      resolve({ userConfirmed: true, userSub: 'mock-sub' });
    }, 500);
  });
};

export const signOut = async (): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_KEY);
    }
    resolve();
  });
};

export const getCurrentUser = async (): Promise<User | null> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined') {
      const hasSession = localStorage.getItem(SESSION_KEY);
      if (hasSession) {
        resolve(MOCK_USER);
        return;
      }
    }
    resolve(null);
  });
};

export const confirmSignUp = async (email: string, code: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
};
