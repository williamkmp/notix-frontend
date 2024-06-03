import type { Dayjs } from 'dayjs';
import type { EventDto } from './_dto';

export type DateDisplayMode = 'DISABLED' | 'INACTIVE' | 'ACTIVE';

export interface DateDisplayBoxProps {
    date: Dayjs;
    event: EventDto[];
    mode: DateDisplayMode;
    isToday: boolean;
}

export interface RangeDatePickerModel {
    start: Date;
    end: Date;
}

export interface PropertyOption<T extends string = string> {
    value: T;
    label: string;
}

export type UI_COLOR = 'red' | 'green' | 'blue' | 'white' | 'gray' | 'slate' | 'orage';
