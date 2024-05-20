import type { Dayjs } from 'dayjs';

export type USER_ROLE = 'VIEWER' | 'DEVELOPER' | 'TECHNICAL_WRITER' | 'PENETRATION_TESTER' | 'PROJECT_MANAGER';

export type SubprojectStatus = 'NOT_STARTED' | 'ON_GOING' | 'FINISHED';

export type PROJECT_STATUS = 'FINISHED' | 'NOT_STARTED' | 'ON_GOING';

export type PREVIEW_ACTION = 'ADD_CHILD' | 'UPDATE_SELF' | 'DELETE_SELF' | 'DELETE_CHILD';

export type ACTION = 'ADD' | 'UPDATE' | 'DELETE';

export type FILE_TYPE = 'ATTACHMENT' | 'REPORT' | 'PUBLIC';

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
}

export interface LoginDto {
    user: UserDto;
    token: TokenDto;
}

export interface InviteDto {
    email: string;
    role: USER_ROLE;
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
    createdAt: string;
}
