import { defineStore } from 'pinia';
import { calculateLikelihoodScore } from '../--functions/calculate-likelihood-score';
import { calculateImpactScore } from '../--functions/calculate-impact-score';
import type { FINDING_RISK, FindingDto, FindingGetResponse, ServerData, USER_ROLE, UserDto } from '~/types';

export const usePageStore = defineStore('FindingPageStore', () => {
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

    const creator = computed(() => {
        return creatorData.value;
    });

    const role = computed(() => roleData.value);

    const findingImageUrl = computed(() => {
        if (!finding.value)
            return undefined;
        const imageId = finding.value.imageId;
        const baseUrl = ENV.public.API_BASE_URL;
        return imageId !== undefined
            ? `${baseUrl}file/${imageId}`
            : undefined;
    });

    const creatorImageUrl = computed(() => {
        if (!creator.value)
            return undefined;
        const imageId = creator.value.imageId;
        const baseUrl = ENV.public.API_BASE_URL;
        return imageId !== undefined
            ? `${baseUrl}file/${imageId}`
            : undefined;
    });

    const isFetching = computed(() => isLoading.value);

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
        isFetching,
        finding,
        findingRiskScore,
        findingRiskLevel,
        creator,
        role,
        findingImageUrl,
        creatorImageUrl,
        initializeData,
    };
});
