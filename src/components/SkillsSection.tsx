import React, { useMemo } from "react";
import { SkillRow } from "./SkillRow";
import { SKILL_LIST } from "../consts";

interface SkillsSectionProps {
  skills: Record<string, number>;
  attributes: Record<string, number>;
  onSkillChange: (skillName: string, value: number) => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  skills,
  attributes,
  onSkillChange,
}) => {
  const calculateModifier = (score: number) => {
    return Math.floor((score - 10) / 2);
  };

  const intelligenceScore = attributes["Intelligence"];

  const availableSkillPoints = useMemo(() => {
    const intModifier = calculateModifier(intelligenceScore);
    console.log("Intelligence:", intelligenceScore, "Modifier:", intModifier);
    return 10 + 4 * intModifier;
  }, [intelligenceScore]);

  const spentSkillPoints = useMemo(() => {
    return Object.values(skills).reduce((sum, points) => sum + points, 0);
  }, [skills]);

  const remainingSkillPoints = availableSkillPoints - spentSkillPoints;

  return (
    <div className="skills-container">
      <h2 className="section-title">Skills</h2>
      <div className="skill-points-info">
        Available Skill Points: {remainingSkillPoints} / {availableSkillPoints}
      </div>
      <div className="skills-list">
        {SKILL_LIST.map((skill) => (
          <SkillRow
            key={skill.name}
            name={skill.name}
            points={skills[skill.name]}
            attributeModifier={skill.attributeModifier}
            attributeValue={attributes[skill.attributeModifier]}
            onIncrement={() => {
              if (remainingSkillPoints > 0) {
                onSkillChange(skill.name, skills[skill.name] + 1);
              }
            }}
            onDecrement={() =>
              onSkillChange(skill.name, Math.max(0, skills[skill.name] - 1))
            }
            canIncrement={remainingSkillPoints > 0}
          />
        ))}
      </div>
    </div>
  );
};
