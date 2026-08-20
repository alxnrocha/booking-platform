import { describe, it, expect } from 'vitest';
import { useAuthStore } from './useAuthStore.ts';

describe('useAuthStore', () => {
  it('initializes with a default guest user', () => {
    const user = useAuthStore.getState().currentUser;
    expect(user).toBeDefined();
    expect(user.role).toBe('GUEST');
    expect(user.name).toBe('Alex Vance');
  });

  it('switches role to HOST and updates user session', () => {
    useAuthStore.getState().setRole('HOST');
    const hostUser = useAuthStore.getState().currentUser;
    expect(hostUser.role).toBe('HOST');
    expect(hostUser.isSuperhost).toBe(true);
  });

  it('switches role to ADMIN and updates user session', () => {
    useAuthStore.getState().setRole('ADMIN');
    const adminUser = useAuthStore.getState().currentUser;
    expect(adminUser.role).toBe('ADMIN');
    expect(adminUser.name).toBe('Admin StayHub');
  });

  it('switches back to GUEST properly', () => {
    useAuthStore.getState().setRole('GUEST');
    const guestUser = useAuthStore.getState().currentUser;
    expect(guestUser.role).toBe('GUEST');
    expect(guestUser.name).toBe('Alex Vance');
  });
});
