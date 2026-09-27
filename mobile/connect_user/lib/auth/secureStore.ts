import * as SecureStore from 'expo-secure-store';

const JWT_KEY = 'jwt_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_ROLE_KEY = 'user_role';
const USER_ID_KEY = 'user_id';

export const storeJWT = async (token: string) => {
  await SecureStore.setItemAsync(JWT_KEY, token);
};

export const getJWT = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(JWT_KEY);
};

export const removeJWT = async () => {
  await SecureStore.deleteItemAsync(JWT_KEY);
};

export const storeRefreshToken = async (token: string) => {
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
};

export const getRefreshToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
};

export const removeRefreshToken = async () => {
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
};

export const storeUserRole = async (role: string) => {
  await SecureStore.setItemAsync(USER_ROLE_KEY, role);
};

export const getUserRole = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(USER_ROLE_KEY);
};

export const removeUserRole = async () => {
  await SecureStore.deleteItemAsync(USER_ROLE_KEY);
};

export const storeUserId = async (id: string) => {
  await SecureStore.setItemAsync(USER_ID_KEY, id);
};

export const getUserId = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(USER_ID_KEY);
};

export const clearAll = async () => {
  await SecureStore.deleteItemAsync(JWT_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_ROLE_KEY);
  await SecureStore.deleteItemAsync(USER_ID_KEY);
};