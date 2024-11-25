const API_BASE_URL = 'https://recruiting.verylongdomaintotestwith.ca/api/{ektaverma1}/character';

export interface Character {
    id: string;
    name: string;
    attributes: Record<string, number>;
    skills: Record<string, number>;
    selectedClass: string | null;
}

export const saveCharacters = async (characters: Character[]): Promise<void> => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ characters }),
        });

        if (!response.ok) {
            throw new Error(`Failed to save characters: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error saving characters:', error);
        throw error;
    }
};

export const loadCharacters = async (): Promise<Character[]> => {
    try {
        const response = await fetch(API_BASE_URL);

        if (!response.ok) {
            throw new Error(`Failed to load characters: ${response.statusText}`);
        }

        const data = await response.json();
        return data.characters || [];
    } catch (error) {
        console.error('Error loading characters:', error);
        return [];
    }
};