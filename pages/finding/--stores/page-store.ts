import { defineStore } from 'pinia';
import { calculateLikelihoodScore } from '../--functions/calculate-likelihood-score';
import { calculateImpactScore } from '../--functions/calculate-impact-score';
import type { CVSS_RATING, FINDING_CATEGORY, FINDING_IMPACT, FINDING_LIKELIHOOD, FINDING_LOCATION, FINDING_METHOD, FINDING_RISK, FindingDto, FindingGetResponse, ServerData, USER_ROLE, UserDto } from '~/types';

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
    const findingRiskScore = computed(() => {
        if (findingData.value) {
            const likelihoodScore = calculateLikelihoodScore(findingData.value.findingDetail.likelihood);
            const impactScore = calculateImpactScore(findingData.value.findingDetail.impact);
            return impactScore * likelihoodScore;
        }
        return 0;
    });

    const findingRiskLevel = computed((): FINDING_RISK => {
        const score = findingRiskScore.value;
        if (score <= 5)
            return 'LOW';
        else if (score <= 10)
            return 'MEDIUM';
        else if (score <= 15)
            return 'HIGH';
        else
            return 'EXTREME';
    });

    const findingCreatedDate = computed(() => {
        if (findingData.value)
            return dayjs(findingData.value?.createdAt).format('D MMM YYYY');
        return 'undefined';
    });

    const creatorImageUrl = computed(() => {
        if (!creatorData.value)
            return undefined;
        const imageId = creatorData.value.imageId;
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
        && (findingData.value !== undefined)
        && (creatorData.value !== undefined)
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

    const postUpdateFindingImpact = useDebounceFn((value: FINDING_IMPACT) => {
        // TODO: implement publishing
    }, 500);

    const postUpdateFindingLikelihood = useDebounceFn((value: FINDING_LIKELIHOOD) => {
        // TODO: implement publishing
    }, 500);

    const postUpdateFindingCategory = useDebounceFn((value: FINDING_CATEGORY) => {
        // TODO: implement publishing
    }, 500);

    const postUpdateFindingLocation = useDebounceFn((value: FINDING_LOCATION) => {
        // TODO: implement publishing
    }, 500);

    const postUpdateFindingMethod = useDebounceFn((value: FINDING_METHOD) => {
        // TODO: implement publishing
    }, 500);

    const postUpdateFindingApplicationName = useDebounceFn((value: string) => {
        // TODO: implement publishing
    }, 300);

    const postUpdateFindingEnvironment = useDebounceFn((value: string) => {
        // TODO: implement publishing
    }, 300);

    return {
        isDataLoaded,
        isDataLoading,
        finding: findingData,
        creator: creatorData,
        role: roleData,
        findingRiskScore,
        findingRiskLevel,
        findingCreatedDate,
        cvssString,
        cvssScore,
        cvssRating,
        creatorImageUrl,
        initializeData,
        postUpdateFindingCategory,
        postUpdateFindingLocation,
        postUpdateFindingApplicationName,
        postUpdateFindingEnvironment,
        postUpdateFindingMethod,
        postUpdateFindingImpact,
        postUpdateFindingLikelihood,
    };
});
