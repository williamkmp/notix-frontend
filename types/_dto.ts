import type { Dayjs } from 'dayjs';

export type USER_ROLE = 'CONSULTANT' | 'MEMBER' | 'DEVELOPER' | 'TECHNICAL_WRITER' | 'PROJECT_MANAGER';

export type PROJECT_ROLE = 'MEMBER' | 'DEVELOPER' | 'TECHNICAL_WRITER';

export type SubprojectStatus = 'NOT_STARTED' | 'ON_GOING' | 'FINISHED';

export type PROJECT_STATUS = 'FINISHED' | 'NOT_STARTED' | 'ON_GOING';

export type PREVIEW_ACTION = 'ADD_CHILD' | 'UPDATE_SELF' | 'DELETE_SELF' | 'DELETE_CHILD';

export type ACTION = 'ADD' | 'UPDATE' | 'DELETE';

export type FILE_TYPE = 'ATTACHMENT' | 'REPORT' | 'PUBLIC';

export type CVSS_RATING = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface EventDto {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
}

export interface UserDto {
    id: string;
    email: string;
    fullName: string;
    imageId?: string;
}

export interface TokenDto {
    accessToken: string;
    refreshToken: string;
}

export interface FileDto {
    id: string;
    uploaderId: string;
    name: string;
    size: number;
    type: FILE_TYPE;
    url: string;
    contentType: string;
    createdAt: string;
}

export interface FileActionDto extends FileDto {
    action: ACTION;
}

export interface LoginDto {
    user: UserDto;
    token: TokenDto;
}

export interface InviteDto {
    email: string;
    role: PROJECT_ROLE;
}

export interface ProjectDto {
    id: string;
    name: string;
    imageId?: string;
    ownerId: string;
    startDate: string;
    endDate: string;
}

export interface PreviewDto {
    id: string;
    name: string;
    imageId?: string;
}

export interface PreviewActionDto extends PreviewDto {
    action: PREVIEW_ACTION;
}

export interface ProjectHeaderDto extends ProjectDto {
    role: USER_ROLE;
}

export interface SubprojectDto {
    id: string;
    projectId: string;
    name: string;
    startDate: string;
    endDate: string;
    imageId?: string;
}

export interface SubprojectActionDto extends SubprojectDto {
    action: ACTION;
}

export interface SubprojectData {
    id: string;
    projectId: string;
    name: string;
    startDate: Dayjs;
    endDate: Dayjs;
    imageId?: string;
}

export interface MemberDto extends UserDto {
    role: USER_ROLE;
}

export interface MemberActionDto extends MemberDto {
    action: ACTION;
}

export interface LogDto {
    id: string;
    title: string;
    message: string;
    userId: string;
    projectId: string;
    subprojectId: string;
    findingId: string;
    createdAt: string;
}

export interface FindingDto {
    id: string;
    name: string;
    creatorId: string;
    createdAt: string;
    findingDetail: FindingDetail;
    cvssDetail: CvssDetail;
}

export type FINDING_CATEGORY =
    'INFRASTRUCTURE' |
    'API' |
    'IOS' |
    'ANDROID' |
    'WEB' |
    'MOBILE';

export type FINDING_LOCATION =
    'INTERNAL' |
    'EXTERNAL';

export type FINDING_METHOD =
    'WHITE_BOX' |
    'BLACK_BOX' |
    'GREY_BOX';

export type FINDING_LIKELIHOOD =
    'RARE' |
    'UNLIKELY' |
    'POSSIBLE' |
    'LIKELY' |
    'CERTAINLY';

export type FINDING_IMPACT =
    'INSIGNIFICANT' |
    'MINOR' |
    'MODERATE' |
    'MAJOR' |
    'CATASTROPHIC';

export type FINDING_RISK =
    'LOW' |
    'MEDIUM' |
    'HIGH' |
    'EXTREME';

export interface FindingDetail {
    caregory?: FINDING_CATEGORY;
    location?: FINDING_LOCATION;
    method?: FINDING_METHOD;
    likelihood?: FINDING_LIKELIHOOD;
    impact?: FINDING_IMPACT;
    isInformational: boolean;
}

export interface CvssDetail {

}

export interface FindingGetResponse {
    finding: FindingDto;
    role: USER_ROLE;
    creator: UserDto;
}
