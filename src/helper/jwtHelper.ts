import * as SecureStore from 'expo-secure-store';

export const decodeJWT = (token: string): { userId: string } | null => {
  if (!token) {
    console.error('Token vacío o nulo');
    return null;
  }

  try {
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    console.log('Decoded JWT Payload:', decodedPayload); // Checking JWT content
    return { userId: decodedPayload.sub }; // `sub` is usually the user ID in JWTs
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const getUserIdFromSecureStore = async (): Promise<string | null> => {
  try {
    const token = await SecureStore.getItemAsync('auth_token');
    console.log('Retrieved Token:', token); // Checking if the token is retrieved correctly
    if (!token) return null;

    const decoded = decodeJWT(token);
    console.log('Decoded User ID:', decoded?.userId); // Checking the decoded user ID
    return decoded?.userId || null;
  } catch (error) {
    console.error('Error retrieving user ID:', error);
    return null;
  }
};
