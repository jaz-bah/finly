

export function isCurrentMonth(date: string) {
    const now = new Date();
    const d = new Date(date);

    return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth()
    );
}


export function isPreviousMonth(date: string) {
    const now = new Date();
    const d = new Date(date);

    // Calculate previous month
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    return (
        d.getFullYear() === prevMonth.getFullYear() &&
        d.getMonth() === prevMonth.getMonth()
    );
}
