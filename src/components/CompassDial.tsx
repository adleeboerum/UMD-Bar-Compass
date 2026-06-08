import { Animated } from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Polygon,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { colors } from '../theme';

type Props = {
  size: number;
  /** Animated rotation (string deg) for the dial ring — counter-rotates heading. */
  dialSpin: Animated.AnimatedInterpolation<string>;
  /** Animated rotation (string deg) for the destination needle. */
  needleSpin: Animated.AnimatedInterpolation<string>;
  /** Whether the compass has a live fix; dims the needle while calibrating. */
  active: boolean;
};

const AView = Animated.View;

/** Build the static tick + cardinal ring as an SVG, centered in `size`. */
function Ring({ size }: { size: number }) {
  const c = size / 2;
  const rOuter = c - 6;
  const ticks: React.ReactNode[] = [];

  for (let deg = 0; deg < 360; deg += 5) {
    const major = deg % 45 === 0;
    const medium = deg % 15 === 0;
    const len = major ? 16 : medium ? 11 : 6;
    const theta = (deg * Math.PI) / 180;
    const sin = Math.sin(theta);
    const cos = Math.cos(theta);
    const x1 = c + rOuter * sin;
    const y1 = c - rOuter * cos;
    const x2 = c + (rOuter - len) * sin;
    const y2 = c - (rOuter - len) * cos;
    ticks.push(
      <Line
        key={deg}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={major ? colors.dialTickMajor : colors.dialTick}
        strokeWidth={major ? 2.5 : 1.5}
        strokeLinecap="round"
      />
    );
  }

  const rText = c - 34;
  const cardinals: { label: string; deg: number; north?: boolean }[] = [
    { label: 'N', deg: 0, north: true },
    { label: 'E', deg: 90 },
    { label: 'S', deg: 180 },
    { label: 'W', deg: 270 },
  ];

  return (
    <Svg width={size} height={size}>
      <Circle
        cx={c}
        cy={c}
        r={rOuter - 1}
        stroke={colors.dialTrack}
        strokeWidth={1}
        fill="none"
      />
      {ticks}
      {cardinals.map(({ label, deg, north }) => {
        const theta = (deg * Math.PI) / 180;
        const x = c + rText * Math.sin(theta);
        const y = c - rText * Math.cos(theta);
        return (
          <SvgText
            key={label}
            x={x}
            y={y + 7}
            fill={north ? colors.north : colors.text}
            fontSize={north ? 22 : 18}
            fontWeight="700"
            textAnchor="middle"
          >
            {label}
          </SvgText>
        );
      })}
    </Svg>
  );
}

/** The destination needle — classic two-tone compass arrow pointing up. */
function Needle({ size, active }: { size: number; active: boolean }) {
  const c = size / 2;
  const len = c - 56;
  const w = 13;
  const tail = len * 0.62;
  return (
    <Svg width={size} height={size}>
      <Defs>
        <LinearGradient id="needle" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={colors.redSoft} />
          <Stop offset="1" stopColor={colors.red} />
        </LinearGradient>
      </Defs>
      {/* Muted tail */}
      <Polygon
        points={`${c},${c + tail} ${c - w},${c} ${c + w},${c}`}
        fill={colors.textFaint}
        opacity={active ? 0.55 : 0.25}
      />
      {/* Pointer toward destination */}
      <Polygon
        points={`${c},${c - len} ${c - w},${c} ${c + w},${c}`}
        fill="url(#needle)"
        opacity={active ? 1 : 0.35}
      />
    </Svg>
  );
}

/** A small fixed marker at the top showing the direction you're currently facing. */
function HeadingMarker({ size }: { size: number }) {
  const c = size / 2;
  return (
    <Svg
      width={size}
      height={size}
      style={{ position: 'absolute', top: 0, left: 0 }}
    >
      <Polygon
        points={`${c},${10} ${c - 9},${-6} ${c + 9},${-6}`}
        fill={colors.gold}
      />
    </Svg>
  );
}

export default function CompassDial({
  size,
  dialSpin,
  needleSpin,
  active,
}: Props) {
  const c = size / 2;
  return (
    <Animated.View style={{ width: size, height: size }}>
      {/* Rotating tick + cardinal ring */}
      <AView
        style={{
          position: 'absolute',
          width: size,
          height: size,
          transform: [{ rotate: dialSpin }],
        }}
      >
        <Ring size={size} />
      </AView>

      {/* Rotating destination needle */}
      <AView
        style={{
          position: 'absolute',
          width: size,
          height: size,
          transform: [{ rotate: needleSpin }],
        }}
      >
        <Needle size={size} active={active} />
      </AView>

      {/* Center hub */}
      <Svg
        width={size}
        height={size}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <Circle cx={c} cy={c} r={9} fill={colors.text} />
        <Circle cx={c} cy={c} r={4} fill={colors.bgBottom} />
      </Svg>

      {/* Fixed "facing" marker */}
      <HeadingMarker size={size} />
    </Animated.View>
  );
}
