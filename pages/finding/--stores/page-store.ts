import { defineStore } from 'pinia';
import { calculateLikelihoodScore } from '../--functions/calculate-likelihood-score';
import { calculateImpactScore } from '../--functions/calculate-impact-score';
import type { CVSS_RATING, FINDING_RISK, FindingDto, FindingGetResponse, ServerData, USER_ROLE, UserDto } from '~/types';

export const usePageStore = defineStore('FindingPageStore', () => {
    const dayjs = useDayjs();
    const api = usePrivateApi();
    const ENV = useRuntimeConfig();

    // internal data
    const isLoading = ref(true);
    const findingData = ref<FindingDto>();
    const creatorData = ref<UserDto>();
    const roleData = ref<USER_ROLE>('MEMBER');

    // computed values

    const finding = computed(() => {
        return findingData.value;
    });

    const findingRiskScore = computed(() => {
        if (finding.value) {
            const likelihoodScore = calculateLikelihoodScore(finding.value.findingDetail.likelihood);
            const impactScore = calculateImpactScore(finding.value.findingDetail.impact);
            return impactScore * likelihoodScore;
        }
        return 0;
    });

    const findingRiskLevel = computed((): FINDING_RISK => {
        const score = findingRiskScore.value;
        if (score <= 5)
            return 'LOW';
        else if (score >= 6 && score <= 10)
            return 'MEDIUM';
        else if (score >= 11 && score <= 15)
            return 'HIGH';
        else
            return 'EXTREME';
    });

    const findingCreatedDate = computed(() => dayjs(finding.value?.createdAt).format('D MMM YYYY'));

    const creator = computed(() => creatorData.value);

    const role = computed(() => roleData.value);

    const creatorImageUrl = computed(() => {
        if (!creator.value)
            return undefined;
        const imageId = creator.value.imageId;
        const baseUrl = ENV.public.API_BASE_URL;
        return imageId !== undefined
            ? `${baseUrl}file/${imageId}`
            : undefined;
    });

    const cvssString = computed(() => 'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:N/VI:N/VA:N/SC:N/SI:N/SA:N');

    const cvssScore = computed(() => 7.7);

    const cvssRating = computed((): CVSS_RATING => {
        const score = cvssScore.value;
        if (score >= 0.1 && score <= 3.9)
            return 'LOW';
        else if (score >= 4.0 && score <= 6.9)
            return 'MEDIUM';
        else if (score >= 7.0 && score <= 8.9)
            return 'HIGH';
        else if (score >= 7.0 && score <= 8.9)
            return 'CRITICAL';
        else
            return 'NONE';
    });

    const isDataLoaded = computed(() => (
        (isLoading.value === false)
        && (finding.value !== undefined)
        && (creator.value !== undefined)
    ),
    );

    const isDataLoading = computed(() => !isDataLoaded.value);

    // mutations
    async function initializeData(findingId: string) {
        isLoading.value = true;

        const response: ServerData<FindingGetResponse> = await api.get(`/api/finding/${findingId}`);

        findingData.value = response.data.finding;
        creatorData.value = response.data.creator;
        roleData.value = response.data.role;

        isLoading.value = false;
    }

    return {
        isDataLoaded,
        isDataLoading,
        finding,
        findingRiskScore,
        findingRiskLevel,
        findingCreatedDate,
        cvssString,
        cvssScore,
        cvssRating,
        creator,
        creatorImageUrl,
        role,
        initializeData,
    };
});
