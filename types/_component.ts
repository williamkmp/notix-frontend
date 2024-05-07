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
