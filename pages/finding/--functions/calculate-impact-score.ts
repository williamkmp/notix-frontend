import type { FINDING_IMPACT } from '~/types';

export function calculateImpactScore(impact?: FINDING_IMPACT) {
    let score: number;
    switch (impact) {
        case 'INSIGNIFICANT' :
            score = 1;
            break;
        case 'MINOR' :
            score = 2;
            break;
        case 'MODERATE' :
            score = 3;
            break;
        case 'MAJOR' :
            score = 4;
            break;
        case 'CATASTROPHIC' :
            score = 5;
            break;
        default:
            score = 0;
    }
    return score;
}
