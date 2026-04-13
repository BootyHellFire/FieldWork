import React from "react";
import Svg, { Circle, Line, Rect, Text as SvgText } from "react-native-svg";

import { colors } from "@/constants/theme";
import type { DiagramSpec, MeasurementJson } from "@/types/schema";

type Props = {
  measurements?: MeasurementJson | null;
  spec?: DiagramSpec | null;
  width?: number;
  height?: number;
};

function deriveSpec(measurements?: MeasurementJson | null): DiagramSpec | null {
  if (!measurements) return null;

  const dimensions: DiagramSpec["dimensions"] = [];
  if (measurements.height_from_finished_floor_inches) {
    dimensions.push({
      label: `${measurements.height_from_finished_floor_inches}" AFF`,
      position: "vertical",
    });
  }
  if (measurements.offset_from_left_wall_inches) {
    dimensions.push({
      label: `${measurements.offset_from_left_wall_inches}" from left`,
      position: "left",
    });
  }
  if (measurements.offset_from_right_wall_inches) {
    dimensions.push({
      label: `${measurements.offset_from_right_wall_inches}" from right`,
      position: "right",
    });
  }
  if (measurements.centered_on) {
    dimensions.push({
      label: `Centered on ${measurements.centered_on}`,
      position: "center",
    });
  }

  if (dimensions.length === 0) return null;

  return {
    wallLabel: "Wall",
    floorLabel: "Floor",
    deviceLabel: "Device",
    dimensions,
  };
}

export function DiagramPreview({ measurements, spec, width = 280, height = 220 }: Props) {
  const resolved = spec ?? deriveSpec(measurements);
  if (!resolved) return null;

  return (
    <Svg width={width} height={height} viewBox="0 0 280 220">
      <Rect x="0" y="0" width="280" height="220" rx="16" fill="#FFF8EE" />
      <Line x1="40" y1="40" x2="40" y2="180" stroke={colors.text} strokeWidth="3" />
      <Line x1="40" y1="180" x2="240" y2="180" stroke={colors.text} strokeWidth="3" />
      <Circle cx="140" cy="95" r="12" fill={colors.primary} />
      <SvgText x="18" y="32" fontSize="12" fill={colors.textMuted}>
        {resolved.wallLabel ?? "Wall"}
      </SvgText>
      <SvgText x="210" y="196" fontSize="12" fill={colors.textMuted}>
        {resolved.floorLabel ?? "Finished floor"}
      </SvgText>
      <SvgText x="122" y="78" fontSize="11" fill={colors.text}>
        {resolved.deviceLabel ?? "Fixture"}
      </SvgText>

      {resolved.dimensions.map((dimension, index) => {
        if (dimension.position === "vertical") {
          return (
            <React.Fragment key={`${dimension.label}-${index}`}>
              <Line x1="78" y1="95" x2="78" y2="180" stroke={colors.info} strokeWidth="2" />
              <SvgText x="86" y="142" fontSize="12" fill={colors.info}>
                {dimension.label}
              </SvgText>
            </React.Fragment>
          );
        }

        if (dimension.position === "left") {
          return (
            <React.Fragment key={`${dimension.label}-${index}`}>
              <Line x1="40" y1="122" x2="140" y2="122" stroke={colors.info} strokeWidth="2" />
              <SvgText x="48" y="115" fontSize="12" fill={colors.info}>
                {dimension.label}
              </SvgText>
            </React.Fragment>
          );
        }

        if (dimension.position === "right") {
          return (
            <React.Fragment key={`${dimension.label}-${index}`}>
              <Line x1="140" y1="144" x2="240" y2="144" stroke={colors.info} strokeWidth="2" />
              <SvgText x="146" y="138" fontSize="12" fill={colors.info}>
                {dimension.label}
              </SvgText>
            </React.Fragment>
          );
        }

        return (
          <SvgText
            key={`${dimension.label}-${index}`}
            x="86"
            y={30 + index * 18}
            fontSize="12"
            fill={colors.success}
          >
            {dimension.label}
          </SvgText>
        );
      })}
    </Svg>
  );
}
