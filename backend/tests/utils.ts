// Test utilities and mocks
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

jest.mock('../config/database', () => ({
  __esModule: true,
  default: prismaMock,
}));

export const prismaMock = mockDeep<PrismaClient>() as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});

// Mock Firebase Admin SDK
jest.mock('firebase-admin/auth', () => ({
  getAuth: jest.fn().mockReturnValue({
    verifyIdToken: jest.fn(),
    createUser: jest.fn(),
    deleteUser: jest.fn(),
    updateUser: jest.fn(),
    getUser: jest.fn(),
  }),
}));

// Test user data
export const testUser = {
  uid: 'test-user-123',
  email: 'test@example.com',
  displayName: 'Test Player',
};

export const testUser2 = {
  uid: 'test-user-456',
  email: 'player2@example.com',
  displayName: 'Second Player',
};

// Helper functions
export const createMockRequest = (overrides = {}) => ({
  user: testUser,
  headers: {},
  body: {},
  params: {},
  query: {},
  ...overrides,
});

export const createMockResponse = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
});

export const createMockNext = () => jest.fn();
