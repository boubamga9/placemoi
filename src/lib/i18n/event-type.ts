export type EventType = 'wedding' | 'anniversary' | 'baptism' | 'other';

const eventTypeFrLabels: Record<EventType, string> = {
    wedding: 'Mariage',
    anniversary: 'Anniversaire',
    baptism: 'Baptême',
    other: 'Autre'
};

export function formatEventTypeFr(eventType: string | null | undefined): string {
    if (!eventType) return '';
    const key = eventType as EventType;
    return eventTypeFrLabels[key] ?? 'Autre';
}

