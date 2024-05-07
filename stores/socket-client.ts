import { Client, type StompHeaders, type StompSubscription } from '@stomp/stompjs';

type Callback = (payload: any, header: StompHeaders) => void;
type DestinationMapping = Map<string, DestinationInfo>;
interface DestinationInfo {
    subscribeFn: StompSubscription;
    callbacks: Callback[];
}

export const useSocketClientStore = defineStore('GlobalSocketConnectionStore', () => {
    const app = useAppStore();
    const connection = ref<Client>();
    const destinationMap = ref<DestinationMapping>(new Map());

    async function activate(): Promise<Client> {
        return new Promise((resolve) => {
            if (connection.value === undefined) {
                connection.value = new Client({
                    brokerURL: useRuntimeConfig().public.WS_BASE_URL,
                    connectHeaders: {
                        Authorization: `Bearer ${app.accessToken}`,
                    },
                    onConnect: () => resolve(connection.value!),
                    onStompError: frame => console.error('[STOMP] error:', frame),
                    onUnhandledFrame: frame => console.error('[STOMP] unhandled frame:', frame),
                    onWebSocketError: error => console.error('[WS] error:', error),
                });
                connection.value.activate();
            }
            else {
                resolve(connection.value);
            }
        });
    }

    function subscribe(
        destination: string,
        callback: Callback,
    ): StompSubscription {
        const socket = connection.value;
        try {
            if (socket === undefined || socket.connected === false)
                throw new Error('[STOMP]: connection not initialized');

            if (!destinationMap.value.has(destination)) {
                destinationMap.value.set(
                    destination,
                    {
                        subscribeFn: socket.subscribe(
                            destination,
                            (payload) => {
                                const callbacks = destinationMap.value.get(destination)?.callbacks;
                                callbacks?.forEach(cb => cb(JSON.parse(payload.body), payload.headers));
                            },
                            {
                                SessionUUID: app.sessionId,
                                CallerId: app.user!.id,
                            },
                        ),
                        callbacks: [],
                    },
                );
            }
            const destinationInfo = destinationMap.value.get(destination)!;
            const subsId = destinationInfo.subscribeFn.id;
            destinationInfo.callbacks.push(callback);

            return {
                id: subsId,
                unsubscribe() {
                    const destinationInfo = destinationMap.value.get(destination);
                    if (destinationInfo) {
                        const index = destinationInfo.callbacks.indexOf(callback);
                        if (index > -1)
                            destinationInfo.callbacks.splice(index, 1);
                        if (destinationInfo.callbacks.length === 0) {
                            destinationInfo.subscribeFn.unsubscribe();
                            destinationMap.value.delete(destination);
                        }
                    }
                },
            };
        }
        catch (error) {
            console.error(`[STOMP]: Error subscribing to '${destination}'`);
            console.error(error);
            throw error;
        }
    }

    function send(destiniation: string, payload: Record<string, any>) {
        const socket = connection.value;
        try {
            if (socket === undefined || socket.connected === false)
                throw new Error('[STOMP]: connection not initialized');

            socket.publish({
                destination: `/app${destiniation}`,
                body: JSON.stringify(payload),
                headers: {
                    SessionUUID: app.sessionId,
                    CallerId: app.user!.id,
                },
            });
        }
        catch (error) {
            console.error(`[STOMP]: Error sending to '${destiniation}'`);
            console.error(error);
        }
    }

    function deactivate() {
        const socket = connection.value;
        try {
            if (socket === undefined || socket.connected === false)
                throw new Error('[STOMP]: connection not initialized');
            socket.deactivate();
            destinationMap.value = new Map();
        }
        catch (error) {
            console.error(`[STOMP]: Error deactivating connection`);
            console.error(error);
        }
    }

    return { activate, deactivate, subscribe, send, destinationMap };
});
