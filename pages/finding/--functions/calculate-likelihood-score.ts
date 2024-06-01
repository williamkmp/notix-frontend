import type { FINDING_LIKELIHOOD } from '~/types';

export function calculateLikelihoodScore(likelihood?: FINDING_LIKELIHOOD) {
    let score: number;
    switch (likelihood) {
        case 'RARE' :
            score = 1;
            break;
        case 'UNLIKELY' :
            score = 2;
            break;
        case 'POSSIBLE' :
            score = 3;
            break;
        case 'LIKELY' :
            score = 4;
            break;
        case 'CERTAINLY' :
            score = 5;
            break;
        default:
            score = 0;
    }
    return score;
}
