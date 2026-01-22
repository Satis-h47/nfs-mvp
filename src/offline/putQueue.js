import { getItem, setItem } from './storage';

const PUT_QUEUE_KEY = 'PUT_QUEUE';

export const queuePut = async (id, payload) => {
  const queue = await getItem(PUT_QUEUE_KEY, []);
  queue.push({ id, payload });
  await setItem(PUT_QUEUE_KEY, queue);
  const data = await getItem(PUT_QUEUE_KEY, []);
  console.log("local put", data)
};

export const processPutQueue = async (globalApi, token) => {
  const queue = await getItem(PUT_QUEUE_KEY, []);
  console.log("queue put", queue)
  const remaining = [];

  for (const item of queue) {
    try {
    const response = await fetch(`${globalApi}/shipments/${item.id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item.payload)
    });

    const data = await response.json();

    if (!response.ok) {
      // Throw a proper error so it’s caught by catch()
      throw new Error(data?.error?.message || 'Failed to update shipment');
    }
    console.log("put shipment", data)
    } catch (error) {
      console.error('Queue item failed, keeping it:', error);
      remaining.push(item);
    }
  }

  await setItem(PUT_QUEUE_KEY, remaining);
};

