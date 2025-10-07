
// Define the type for an Entry
interface JournalEntry {
    id: string;
    type: string;
    mood: string;
    content: string;
    date: string;
    isFavorite: boolean;
}