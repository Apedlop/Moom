import { View, StyleSheet, useWindowDimensions } from "react-native";
import React, { useState, useEffect } from "react";
import Svg, { G, Circle, Text as SvgText, Rect } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import InfoPhase from "./InfoPhase";
import { formatDate } from "../utils/dateUtils";

function getCurrentCycleDay(startDate) {
  const msPerDay = 24 * 60 * 60 * 1000;
  const start = new Date(startDate);
  const today = new Date();

  const days = Math.floor(
    (Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) -
      Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())) /
      msPerDay
  );

  return days + 1;
}

const darkenColor = (hex) => {
  const factor = 0.7;
  const num = parseInt(hex.slice(1), 16);
  const r = Math.floor(((num >> 16) & 255) * factor);
  const g = Math.floor(((num >> 8) & 255) * factor);
  const b = Math.floor((num & 255) * factor);
  return `rgb(${r},${g},${b})`;
};

export default function CycleCircle({ user, prediction, cycle }) {
  const { width } = useWindowDimensions();
  const radius = width * 0.4;
  const strokeWidth = width * 0.07;
  const size = (radius + strokeWidth) * 2;
  const center = size / 2;
  const totalAngle = 300;
  const gap = 70;
  const startAngle = 360 - gap / 2;
  const circumference = 2 * Math.PI * radius;

  const startDate = cycle.startDate;
  const cycleLength = cycle.cycleLength;
  const menstruationLength = cycle.menstruationDuration;

  const [phases, setPhases] = useState([]);
  const [currentDayAbsolute, setCurrentDayAbsolute] = useState(() =>
    getCurrentCycleDay(startDate)
  );
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [manualSelection, setManualSelection] = useState(false);

  useEffect(() => {
    if (!user?.id || !startDate || !cycleLength || !menstruationLength) {
      console.log("Esperando a que estén todos los parámetros definidos...");
      return;
    }
    console.log("CycleCircle props:", { user, prediction, cycle });

    const processedPhases = cycle.phases.map((phase) => {
      const start = new Date(phase.startDay);
      const end = new Date(phase.endDay);
      const days = (end - start) / (1000 * 60 * 60 * 24) + 1;

      return {
        name: phase.phaseCycle,
        days,
        color: phase.color,
        description: phase.description,
      };
    });

    setPhases(processedPhases);
  }, [user?.id, startDate, cycleLength, menstruationLength]);

  useEffect(() => {
    const updateDay = () => {
      setCurrentDayAbsolute(getCurrentCycleDay(startDate));
    };

    let intervalId;

    const now = new Date();
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0,
      0
    );
    const timeUntilMidnight = nextMidnight.getTime() - now.getTime();

    const timeoutId = setTimeout(() => {
      updateDay();
      intervalId = setInterval(updateDay, 24 * 60 * 60 * 1000);
    }, timeUntilMidnight);

    updateDay();

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [startDate, cycleLength]);

  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("MenstrualForm", { prediction });
  };
  // Calcula el día dentro del ciclo (módulo)
  const currentDayInCycle = ((currentDayAbsolute - 1) % cycleLength) + 1;

  useEffect(() => {
    if (!manualSelection && phases.length > 0) {
      let acc = 0;
      for (const phase of phases) {
        acc += phase.days;
        if (currentDayInCycle <= acc) {
          setSelectedPhase(phase);
          break;
        }
      }
    }
  }, [currentDayInCycle, manualSelection, phases]);

  const phasesTotalDays = phases.reduce((sum, p) => sum + p.days, 0);

  // Aquí determinamos si hay retraso: cuando el día absoluto es mayor que la suma total de días de fases (es decir, mayor que cicloLength)
  const delayedDays =
    currentDayAbsolute - phasesTotalDays > 0
      ? currentDayAbsolute - phasesTotalDays
      : 0;

  // Para el progreso, si hay retraso la bolita queda al final del arco (día final del ciclo)
  // Si no hay retraso, la bolita avanza normalmente según currentDayInCycle
  const progressFraction =
    delayedDays > 0 ? 1 : currentDayInCycle / cycleLength;
  const progressAngle = startAngle - progressFraction * totalAngle;
  const angleRad = (progressAngle - 90) * (Math.PI / 180);
  const ballX = center + radius * Math.cos(angleRad);
  const ballY = center + radius * Math.sin(angleRad);
  const ballRadius = radius * 0.11;
  const arcLength = (angle) => (angle / 360) * circumference;

  let rotationLight = startAngle;
  let rotationDark = startAngle;
  let accumulatedDays = 0;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G origin={`${center}, ${center}`} rotation={-90}>
          {phases.map((phase, index) => {
            const phaseAngle = (phase.days / cycleLength) * totalAngle;
            rotationLight -= phaseAngle;
            return (
              <Circle
                key={`phase-light-${index}`}
                cx={center}
                cy={center}
                r={radius}
                stroke={phase.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${arcLength(phaseAngle)}, ${circumference}`}
                rotation={rotationLight}
                origin={`${center}, ${center}`}
                strokeLinecap="round"
                fill="none"
                onPress={() => {
                  setSelectedPhase(phase);
                  setManualSelection(true);
                }}
              />
            );
          })}

          {phases.map((phase, index) => {
            const phaseAngle = (phase.days / cycleLength) * totalAngle;
            // Aquí calculamos el ángulo lleno según el progreso real, pero si hay retraso, solo rellenamos hasta el final del ciclo
            const filledDays =
              delayedDays > 0
                ? Math.min(phase.days, phase.days) // rellena toda la fase (porque el retraso significa que estamos más allá)
                : Math.min(
                    phase.days,
                    Math.max(0, currentDayInCycle - accumulatedDays)
                  );
            const filledAngle = (filledDays / cycleLength) * totalAngle;

            if (filledDays <= 0) {
              rotationDark -= phaseAngle;
              accumulatedDays += phase.days;
              return null;
            }

            rotationDark -= filledAngle;

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

            rotationDark -= phaseAngle - filledAngle;
            accumulatedDays += phase.days;
            return arc;
          })}
        </G>

        <Circle
          cx={ballX}
          cy={ballY}
          r={ballRadius + 10}
          fill="#e91e63"
          stroke="#fff"
          strokeWidth={2}
        />
        <SvgText
          x={ballX}
          y={ballY + ballRadius / 3}
          fill="#fff"
          fontSize={radius * 0.1}
          fontWeight="bold"
          textAnchor="middle"
        >
          {delayedDays > 0 ? currentDayAbsolute : currentDayInCycle}
        </SvgText>

        <SvgText
          x={center}
          y={center * 0.9}
          fill="#333"
          fontSize={radius * 0.12}
          fontWeight="bold"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {delayedDays > 0
            ? `Tienes un retraso de ${delayedDays} día${
                delayedDays > 1 ? "s" : ""
              }`
            : "Tu próximo periodo en:"}
        </SvgText>
        {delayedDays === 0 && (
          <>
            <SvgText
              x={center * 0.70}
              y={center + radius * 0.08}
              fill="#333"
              fontSize={radius * 0.08}
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {prediction?.daysUntilPeriod ?? "-"}             días ➝
              {formatDate(prediction?.nextPeriodDate) ?? "-"}
            </SvgText>

            {/* Botón rectángulo con + dentro */}
            <Rect
              x={center - radius * 0.125} // Centrar el rect
              y={center + radius * 0.22} // Justo debajo del texto (ajusta si quieres)
              width={radius * 0.27} // Ancho suficiente para el +
              height={radius * 0.27}
              fill="#600000"
              rx={radius * 0.05}
              ry={radius * 0.05}
              onPress={handlePress}
            />
            <SvgText
              x={center * 1.01} // Centro horizontalmente dentro del rectángulo
              y={center + radius * 0.37} // Centrar verticalmente dentro del rectángulo (y + height/2)
              fill="white"
              fontSize={radius * 0.15} // Más grande para el +
              fontWeight="bold"
              textAnchor="middle"
              alignmentBaseline="middle"
              onPress={handlePress}
            >
              ＋
            </SvgText>
          </>
        )}
      </Svg>

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
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  phaseInfo: {
    paddingHorizontal: 20,
  },
});
