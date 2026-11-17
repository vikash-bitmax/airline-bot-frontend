import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('skywings_simulator_token') || 'sim-auth-dev-key';
const userStr = localStorage.getItem('skywings_simulator_user');
let user = null;
try {
  user = userStr ? JSON.parse(userStr) : {
    name: 'Flight Ops Dispatcher',
    email: 'ops@skywings.aero',
    role: 'ADMIN',
  };
} catch {
  user = { name: 'Flight Ops Dispatcher', email: 'ops@skywings.aero', role: 'ADMIN' };
}

const initialState = {
  token,
  user,
  isAuthenticated: Boolean(token),
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem('skywings_simulator_token', token);
      localStorage.setItem('skywings_simulator_user', JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('skywings_simulator_token');
      localStorage.removeItem('skywings_simulator_user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
