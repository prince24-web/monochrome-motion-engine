import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { CameraKeyframe, CameraRig } from '../../components/CameraRig';
import { PawnCharacter } from '../../components/PawnCharacter';
import { PillBadge } from '../../components/PillBadge';
import { PunchlineCallout } from '../../components/PunchlineCallout';
import { RollingCounter } from '../../components/RollingCounter';
import { SpotlightCone } from '../../components/SpotlightCone';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const IcebergMomentumScene: React.FC<Props> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterOpacity = clampedInterpolate(frame, [0, 14], [0, 1], EASING.smoothOut);
  const exitOpacity = clampedInterpolate(
    frame,
    [durationInFrames - 14, durationInFrames],
    [1, 0],
    EASING.smoothOut
  );
  const sceneOpacity = Math.min(enterOpacity, exitOpacity);

  const revealDepth = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const hiddenReps = Math.round(revealDepth * 99);
  const waterlineY = 435;
  const bob = Math.sin(frame * 0.05) * 6;

  // Camera: start tight on visible tip above water -> plunge below waterline to reveal massive 99-rep base -> wide reveal
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.48, x: 0, y: -185 },
    { t: 0.35, scale: 1.32, x: 60, y: 120 },
    { t: 0.68, scale: 1.24, x: 110, y: 195 },
    { t: 0.9, scale: 1.0, x: 0, y: 0 },
    { t: 1.0, scale: 1.0, x: 0, y: 0 },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <CameraRig durationInFrames={durationInFrames} keyframes={cameraKeyframes}>
        <svg
          width={VIDEO_CONFIG.width}
          height={VIDEO_CONFIG.height}
          viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
        >
          {/* Spotlight over protagonist standing on the iceberg tip */}
          <SpotlightCone
            topX={960}
            topWidth={95}
            bottomX={960}
            bottomY={waterlineY + 20}
            bottomWidth={310}
            opacity={0.72}
          />

          {/* Subtle Water Surface Plane */}
          <line
            x1="140"
            y1={waterlineY}
            x2="1780"
            y2={waterlineY}
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="3"
            strokeDasharray="14 12"
          />

          {/* Geometric Wireframe Iceberg */}
          <g transform={`translate(960, ${waterlineY + bob})`}>
            {/* Visible Tip Above Waterline ("1% VISIBLE WIN") */}
            <polygon
              points="0,-165 115,0 -115,0"
              fill="rgba(255,255,255,0.22)"
              stroke={COLORS.white}
              strokeWidth="4"
              filter="url(#soft-glow)"
            />
            <line x1="0" y1="-165" x2="22" y2="0" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />

            {/* Colossal Submerged Foundation Below Waterline ("99 IMPERFECT REPS") */}
            <g opacity={0.18 + revealDepth * 0.82}>
              <polygon
                points="-115,0 115,0 285,175 165,455 -185,435 -295,165"
                fill="#09090E"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="3"
              />
              {/* Architectural facet lines */}
              <line x1="-115" y1="0" x2="-185" y2="435" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
              <line x1="115" y1="0" x2="165" y2="455" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
              <line x1="-295" y1="165" x2="285" y2="175" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
              <line x1="22" y1="0" x2="-15" y2="445" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
            </g>

            {/* Protagonist standing at the summit of the visible 1% */}
            <PawnCharacter
              x={0}
              y={-165}
              scale={0.56}
              glowIntensity={0.85}
              bob={false}
            />
          </g>

          {/* Side Annotations */}
          <text
            x="1340"
            y="345"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="23"
            fontWeight="800"
            letterSpacing="0.16em"
          >
            WHAT THE WORLD SEES
          </text>
          <text
            x="1340"
            y="382"
            fill={COLORS.midGrey}
            fontFamily={FONT_FAMILY}
            fontSize="19"
            fontWeight="700"
            letterSpacing="0.14em"
          >
            SHOT #100 · &quot;OVERNIGHT SUCCESS&quot;
          </text>

          <g opacity={revealDepth}>
            <text
              x="1340"
              y="655"
              fill={COLORS.softWhite}
              fontFamily={FONT_FAMILY}
              fontSize="23"
              fontWeight="800"
              letterSpacing="0.16em"
            >
              WHAT BUILT IT
            </text>
            <text
              x="1340"
              y="692"
              fill={COLORS.midGrey}
              fontFamily={FONT_FAMILY}
              fontSize="19"
              fontWeight="700"
              letterSpacing="0.14em"
            >
              99 UNSEEN IMPERFECT REPS
            </text>
          </g>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="THE HIDDEN 99 REPS" x={960} y={96} enterFrame={Math.round(fps * 0.45)} />

      <RollingCounter
        label="HIDDEN REPS"
        value={hiddenReps}
        x={1820}
        y={158}
        fontSize={118}
        labelSize={20}
        align="right"
      />

      <PunchlineCallout
        text="99 UNSEEN REPS."
        subtext="BUILT THE ONE VISIBLE WIN"
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
