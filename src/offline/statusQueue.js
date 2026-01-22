import { getItem, setItem, clearAll } from './storage';

const STATUS_QUEUE_KEY = 'STATUS_QUEUE';

export const queueStatusUpdate = async (id, status) => {
  const queue = await getItem(STATUS_QUEUE_KEY, []);
  queue.push({ id, status});
  await setItem(STATUS_QUEUE_KEY, queue);
  const data = await getItem(STATUS_QUEUE_KEY, []);
  console.log("local status", data)
};

export const processStatusQueue = async (globalApi, token) => {
  // clearAll()
  const queue = await getItem(STATUS_QUEUE_KEY, []);
  console.log("queue status", queue)
  const remaining = [];

  for (const item of queue) {
    try {
      // 1️⃣ Update shipment status
      const res = await fetch(
        `${globalApi}/shipments/${item.id}/status`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: item.status }),
        }
      );

      if (!res.ok) throw new Error('Shipment status failed');

      const data = await res.json();
      if (!data?.success) throw new Error('Invalid status');

      // 2️⃣ Get leg ID
      const legResponse = await fetch(
        `${globalApi}/shipments/${item.id}/legs`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!legResponse.ok) throw new Error('Leg fetch failed');

      const legIdRes = await legResponse.json();
      const legId = legIdRes.data?.legs?.[0]?.id;

      if (!legId) throw new Error('No leg found');

      // 3️⃣ Update leg status
      const legRes = await fetch(
        `${globalApi}/shipments/${item.id}/legs/${legId}`,
        {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: item.status }),
        }
      );

      if (!legRes.ok) throw new Error('Leg update failed');

      const legData = await legRes.json();
      if (!legData?.success) throw new Error('Leg update error');

console.log("status shipment",data,legData)
    } catch (error) {
      console.error('Queue item failed:', item, error);
      remaining.push(item); // keep failed item
    }
  }

  // Save only failed items back to storage
  await setItem(STATUS_QUEUE_KEY, remaining);
};

