import React, { useState } from "react";
import { SKILL_LIST } from "../consts";

interface Character {
  id: string;
  name: string;
  skills: Record<string, number>;
  attributes: Record<string, number>;
}

interface PartySkillCheckSectionProps {
  characters: Character[];
}

interface PartySkillCheckResult {
  skillName: string;
  characterName: string;
  roll: number;
  modifier: number;
  total: number;
  dc: number;
  success: boolean;
}

export const PartySkillCheckSection: React.FC<PartySkillCheckSectionProps> = ({
  characters,
}) => {
  const [selectedSkill, setSelectedSkill] = useState(SKILL_LIST[0].name);
  const [dc, setDc] = useState(10);
  const [lastResult, setLastResult] = useState<PartySkillCheckResult | null>(
    null
  );

  const calculateModifier = (score: number) => {
    return Math.floor((score - 10) / 2);
  };

  const calculateCharacterSkillTotal = (
    character: Character,
    skillName: string
  ) => {
    const skill = SKILL_LIST.find((s) => s.name === skillName)!;
    const attributeModifier = calculateModifier(
      character.attributes[skill.attributeModifier]
    );
    const skillPoints = character.skills[skillName];
    return skillPoints + attributeModifier;
  };

  const findBestCharacter = (skillName: string) => {
    return characters.reduce((best, current) => {
      const bestTotal = calculateCharacterSkillTotal(best, skillName);
      const currentTotal = calculateCharacterSkillTotal(current, skillName);
      return currentTotal > bestTotal ? current : best;
    }, characters[0]);
  };

  const handleRoll = () => {
    const bestCharacter = findBestCharacter(selectedSkill);
    const roll = Math.floor(Math.random() * 20) + 1;

    const skill = SKILL_LIST.find((s) => s.name === selectedSkill)!;
    const attributeModifier = calculateModifier(
      bestCharacter.attributes[skill.attributeModifier]
    );
    const skillPoints = bestCharacter.skills[selectedSkill];
    const modifier = skillPoints + attributeModifier;
    const total = roll + modifier;

    setLastResult({
      skillName: selectedSkill,
      characterName: bestCharacter.name,
      roll,
      modifier,
      total,
      dc,
      success: total >= dc,
    });
  };

  const handleDcChange = (value: string) => {
    const newDc = Math.max(1, parseInt(value) || 0);
    setDc(newDc);
  };

  // Preview best character for current skill
  const bestCharacter = findBestCharacter(selectedSkill);
  const bestModifier = calculateCharacterSkillTotal(
    bestCharacter,
    selectedSkill
  );

  return (
    <div className="skill-check-container party-skill-check">
      <h2 className="section-title">Party Skill Check</h2>
      <div className="skill-check-controls">
        <div className="control-group">
          <label htmlFor="party-skill-select">Skill:</label>
          <select
            id="party-skill-select"
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="skill-select"
          >
            {SKILL_LIST.map((skill) => (
              <option key={skill.name} value={skill.name}>
                {skill.name}
              </option>
            ))}
          </select>
        </div>
        <div className="control-group">
          <label htmlFor="party-dc-input">DC:</label>
          <input
            id="party-dc-input"
            type="number"
            min="1"
            value={dc}
            onChange={(e) => handleDcChange(e.target.value)}
            className="dc-input"
          />
        </div>
        <button onClick={handleRoll} className="roll-button">
          Roll
        </button>
      </div>

      <div className="best-character-preview">
        Best Character: <span className="highlight">{bestCharacter.name}</span>{" "}
        (Modifier: {bestModifier >= 0 ? "+" : ""}
        {bestModifier})
      </div>

      {lastResult && (
        <div
          className={`skill-check-result ${
            lastResult.success ? "success" : "failure"
          }`}
        >
          <div className="character-info">
            Attempted by:{" "}
            <span className="highlight">{lastResult.characterName}</span>
          </div>
          <div className="roll-details">
            <span className="roll-number">Rolled: {lastResult.roll}</span>
            <span className="modifier">
              Modifier: {lastResult.modifier >= 0 ? "+" : ""}
              {lastResult.modifier}
            </span>
            <span className="total">Total: {lastResult.total}</span>
            <span className="dc">DC: {lastResult.dc}</span>
          </div>
          <div className="result-message">
            {lastResult.success ? "Success!" : "Failure"}
          </div>
        </div>
      )}
    </div>
  );
};
