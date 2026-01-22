import { getItem, setItem } from './storage';

const POST_QUEUE_KEY = 'POST_QUEUE';

export const queuePost = async (payload, legPayload) => {
  const queue = await getItem(POST_QUEUE_KEY, []);
  queue.push({ id: Date.now(), payload, legPayload });
  await setItem(POST_QUEUE_KEY, queue);
  const data = await getItem(POST_QUEUE_KEY, []);
  console.log("local post", data)
};

export const processPostQueue = async (globalApi, token) => {
  const queue = await getItem(POST_QUEUE_KEY, []);
  console.log("queue post", queue)
  const remaining = [];

  for (const item of queue) {
    try {
      // 1️⃣ Create shipment
      const shipmentRes = await fetch(`${globalApi}/shipments`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(item.payload)
      });

      if (!shipmentRes.ok) {
        throw new Error('Shipment creation failed');
      }

      const shipmentData = await shipmentRes.json();

      // 2️⃣ Create legs
      const legsRes = await fetch(
        `${globalApi}/shipments/${shipmentData.data.id}/legs`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(item.legPayload)
        }
      );
console.log("shipmentData",shipmentData,legsRes)
      if (!legsRes.ok) {
        throw new Error('Leg creation failed');
      }

    } catch (error) {
      console.error('Queue item failed, keeping it:', error);
      remaining.push(item);
    }
  }

  await setItem(POST_QUEUE_KEY, remaining);
};

