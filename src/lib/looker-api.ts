// src/lib/looker-api.ts
import { google } from 'googleapis';
import * as fs from 'fs';

const looker = google.looker({ version: 'v1' });

const initializeLooker = async () => {
  const credentialsPath = process.env.LOOKER_SERVICE_ACCOUNT_KEY_PATH;

  if (!credentialsPath) {
    throw new Error(
      'LOOKER_SERVICE_ACCOUNT_KEY_PATH is not defined in the environment.'
    );
  }

  try {
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));

    const authClient = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/lookerapi'],
    });

    const auth = await authClient.getClient();

    return auth;
  } catch (error) {
    console.error('Failed to initialize Google Authentication:', error);
    throw new Error(`Failed to initialize Google Authentication: ${error}`);
  }
};

export const getUserById = async (userId: number) => {
  try {
    const auth = await initializeLooker();

    const response = await looker.users.get({
      auth: auth,
      user_id: userId,
    });

    if (response.status !== 200) {
      console.error(
        'Error fetching Looker user data:',
        response.status,
        response.data
      );
      throw new Error(
        `Failed to fetch Looker user data. Status: ${response.status}`
      );
    }

    return response.data;
  } catch (error) {
    console.error('Error during Looker API call:', error);
    throw error;
  }
};
