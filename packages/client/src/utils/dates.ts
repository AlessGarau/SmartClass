import { getISOWeek, setISOWeek, format, addDays, startOfISOWeek, getISOWeeksInYear } from 'date-fns';
import { fr } from 'date-fns/locale';

export const getDatesOfWeek = (weekNumber: number, year: number) => {
    const startOfYear = new Date(year, 0, 1);
    const targetWeek = setISOWeek(startOfYear, weekNumber);
    const monday = startOfISOWeek(targetWeek);

    const weekDays = ['LUN', 'MAR', 'MER', 'JEU', 'VEN'];
    return weekDays.map((day, i) => {
        const date = addDays(monday, i);
        return {
            day,
            date: format(date, 'dd/MM', { locale: fr }),
            fullDate: date
        };
    });
};

export const getCurrentWeekNumber = () => {
    const now = new Date();
    return getISOWeek(now);
};

export const getWeeksInYear = (year: number): number => {
    return getISOWeeksInYear(new Date(year, 0, 1));
};

export const getWeekDateRange = (weekNumber: number, year: number) => {
    const startOfYear = new Date(year, 0, 1);
    const targetWeek = setISOWeek(startOfYear, weekNumber);
    const monday = startOfISOWeek(targetWeek);
    const friday = addDays(monday, 4);
    
    return {
        startDate: monday,
        endDate: friday,
        label: `${format(monday, 'dd-MMM-yyyy', { locale: fr })} - ${format(friday, 'dd-MMM-yyyy', { locale: fr })}`
    };
};
