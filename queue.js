import { db, CABIN_ID } from './firebase.js';
import { ref, push, update, get, onValue, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

export async function addToQueue(visitorId, visitorName, visitorPhone, purpose) {
  const entriesRef = ref(db, `queues/${CABIN_ID}/entries`);
  const snapshot = await get(entriesRef);
  let position = 1;
  if (snapshot.exists()) {
    const waiting = Object.values(snapshot.val())
      .filter(e => e.status === 'waiting' || e.status === 'inside');
    position = waiting.length + 1;
  }
  await push(entriesRef, {
    visitor_id: visitorId,
    visitor_name: visitorName,
    visitor_phone: visitorPhone,
    purpose: purpose,
    position: position,
    status: 'waiting',
    scanned_at: serverTimestamp()
  });
  return position;
}

export async function markDoneAndCallNext(entryId) {
  await update(ref(db, `queues/${CABIN_ID}/entries/${entryId}`),
    { status: 'done' });
  const snapshot = await get(ref(db, `queues/${CABIN_ID}/entries`));
  if (!snapshot.exists()) return;
  const waiting = Object.entries(snapshot.val())
    .filter(([, v]) => v.status === 'waiting')
    .sort((a, b) => a[1].position - b[1].position);
  if (waiting.length > 0) {
    const [nextId, nextData] = waiting[0];
    await update(ref(db, `queues/${CABIN_ID}/entries/${nextId}`),
      { status: 'inside' });
    await update(ref(db, `queues/${CABIN_ID}`),
      { current_serving: nextId });
    return nextData;
  }
}

export function listenToQueue(callback) {
  onValue(ref(db, `queues/${CABIN_ID}/entries`), snapshot => {
    if (!snapshot.exists()) return callback([]);
    const entries = Object.entries(snapshot.val())
      .map(([id, val]) => ({ id, ...val }))
      .filter(e => e.status === 'waiting' || e.status === 'inside')
      .sort((a, b) => a.position - b.position);
    callback(entries);
  });
}