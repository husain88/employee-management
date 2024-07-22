export interface Employee {
    id?: number;
    name: string;
    role: string;
    startDate: string | null;
    endDate?: string | null;
}