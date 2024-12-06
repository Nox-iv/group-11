export class BranchOpeningHours {
    private dayOfWeekToOpeningHours : Map<number, [number, number][]>

    constructor(dayOfWeekToOpeningHours : Map<number, [number, number][]> = new Map()) {
        this.dayOfWeekToOpeningHours = dayOfWeekToOpeningHours
    }

    getOpeningHoursForDay(dayOfWeek : number) : [number, number][] {
        return this.dayOfWeekToOpeningHours.get(dayOfWeek) ?? []
    }
}