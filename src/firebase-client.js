import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocFromServer,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export const OperationType = Object.freeze({
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write',
});

export function handleFirestoreError(error, operationType, path) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified ?? null,
      isAnonymous: auth.currentUser?.isAnonymous ?? null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: (auth.currentUser?.providerData || []).map((provider) => ({
        providerId: provider.providerId || null,
        email: provider.email || null,
      })),
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

const ALLOWED_TOPICS = ['addition', 'subtraction', 'multiplication', 'division', 'fraction', 'number-pattern'];
const ALLOWED_CHARACTERS = ['buji', 'bintang', 'kupu', 'tunas'];
const USERNAME_PATTERN = /^[a-z0-9_-]{3,20}$/;
const PIN_PATTERN = /^\d{4,6}$/;
const SYNTHETIC_DOMAIN = 'akun.congklatika.app';

export function normalizeUsername(value = '') {
  return String(value).trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
}

export function validateUsernameInput(value = '') {
  const raw = String(value).trim().toLowerCase();
  return USERNAME_PATTERN.test(raw) ? raw : null;
}

export function validatePinInput(value = '') {
  const raw = String(value).trim();
  return PIN_PATTERN.test(raw) ? raw : null;
}

async function derivePinSecret(username, pin) {
  const material = `congklatika-pin-auth-v1:${username}:${pin}`;
  if (globalThis.crypto?.subtle) {
    const bytes = new TextEncoder().encode(material);
    const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
    const hex = Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return `CK$${hex.slice(0, 28)}`;
  }
  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b9;
  for (let i = 0; i < material.length; i++) {
    const c = material.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193) >>> 0;
    h2 = Math.imul(h2 ^ (c + i), 0x85ebca6b) >>> 0;
  }
  return `CK$${h1.toString(16).padStart(8, '0')}${h2.toString(16).padStart(8, '0')}a1b2c3d4`;
}

function sanitizeTopicList(list) {
  if (!Array.isArray(list)) return [];
  const unique = [];
  for (const item of list) {
    if (ALLOWED_TOPICS.includes(item) && !unique.includes(item)) {
      unique.push(item);
    }
    if (unique.length >= 6) break;
  }
  return unique;
}

function sanitizeLegacyLevels(list) {
  if (!Array.isArray(list)) return [];
  const out = [];
  for (const item of list) {
    if ((item === 2 || item === 3) && !out.includes(item)) {
      out.push(item);
    }
    if (out.length >= 2) break;
  }
  return out;
}

export function computeBadgesUnlocked(localState) {
  const lp = localState?.levelProgress || { 1: [], 2: [], 3: [] };
  const l1 = sanitizeTopicList(lp[1]);
  const l2 = sanitizeTopicList(lp[2]);
  const l3 = sanitizeTopicList(lp[3]);
  const totalDone = l1.length + l2.length + l3.length;
  let count = 0;
  if (totalDone >= 1) count++;
  if (l1.length === 6) count++;
  if (l2.length === 6) count++;
  if (l3.length === 6) count++;
  if (localState?.preScores) count++;
  if (localState?.postScores) count++;
  return Math.min(6, Math.max(0, count));
}

function sanitizeProfilePayload(uid, username, authMethod, localState, isCreate = false) {
  const rawName = String(localState?.name || username || 'Petualang').trim().slice(0, 24);
  const displayName = rawName.length >= 1 ? rawName : 'Petualang';
  const character = ALLOWED_CHARACTERS.includes(localState?.character) ? localState.character : 'buji';
  const activeLevelRaw = Math.trunc(Number(localState?.activeLevel) || 1);
  const activeLevel = Math.min(3, Math.max(1, activeLevelRaw));
  const lp = localState?.levelProgress || {};
  const level1Done = sanitizeTopicList(lp[1]);
  const level2Done = sanitizeTopicList(lp[2]);
  const level3Done = sanitizeTopicList(lp[3]);
  const legacyUnlockedLevels = sanitizeLegacyLevels(localState?.legacyUnlockedLevels);
  const preTotal = Number.isInteger(localState?.preScores?.total)
    ? Math.min(12, Math.max(0, localState.preScores.total))
    : -1;
  const postTotal = Number.isInteger(localState?.postScores?.total)
    ? Math.min(12, Math.max(0, localState.postScores.total))
    : -1;
  const preAttemptsCount = Math.min(500, Math.max(0, Math.trunc(Number(localState?.preAttempts?.length) || (preTotal >= 0 ? 1 : 0))));
  const postAttemptsCount = Math.min(500, Math.max(0, Math.trunc(Number(localState?.postAttempts?.length) || (postTotal >= 0 ? 1 : 0))));
  const gamesPlayed = Math.min(100000, Math.max(0, Math.trunc(Number(localState?.gamesPlayed) || 0)));
  const gamesWon = Math.min(gamesPlayed, Math.max(0, Math.trunc(Number(localState?.gamesWon) || 0)));
  const badgesUnlocked = computeBadgesUnlocked(localState);

  if (!isCreate) {
    return {
      displayName,
      character,
      activeLevel,
      curriculumVersion: 2,
      level1Done,
      level2Done,
      level3Done,
      legacyUnlockedLevels,
      preTotal,
      postTotal,
      preAttemptsCount,
      postAttemptsCount,
      gamesPlayed,
      gamesWon,
      badgesUnlocked,
      updatedAt: serverTimestamp(),
    };
  }

  return {
    ownerUid: uid,
    username,
    displayName,
    character,
    authMethod,
    activeLevel,
    curriculumVersion: 2,
    level1Done,
    level2Done,
    level3Done,
    legacyUnlockedLevels,
    preTotal,
    postTotal,
    preAttemptsCount,
    postAttemptsCount,
    gamesPlayed,
    gamesWon,
    badgesUnlocked,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

function buildGoogleUsername(uid, displayName, email) {
  const seed = (email ? email.split('@')[0] : displayName || 'pemain')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, 11) || 'pemain';
  const suffix = String(uid).toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 6) || 'user';
  return `${seed}_${suffix}`.slice(0, 20);
}

function mapAuthError(error) {
  const code = error?.code || '';
  if (code === 'auth/email-already-in-use') {
    return { code, message: 'Username ini sudah dipakai. Silakan pilih tab Masuk atau gunakan username lain.' };
  }
  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
    return { code, message: 'Username atau PIN belum cocok. Periksa kembali huruf kecil dan angkanya, ya.' };
  }
  if (code === 'auth/too-many-requests') {
    return { code, message: 'Terlalu banyak percobaan login. Tunggu sebentar sebelum mencoba lagi.' };
  }
  if (code === 'auth/operation-not-allowed' || code === 'auth/admin-restricted-operation') {
    return {
      code,
      needsProviderSetup: true,
      message: 'Metode masuk Username & PIN belum aktif di pengaturan akun awan. Kamu bisa masuk langsung dengan tombol Google atau main sebagai tamu.',
    };
  }
  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
    return { code, message: 'Jendela login Google ditutup sebelum selesai.' };
  }
  if (code === 'auth/network-request-failed') {
    return { code, message: 'Koneksi internet bermasalah. Data lokalmu tetap aman di perangkat.' };
  }
  return { code: code || 'auth/unknown', message: error?.message || 'Gagal menghubungkan ke akun awan.' };
}

async function fetchPlayerBundle(uid) {
  const playerPath = `players/${uid}`;
  let playerSnap;
  try {
    playerSnap = await getDoc(doc(db, 'players', uid));
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, playerPath);
  }
  if (!playerSnap?.exists()) return null;

  const attemptsPath = `players/${uid}/quiz_attempts`;
  let attempts = [];
  try {
    const q = query(collection(db, 'players', uid, 'quiz_attempts'), orderBy('recordedAt', 'asc'));
    const snap = await getDocs(q);
    attempts = snap.docs.map((d) => d.data());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, attemptsPath);
  }
  return { profile: playerSnap.data(), attempts };
}

async function createAccountDocuments({ uid, username, authMethod, localState }) {
  const batch = writeBatch(db);
  const playerRef = doc(db, 'players', uid);
  const usernameRef = doc(db, 'usernames', username);

  const playerDoc = sanitizeProfilePayload(uid, username, authMethod, localState, true);
  batch.set(playerRef, playerDoc);
  batch.set(usernameRef, {
    username,
    ownerUid: uid,
    createdAt: serverTimestamp(),
  });

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `players/${uid}`);
  }
  return playerDoc;
}

export async function registerWithUsernamePin({ username, pin, displayName, character, localState }) {
  const cleanUsername = validateUsernameInput(username);
  if (!cleanUsername) {
    throw { code: 'validation/username', message: 'Username harus 3–20 karakter (huruf kecil, angka, _ atau -).' };
  }
  const cleanPin = validatePinInput(pin);
  if (!cleanPin) {
    throw { code: 'validation/pin', message: 'PIN harus terdiri dari 4 sampai 6 angka.' };
  }
  const cleanName = String(displayName || '').trim().slice(0, 24);
  if (!cleanName) {
    throw { code: 'validation/name', message: 'Tulis nama panggilan dulu, ya.' };
  }

  const email = `${cleanUsername}@${SYNTHETIC_DOMAIN}`;
  const secret = await derivePinSecret(cleanUsername, cleanPin);

  let cred;
  try {
    cred = await createUserWithEmailAndPassword(auth, email, secret);
  } catch (error) {
    throw mapAuthError(error);
  }

  try {
    await updateProfile(cred.user, { displayName: cleanName });
  } catch (_) {}

  const mergedLocal = {
    ...(localState || {}),
    name: cleanName,
    character: ALLOWED_CHARACTERS.includes(character) ? character : 'buji',
  };
  await createAccountDocuments({
    uid: cred.user.uid,
    username: cleanUsername,
    authMethod: 'username_pin',
    localState: mergedLocal,
  });

  const bundle = await fetchPlayerBundle(cred.user.uid);
  return {
    uid: cred.user.uid,
    username: cleanUsername,
    authMethod: 'username_pin',
    profile: bundle?.profile || null,
    attempts: bundle?.attempts || [],
  };
}

export async function loginWithUsernamePin({ username, pin }) {
  const cleanUsername = validateUsernameInput(username);
  if (!cleanUsername) {
    throw { code: 'validation/username', message: 'Masukkan username yang valid (3–20 karakter).' };
  }
  const cleanPin = validatePinInput(pin);
  if (!cleanPin) {
    throw { code: 'validation/pin', message: 'Masukkan PIN 4 sampai 6 angka.' };
  }

  const email = `${cleanUsername}@${SYNTHETIC_DOMAIN}`;
  const secret = await derivePinSecret(cleanUsername, cleanPin);

  let cred;
  try {
    cred = await signInWithEmailAndPassword(auth, email, secret);
  } catch (error) {
    throw mapAuthError(error);
  }

  let bundle = await fetchPlayerBundle(cred.user.uid);
  if (!bundle) {
    await createAccountDocuments({
      uid: cred.user.uid,
      username: cleanUsername,
      authMethod: 'username_pin',
      localState: { name: cred.user.displayName || cleanUsername, character: 'buji' },
    });
    bundle = await fetchPlayerBundle(cred.user.uid);
  }

  return {
    uid: cred.user.uid,
    username: bundle?.profile?.username || cleanUsername,
    authMethod: 'username_pin',
    profile: bundle?.profile || null,
    attempts: bundle?.attempts || [],
  };
}

export async function loginWithGoogle({ localState } = {}) {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  let cred;
  try {
    cred = await signInWithPopup(auth, provider);
  } catch (error) {
    throw mapAuthError(error);
  }

  let bundle = await fetchPlayerBundle(cred.user.uid);
  if (!bundle) {
    const username = buildGoogleUsername(cred.user.uid, cred.user.displayName, cred.user.email);
    const mergedLocal = {
      ...(localState || {}),
      name: (localState?.name || cred.user.displayName || 'Petualang').trim().slice(0, 24),
    };
    await createAccountDocuments({
      uid: cred.user.uid,
      username,
      authMethod: 'google',
      localState: mergedLocal,
    });
    bundle = await fetchPlayerBundle(cred.user.uid);
  }

  return {
    uid: cred.user.uid,
    username: bundle?.profile?.username || buildGoogleUsername(cred.user.uid, cred.user.displayName, cred.user.email),
    authMethod: 'google',
    profile: bundle?.profile || null,
    attempts: bundle?.attempts || [],
  };
}

export async function syncProgressToCloud(localState) {
  const user = auth.currentUser;
  if (!user) return null;
  const path = `players/${user.uid}`;
  const payload = sanitizeProfilePayload(user.uid, '', 'username_pin', localState, false);
  try {
    await updateDoc(doc(db, 'players', user.uid), payload);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
  return false;
}

export async function recordQuizAttemptToCloud(attempt) {
  const user = auth.currentUser;
  if (!user || !attempt || !['pre', 'post'].includes(attempt.kind)) return null;
  const cleanId = String(attempt.id || `${attempt.kind}-${Date.now()}`)
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .slice(0, 48) || `quiz-${Date.now()}`;
  const s = attempt.scores || {};
  const addition = Math.min(2, Math.max(0, Math.trunc(Number(s.addition?.correct) || 0)));
  const subtraction = Math.min(2, Math.max(0, Math.trunc(Number(s.subtraction?.correct) || 0)));
  const multiplication = Math.min(2, Math.max(0, Math.trunc(Number(s.multiplication?.correct) || 0)));
  const division = Math.min(2, Math.max(0, Math.trunc(Number(s.division?.correct) || 0)));
  const fraction = Math.min(2, Math.max(0, Math.trunc(Number(s.fraction?.correct) || 0)));
  const numberPattern = Math.min(2, Math.max(0, Math.trunc(Number(s['number-pattern']?.correct) || 0)));
  const total = addition + subtraction + multiplication + division + fraction + numberPattern;
  const path = `players/${user.uid}/quiz_attempts/${cleanId}`;
  const payload = {
    attemptId: cleanId,
    ownerUid: user.uid,
    kind: attempt.kind,
    total,
    addition,
    subtraction,
    multiplication,
    division,
    fraction,
    numberPattern,
    baselineId: attempt.baselineId ? String(attempt.baselineId).slice(0, 48) : '',
    recordedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, 'players', user.uid, 'quiz_attempts', cleanId), payload);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
  return false;
}

export async function logoutAccount() {
  await signOut(auth);
}

let activeProfileUnsub = null;
let authReadyResolved = false;

export function attachAuthObserver(onSessionChange) {
  return onAuthStateChanged(auth, async (user) => {
    authReadyResolved = true;
    if (activeProfileUnsub) {
      activeProfileUnsub();
      activeProfileUnsub = null;
    }
    if (!user) {
      onSessionChange({ ready: true, signedIn: false, user: null, profile: null, attempts: [] });
      return;
    }

    const bundle = await fetchPlayerBundle(user.uid).catch((err) => {
      console.error(err);
      return null;
    });

    onSessionChange({
      ready: true,
      signedIn: true,
      user: {
        uid: user.uid,
        displayName: user.displayName || bundle?.profile?.displayName || '',
        email: user.email || '',
        authMethod: bundle?.profile?.authMethod || (user.email?.endsWith(`@${SYNTHETIC_DOMAIN}`) ? 'username_pin' : 'google'),
      },
      profile: bundle?.profile || null,
      attempts: bundle?.attempts || [],
    });

    const profilePath = `players/${user.uid}`;
    activeProfileUnsub = onSnapshot(
      doc(db, 'players', user.uid),
      (snapshot) => {
        if (!auth.currentUser || !snapshot.exists()) return;
        onSessionChange({
          ready: true,
          signedIn: true,
          user: {
            uid: user.uid,
            displayName: user.displayName || snapshot.data().displayName || '',
            email: user.email || '',
            authMethod: snapshot.data().authMethod || 'username_pin',
          },
          profile: snapshot.data(),
          attempts: null,
        });
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, profilePath);
      }
    );
  });
}

window.congklatikaCloud = {
  isReady: () => authReadyResolved,
  projectId: firebaseConfig.projectId,
  databaseId: firebaseConfig.firestoreDatabaseId,
  registerWithUsernamePin,
  loginWithUsernamePin,
  loginWithGoogle,
  syncProgressToCloud,
  recordQuizAttemptToCloud,
  logoutAccount,
  attachAuthObserver,
  validateUsernameInput,
  validatePinInput,
};

window.dispatchEvent(new CustomEvent('congklatika:cloud-ready'));
