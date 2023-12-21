import * as admin from "firebase-admin";
import { cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { envs } from "index";
import config from "./firebaseJson.json";

const app = admin.initializeApp({
  credential: cert({
    clientEmail: envs.FIREBASE_CLIENT_EMAIL,
    privateKey: envs.FIREBASE_PRIVATE_KEY,
    projectId: envs.FIREBASE_PROJECT_ID,
  }),
  ...config,
  projectId: envs.FIREBASE_PROJECT_ID,
  serviceAccountId: envs.FIREBASE_CLIENT_EMAIL,
  storageBucket: envs.FIREBASE_STORAGE_BUCKET,
});

export const authFB = getAuth(app);
