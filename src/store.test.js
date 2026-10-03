import { describe, it, expect } from 'vitest';
import store from './store';

describe('Verifikasi Redux Store (2.1.8)', () => {
  it('harus memuat seluruh reducer utama (auth, users, dan lostFounds)', () => {
    const state = store.getState();
    
    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('users');
    expect(state).toHaveProperty('lostFounds');
  });
});