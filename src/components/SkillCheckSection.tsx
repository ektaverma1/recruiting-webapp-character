import React, { useState } from "react";
import { SKILL_LIST } from "../consts";

interface SkillCheckSectionProps {
  skills: Record<string, number>;
  attributes: Record<string, number>;
}

interface SkillCheckResult {
  skillName: string;
  roll: number;
  modifier: number;
  total: number;
  dc: number;
  success: boolean;
}

export const SkillCheckSection: React.FC<SkillCheckSectionProps> = ({
  skills,
  attributes,
}) => {
  const [selectedSkill, setSelectedSkill] = useState(SKILL_LIST[0].name);
  const [dc, setDc] = useState(10);
  const [lastResult, setLastResult] = useState<SkillCheckResult | null>(null);

  const calculateModifier = (score: number) => {
    return Math.floor((score - 10) / 2);
  };

  const handleRoll = () => {
    // Generate random number between 1 and 20
    const roll = Math.floor(Math.random() * 20) + 1;

    // Get the skill's attribute modifier
    const skill = SKILL_LIST.find((s) => s.name === selectedSkill)!;
    const attributeModifier = calculateModifier(
      attributes[skill.attributeModifier]
    );

    // Calculate total (roll + skill points + attribute modifier)
    const skillPoints = skills[selectedSkill];
    const total = roll + skillPoints + attributeModifier;

    // Determine success
    const success = total >= dc;

    setLastResult({
      skillName: selectedSkill,
      roll,
      modifier: skillPoints + attributeModifier,
      total,
      dc,
      success,
    });
  };

  const handleDcChange = (value: string) => {
    const newDc = Math.max(1, parseInt(value) || 0);
    setDc(newDc);
  };

  return (
    <div className="skill-check-container">
      <h2 className="section-title">Skill Check</h2>
      <div className="skill-check-controls">
        <div className="control-group">
          <label htmlFor="skill-select">Skill:</label>
          <select
            id="skill-select"
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
          <label htmlFor="dc-input">DC:</label>
          <input
            id="dc-input"
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

      {lastResult && (
        <div
          className={`skill-check-result ${
            lastResult.success ? "success" : "failure"
          }`}
        >
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
