import type { Dayjs } from 'dayjs';
import type { PROJECT_STATUS } from '~/types';

export const useProjectStore = defineStore('ProjectPageStore', () => {
    const dayjs = useDayjs();
    const socket = useSocketClientStore();
    const BASE_URL = useRuntimeConfig().public.API_BASE_URL;

    // States
    const id = ref() as Ref<string>;
    const title = ref() as Ref<string>;
    const imageId = ref<string>() as Ref<string | undefined>;
    const ownerId = ref() as Ref<string>;
    const startDate = ref() as Ref<Dayjs>;
    const endDate = ref() as Ref<Dayjs>;

    const imageUrl = computed(() => imageId.value !== undefined
        ? encodeURI(`${BASE_URL}api/file/${imageId.value}`)
        : undefined,
    );

    const status = computed((): PROJECT_STATUS => {
        const today = dayjs();
        if (today.isBefore(startDate.value.startOf('day')))
            return 'NOT_STARTED';
        else if (today.isAfter(endDate.value.endOf('day')))
            return 'FINISHED';
        else
            return 'ON_GOING';
    });

    const isActive = computed(() => status.value === 'ON_GOING');

    const watcher = watchIgnorable(
        [
            title,
            ownerId,
            startDate,
            endDate,
            imageId,
        ],
        useDebounceFn(() => {
            socket.send(
                    `/project/${id.value}.update`,
                    {
                        name: title.value,
                        ownerId: ownerId.value,
                        imageId: imageId.value,
                        startDate: startDate.value.toDate().toISOString(),
                        endDate: endDate.value.toDate().toISOString(),
                    },
            );
        }, 500),
    );

    return {
        id,
        title,
        imageId,
        ownerId,
        startDate,
        endDate,
        imageUrl,
        status,
        isActive,
        watcher,
    };
});
