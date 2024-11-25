import { useState, useEffect } from "react";
import { ATTRIBUTE_LIST, SKILL_LIST } from "./consts";
import { AttributesSection } from "./components/AttributesSection";
import { ClassesSection } from "./components/ClassesSection";
import { SkillsSection } from "./components/SkillsSection";
import { SkillCheckSection } from "./components/SkillCheckSection";
import { PartySkillCheckSection } from "./components/PartySkillCheckSection";
import {
  saveCharacters,
  loadCharacters,
  Character,
} from "./services/characterService";
import "./App.css";

const MAX_TOTAL_ATTRIBUTES = 70;

function App() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [activeCharacterId, setActiveCharacterId] = useState<string>("1");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initializeDefaultCharacter = () => [
    {
      id: "1",
      name: "Character 1",
      attributes: ATTRIBUTE_LIST.reduce(
        (acc, attr) => ({ ...acc, [attr]: 10 }),
        {}
      ),
      skills: SKILL_LIST.reduce(
        (acc, skill) => ({ ...acc, [skill.name]: 0 }),
        {}
      ),
      selectedClass: null,
    },
  ];

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const loadedCharacters = await loadCharacters();
        if (loadedCharacters.length > 0) {
          setCharacters(loadedCharacters);
          setActiveCharacterId(loadedCharacters[0].id);
        } else {
          setCharacters(initializeDefaultCharacter());
        }
      } catch (err) {
        setError("Failed to load characters");
        setCharacters(initializeDefaultCharacter());
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  useEffect(() => {
    if (!isLoading && characters.length > 0) {
      const saveTimeout = setTimeout(() => {
        saveCharacters(characters).catch(() => {
          setError("Failed to save characters");
        });
      }, 1000);

      return () => clearTimeout(saveTimeout);
    }
  }, [characters, isLoading]);

  const calculateTotalAttributes = (attributes: Record<string, number>) => {
    return Object.values(attributes).reduce((sum, value) => sum + value, 0);
  };

  const handleAddCharacter = () => {
    const newId = (
      Math.max(...characters.map((c) => parseInt(c.id))) + 1
    ).toString();
    const newCharacter: Character = {
      id: newId,
      name: `Character ${newId}`,
      attributes: ATTRIBUTE_LIST.reduce(
        (acc, attr) => ({ ...acc, [attr]: 10 }),
        {}
      ),
      skills: SKILL_LIST.reduce(
        (acc, skill) => ({ ...acc, [skill.name]: 0 }),
        {}
      ),
      selectedClass: null,
    };
    setCharacters((prev) => [...prev, newCharacter]);
    setActiveCharacterId(newId);
  };

  const handleRemoveCharacter = (id: string) => {
    if (characters.length > 1) {
      setCharacters((prev) => prev.filter((c) => c.id !== id));
      if (activeCharacterId === id) {
        setActiveCharacterId(characters.find((c) => c.id !== id)!.id);
      }
    }
  };

  const handleCharacterNameChange = (id: string, newName: string) => {
    setCharacters((prev) =>
      prev.map((char) => (char.id === id ? { ...char, name: newName } : char))
    );
  };

  const handleAttributeChange = (attribute: string, value: number) => {
    const activeCharacter = characters.find((c) => c.id === activeCharacterId)!;
    const currentTotal = calculateTotalAttributes(activeCharacter.attributes);
    const change = value - activeCharacter.attributes[attribute];

    if (change < 0 || currentTotal + change <= MAX_TOTAL_ATTRIBUTES) {
      setCharacters((prev) =>
        prev.map((char) =>
          char.id === activeCharacterId
            ? {
                ...char,
                attributes: {
                  ...char.attributes,
                  [attribute]: value,
                },
              }
            : char
        )
      );
    }
  };

  const handleSkillChange = (skillName: string, value: number) => {
    setCharacters((prev) =>
      prev.map((char) =>
        char.id === activeCharacterId
          ? {
              ...char,
              skills: {
                ...char.skills,
                [skillName]: value,
              },
            }
          : char
      )
    );
  };

  const handleClassSelect = (className: string) => {
    setCharacters((prev) =>
      prev.map((char) =>
        char.id === activeCharacterId
          ? {
              ...char,
              selectedClass:
                char.selectedClass === className ? null : className,
            }
          : char
      )
    );
  };

  if (isLoading) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Loading characters...</h1>
        </header>
      </div>
    );
  }

  const activeCharacter = characters.find((c) => c.id === activeCharacterId)!;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Character Sheets</h1>
      </header>
      <section className="App-section">
        <div className="characters-nav">
          <div className="character-tabs">
            {characters.map((char) => (
              <div
                key={char.id}
                className={`character-tab ${
                  char.id === activeCharacterId ? "active" : ""
                }`}
                onClick={() => setActiveCharacterId(char.id)}
              >
                <input
                  type="text"
                  value={char.name}
                  onChange={(e) =>
                    handleCharacterNameChange(char.id, e.target.value)
                  }
                  onClick={(e) => e.stopPropagation()}
                />
                {characters.length > 1 && (
                  <button
                    className="remove-character-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveCharacter(char.id);
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button className="add-character-btn" onClick={handleAddCharacter}>
              +
            </button>
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="content-container">
          <div className="attributes-info">
            Total Attribute Points:{" "}
            {calculateTotalAttributes(activeCharacter.attributes)}/
            {MAX_TOTAL_ATTRIBUTES}
          </div>
          <AttributesSection
            attributes={activeCharacter.attributes}
            onAttributeChange={handleAttributeChange}
            maxPointsReached={
              calculateTotalAttributes(activeCharacter.attributes) >=
              MAX_TOTAL_ATTRIBUTES
            }
          />
          <ClassesSection
            selectedClass={activeCharacter.selectedClass}
            attributes={activeCharacter.attributes}
            onClassSelect={handleClassSelect}
          />
          <SkillsSection
            skills={activeCharacter.skills}
            attributes={activeCharacter.attributes}
            onSkillChange={handleSkillChange}
          />
          <SkillCheckSection
            skills={activeCharacter.skills}
            attributes={activeCharacter.attributes}
          />
          <PartySkillCheckSection characters={characters} />
        </div>
      </section>
    </div>
  );
}

export default App;
