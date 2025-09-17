export interface RoomFilters {
    isEnabled?: boolean;
    search?: string;
    building?: string;
    floor?: number;
    limit?: number;
    offset?: number;
}

export interface RoomFilterOptions {
    buildings: FilterOption[],
    floors: FilterOption[],
    names: FilterOption[],
}

export interface Room {
    id: string,
    name: string,
    building: string,
    floor: number,
    capacity: number,
    isEnabled: boolean,
    humidity: number | null,
    movement: number | null,
    pressure: number | null,
    temperature: number | null,
}

export interface RoomSensorBlock {
    label: string,
    value: string,
    hasValue: boolean,
    icon?: string,
    color: string,
    bg: string,
    unit: string,
}

export interface RoomUpdate {
    name: string,
    building: string,
    floor: number,
    capacity: number,
}