import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Skill {
  name: string;
  value: number;
  color: string;
}

interface SkillsRadarProps {
  skills: Skill[];
  title?: string;
}

export const SkillsRadar: React.FC<SkillsRadarProps> = ({ skills, title }) => {
  const maxValue = 100;
  const centerX = 150;
  const centerY = 150;
  const radius = 120;
  const numberOfLevels = 4;

  // Calculate points for each skill
  const getSkillPoints = (skill: Skill, index: number) => {
    const angle = (Math.PI * 2 * index) / skills.length - Math.PI / 2;
    const value = (skill.value / maxValue) * radius;
    const x = centerX + Math.cos(angle) * value;
    const y = centerY + Math.sin(angle) * value;
    return { x, y };
  };

  // Generate points for the background grid
  const getGridPoints = (level: number) => {
    const points = [];
    const value = (radius * (level + 1)) / numberOfLevels;
    
    for (let i = 0; i < skills.length; i++) {
      const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
      const x = centerX + Math.cos(angle) * value;
      const y = centerY + Math.sin(angle) * value;
      points.push({ x, y });
    }
    
    return points;
  };

  // Create the path for the skill polygon
  const createSkillPath = () => {
    return skills.map((skill, index) => {
      const point = getSkillPoints(skill, index);
      return index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`;
    }).join(" ") + " Z";
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        {title && <CardTitle className="text-lg font-medium">{title}</CardTitle>}
      </CardHeader>
      <CardContent>
        <div className="relative w-[300px] h-[300px] mx-auto">
          <svg width="300" height="300" className="transform rotate-0">
            {/* Background grid */}
            {Array.from({ length: numberOfLevels }).map((_, level) => {
              const gridPoints = getGridPoints(level);
              const path = gridPoints.map((point, i) => 
                i === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
              ).join(" ") + " Z";
              
              return (
                <path
                  key={level}
                  d={path}
                  fill="none"
                  stroke="rgba(148, 163, 184, 0.1)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Axis lines */}
            {skills.map((_, index) => {
              const angle = (Math.PI * 2 * index) / skills.length - Math.PI / 2;
              const endX = centerX + Math.cos(angle) * radius;
              const endY = centerY + Math.sin(angle) * radius;
              
              return (
                <line
                  key={index}
                  x1={centerX}
                  y1={centerY}
                  x2={endX}
                  y2={endY}
                  stroke="rgba(148, 163, 184, 0.1)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Skills polygon */}
            <path
              d={createSkillPath()}
              fill="rgba(0, 200, 150, 0.1)"
              stroke="#00C896"
              strokeWidth="2"
              className="transition-all duration-500"
            />

            {/* Skill points */}
            {skills.map((skill, index) => {
              const point = getSkillPoints(skill, index);
              return (
                <circle
                  key={index}
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill="#00C896"
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>

          {/* Labels */}
          {skills.map((skill, index) => {
            const angle = (Math.PI * 2 * index) / skills.length - Math.PI / 2;
            const labelRadius = radius + 30;
            const x = centerX + Math.cos(angle) * labelRadius;
            const y = centerY + Math.sin(angle) * labelRadius;
            
            return (
              <div
                key={index}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 text-sm text-muted-foreground"
                style={{
                  left: x,
                  top: y,
                  textAlign: "center",
                }}
              >
                {skill.name}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {skills.map((skill, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00C896]" />
              <span className="text-sm text-muted-foreground">
                {skill.name}: {skill.value}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillsRadar; 