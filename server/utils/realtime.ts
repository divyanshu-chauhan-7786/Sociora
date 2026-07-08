import { Response } from "express";

type RealtimeEventName =
  | "connected"
  | "posts:changed"
  | "dashboard:changed"
  | "activity:changed"
  | "settings:changed";

type Client = {
  id: string;
  response: Response;
};

const clientsByUser = new Map<string, Client[]>();

const writeEvent = (response: Response, event: RealtimeEventName, data: unknown) => {
  response.write(`event: ${event}\n`);
  response.write(`data: ${JSON.stringify(data)}\n\n`);
};

export const addRealtimeClient = (userId: string, response: Response) => {
  const client = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    response,
  };

  const clients = clientsByUser.get(userId) ?? [];
  clientsByUser.set(userId, [...clients, client]);

  writeEvent(response, "connected", { connectedAt: new Date().toISOString() });

  return () => {
    const currentClients = clientsByUser.get(userId) ?? [];
    const nextClients = currentClients.filter((currentClient) => currentClient.id !== client.id);

    if (nextClients.length === 0) {
      clientsByUser.delete(userId);
      return;
    }

    clientsByUser.set(userId, nextClients);
  };
};

export const broadcastToUser = (userId: string, event: RealtimeEventName, data: unknown = {}) => {
  const clients = clientsByUser.get(userId) ?? [];
  const payload = data && typeof data === "object" ? data : { value: data };

  for (const client of clients) {
    writeEvent(client.response, event, {
      ...payload,
      emittedAt: new Date().toISOString(),
    });
  }
};

export const broadcastWorkspaceChanged = (userId: string, data: unknown = {}) => {
  broadcastToUser(userId, "posts:changed", data);
  broadcastToUser(userId, "dashboard:changed", data);
  broadcastToUser(userId, "activity:changed", data);
};
