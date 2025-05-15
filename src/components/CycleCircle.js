import { View, StyleSheet, useWindowDimensions, PanResponder } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import Svg, { G, Circle, Text as SvgText } from "react-native-svg";
import InfoPhase from "./InfoPhase";
import { getCurrentCycleDay, getDateFromCycleDay } from "../utils/dateUtils";
import { cycle_days } from "../config";

const phases = [
  { name: "Menstrual", days: 5, color: "#f28b82", description: "Sangrado y liberación del revestimiento uterino. Sangrado y liberación del revestimiento uterino. Sangrado y liberación del revestimiento uterino. Sangrado y liberación del revestimiento uterino. Sangrado y liberación del revestimiento uterino. Sangrado y liberación del revestimiento uterino. Sangrado y liberación del revestimiento uterino. Sangrado y liberación del revestimiento uterino. Sangrado y liberación del revestimiento uterino. Sangrado y liberación del revestimiento uterino. Sangrado y liberación del revestimiento uterino. Sangrado y liberación del revestimiento uterino. Sangrado y liberación del revestimiento uterino. Sangrado y liberación del revestimiento uterino. Sangrado y liberación del revestimiento uterino. Sangrado y liberación del revestimiento uterino. Sangrado y liberación del revestimiento uterino. Sangrado y liberación del revestimiento uterino. Sangrado y liberación del revestimiento uterino. Sangrado y liberación del revestimiento uterino." },
  { name: "Folicular", days: 9, color: "#aecbfa", description: "Crecimiento de folículos en los ovarios." },
  { name: "Ovulación", days: 6, color: "#fff475", description: "Liberación del óvulo maduro." },
  { name: "Lútea", days: 8, color: "#d7aefb", description: "Preparación del útero para un posible embarazo." },
];

const darkenColor = (hex) => {
  const factor = 0.7;
  const num = parseInt(hex.slice(1), 16);
  const r = Math.floor(((num >> 16) & 255) * factor);
  const g = Math.floor(((num >> 8) & 255) * factor);
  const b = Math.floor((num & 255) * factor);
  return `rgb(${r},${g},${b})`;
};

export default function CycleCircle() {
  const { width } = useWindowDimensions();
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [manualSelection, setManualSelection] = useState(false);
  const [currentDay, setCurrentDay] = useState(27); // Indica el día actual del ciclo
  const [previewDay, setPreviewDay] = useState(27); // Indica el día en el que está el puntero 

  const nextPeriod = cycle_days - currentDay;
  const radius = width * 0.4;
  const strokeWidth = width * 0.07;
  const size = (radius + strokeWidth) * 2;
  const center = size / 2;
  const totalAngle = 300;
  const gap = 70;
  const startAngle = gap / 2;
  const circumference = 2 * Math.PI * radius;

  const arcLength = (angle) => (angle / 360) * circumference;

  const getPhaseByDay = (day) => {
    let count = 0;
    for (const phase of phases) {
      count += phase.days;
      if (day <= count) return phase;
    }
    return null;
  };

  useEffect(() => {
    if (!manualSelection) {
      const phase = getPhaseByDay(previewDay);
      setSelectedPhase(phase);
    }
  }, [previewDay]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e) => {
        const { locationX, locationY } = e.nativeEvent;
        const dx = locationX - center;
        const dy = locationY - center;

        let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        if (angle < 0) angle += 360;

        if (angle >= startAngle && angle <= startAngle + totalAngle) {
          const relativeAngle = angle - startAngle;
          const day = Math.round((relativeAngle / totalAngle) * cycle_days);
          setPreviewDay(Math.min(Math.max(day, 1), cycle_days));
          setManualSelection(false);
        }
      },
      onPanResponderRelease: () => {
        setCurrentDay(previewDay);
      },
    })
  ).current;

  const progressAngle = (previewDay / cycle_days) * totalAngle + startAngle;
  const angleRad = (progressAngle - 90) * (Math.PI / 180);
  const x = center + radius * Math.cos(angleRad);
  const y = center + radius * Math.sin(angleRad);
  const radioDial = radius * 0.11;

  let rotation = startAngle;
  let dayCounter = 0;

  return (
    <View style={styles.container}>
      <View {...panResponder.panHandlers}>
        <Svg style={{ width: size, height: size }}>
          <G origin={`${center}, ${center}`} rotation={-90}>
            {phases.map((phase, index) => {
              const phaseAngle = (phase.days / cycle_days) * totalAngle;

              const arc = (
                <Circle
                  key={`phase-light-${index}`}
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke={phase.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${arcLength(phaseAngle)}, ${circumference}`}
                  rotation={rotation}
                  origin={`${center}, ${center}`}
                  strokeLinecap="round"
                  fill="none"
                  onPress={() => {
                    setSelectedPhase(phase);
                    setManualSelection(true);
                  }}
                />
              );

              rotation += phaseAngle;
              dayCounter += phase.days;

              return arc;
            })}

            {(() => {
              let rotationDark = startAngle;
              let accumulatedDays = 0;
              return phases.map((phase, index) => {
                const phaseAngle = (phase.days / cycle_days) * totalAngle;

                if (accumulatedDays >= currentDay) return null;

                const remainingDaysInPhase = Math.min(phase.days, currentDay - accumulatedDays);
                const filledAngle = (remainingDaysInPhase / cycle_days) * totalAngle;

                const arc = (
                  <Circle
                    key={`phase-dark-${index}`}
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={darkenColor(phase.color)}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${arcLength(filledAngle)}, ${circumference}`}
                    rotation={rotationDark}
                    origin={`${center}, ${center}`}
                    strokeLinecap="round"
                    fill="none"
                    onPress={() => {
                      setSelectedPhase(phase);
                      setManualSelection(true);
                    }}
                  />
                );

                rotationDark += phaseAngle;
                accumulatedDays += phase.days;
                return arc;
              });
            })()}
          </G>

          <Circle
            cx={x}
            cy={y}
            r={radioDial + 10}
            fill="#e91e63"
            stroke="#fff"
            strokeWidth={2}
          />
          <SvgText
            x={x}
            y={y + (radioDial / 3)}
            fill="#fff"
            fontSize={radius * 0.1}
            fontWeight="bold"
            textAnchor="middle"
          >
            {previewDay}
          </SvgText>

          <SvgText
            x={center}
            y={center}
            fill="#333"
            fontSize={radius * 0.12}
            fontWeight="bold"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            Tu próximo periodo n:
          </SvgText>
          <SvgText
            x={center}
            y={center + radius * 0.18}
            fill="#333"
            fontSize={radius * 0.08}
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {nextPeriod} días
          </SvgText>
        </Svg>
      </View>

      {selectedPhase && (
        <View style={styles.phaseInfo}>
          <InfoPhase selectedPhase={selectedPhase} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  phaseInfo: {
    marginTop: 20,
    alignItems: "center",
    paddingHorizontal: 20,
  },
});
