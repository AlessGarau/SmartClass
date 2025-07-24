import { getISOWeek, setISOWeek, format, addDays, startOfISOWeek } from 'date-fns';
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
