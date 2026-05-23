import { db } from './firebase';
import { ref, set, get, child } from 'firebase/database';

const BIN_ID_KEY = 'vision_os_bin_id';

export function getBinId() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(BIN_ID_KEY);
}

export function saveBinId(id) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(BIN_ID_KEY, id);
}

// Strips out functions from state - only serialize plain data
function serializeState(state) {
  const plain = {};
  for (const [key, value] of Object.entries(state)) {
    if (typeof value !== 'function') {
      plain[key] = value;
    }
  }
  return plain;
}

export async function saveToCloud(state) {
  try {
    const data = serializeState(state);
    let binId = getBinId();

    if (!binId) {
      // Create a unique ID for new user if they don't have one
      binId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      saveBinId(binId);
    }

    const userRef = ref(db, 'users/' + binId);
    await set(userRef, data);
    
    return { success: true, binId: binId };
  } catch (err) {
    console.error('Save to cloud (Firebase) failed:', err);
    return { success: false, error: err.message };
  }
}

export async function loadFromCloud(customBinId) {
  try {
    const binId = customBinId || getBinId();
    if (!binId) {
      return { success: false, error: 'NO_BIN_ID' };
    }

    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `users/${binId}`));

    if (snapshot.exists()) {
      const data = snapshot.val();
      if (customBinId) saveBinId(customBinId);
      return { success: true, data };
    } else {
      return { success: false, error: 'NO_DATA' };
    }
  } catch (err) {
    console.error('Load from cloud (Firebase) failed:', err);
    return { success: false, error: err.message };
  }
}
