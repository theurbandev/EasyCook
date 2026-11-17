import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps, ReactNode } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Switch, Text, TextInput, View, type TextInputProps, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const colors = {
  bg: '#FFF8EF',
  card: 'rgba(255,255,255,0.78)',
  cardSolid: '#FFFFFF',
  text: '#2E1F17',
  muted: '#7A6558',
  border: 'rgba(120,72,40,0.13)',
  primary: '#D9472B',
  primarySoft: 'rgba(242,123,60,0.14)',
  green: '#5B8C51',
  star: '#F2A93B',
  danger: '#B83A2C',
};

/** Cookbook-style serif for big headings. */
export const serif = Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia, serif' });

// Built-in React Native gradients, so no native package or rebuild is needed.
export const gradients = {
  primary: 'linear-gradient(120deg, #F27B3C 0%, #D9452B 100%)',
  tabScene: 'radial-gradient(circle at 95% 0%, rgba(255,190,140,0.55) 0%, rgba(255,190,140,0) 55%), radial-gradient(circle at 0% 70%, rgba(170,205,150,0.35) 0%, rgba(170,205,150,0) 50%)',
  // Glow stays low so it doesn't meet the solid navigation header.
  stackScene: 'radial-gradient(circle at 100% 100%, rgba(255,190,140,0.45) 0%, rgba(255,190,140,0) 55%), radial-gradient(circle at 0% 85%, rgba(170,205,150,0.3) 0%, rgba(170,205,150,0) 50%)',
  plate: 'radial-gradient(circle at 50% 45%, #FFFFFF 0%, #FFFFFF 58%, #F4EBDF 62%, #FFFFFF 70%, #EFE3D3 100%)',
  tileWarm: 'linear-gradient(140deg, #FFC89A 0%, #F79A6B 100%)',
  tileCool: 'linear-gradient(140deg, #CFE3BF 0%, #9CC48E 100%)',
};

export const glow = '0px 8px 22px rgba(217,69,43,0.28)';

/** Large title for tab screens, which have no navigation header. */
export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top + 8, marginBottom: 18 }}>
      <Text style={s.pageTitle}>{title}</Text>
      {subtitle ? <Text style={[s.muted, { marginTop: 4 }]}>{subtitle}</Text> : null}
    </View>
  );
}

export function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{title}</Text>
      {hint ? <Text style={s.hint}>{hint}</Text> : null}
      {children}
    </View>
  );
}

export function Chip({ label, selected, onPress }: { label: string; selected?: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[s.chip, selected && s.chipOn]} accessibilityRole="button" accessibilityState={{ selected }}>
      <Text style={[s.chipText, selected && s.chipTextOn]}>{label}</Text>
    </Pressable>
  );
}

export function ChipRow({ children }: { children: ReactNode }) {
  return <View style={s.chipRow}>{children}</View>;
}

export function Stepper({ value, onChange, min = 1, max = 14, suffix }: { value: number; onChange: (n: number) => void; min?: number; max?: number; suffix?: string }) {
  return (
    <View style={s.stepper}>
      <Pressable onPress={() => onChange(Math.max(min, value - 1))} style={s.stepBtn} accessibilityLabel="Decrease">
        <Ionicons name="remove" size={20} color={colors.text} />
      </Pressable>
      <Text style={s.stepValue}>
        {value}
        {suffix ? ` ${suffix}` : ''}
      </Text>
      <Pressable onPress={() => onChange(Math.min(max, value + 1))} style={s.stepBtn} accessibilityLabel="Increase">
        <Ionicons name="add" size={20} color={colors.text} />
      </Pressable>
    </View>
  );
}

export function ToggleRow({ label, hint, value, onChange }: { label: string; hint?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={s.toggleRow}>
      <View style={{ flex: 1 }}>
        <Text style={[s.label, { marginBottom: hint ? 2 : 0 }]}>{label}</Text>
        {hint ? <Text style={[s.muted, { fontSize: 13 }]}>{hint}</Text> : null}
      </View>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: colors.green, false: 'rgba(120,72,40,0.18)' }} thumbColor="#FFFFFF" />
    </View>
  );
}

export function Stars({ value, onChange, size = 22 }: { value: number; onChange?: (n: number) => void; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Pressable key={n} onPress={onChange ? () => onChange(n === value ? 0 : n) : undefined} disabled={!onChange} hitSlop={4} accessibilityLabel={`${n} stars`}>
          <Ionicons name={n <= value ? 'star' : 'star-outline'} size={size} color={colors.star} />
        </Pressable>
      ))}
    </View>
  );
}

type IconName = ComponentProps<typeof Ionicons>['name'];

export function Button({
  title,
  onPress,
  icon,
  variant = 'primary',
  loading,
  disabled,
  style,
}: {
  title: string;
  onPress: () => void;
  icon?: IconName;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}) {
  const fg = variant === 'danger' ? colors.danger : variant === 'primary' ? '#FFFFFF' : colors.text;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [s.btn, s[variant], (pressed || disabled) && { opacity: 0.55 }, style]}
      accessibilityRole="button"
    >
      {loading ? <ActivityIndicator color={fg} /> : icon ? <Ionicons name={icon} size={18} color={fg} /> : null}
      <Text style={[s.btnText, { color: fg }]}>{title}</Text>
    </Pressable>
  );
}

export function Field({ label, ...props }: TextInputProps & { label?: string }) {
  return (
    <View style={{ marginBottom: 14 }}>
      {label ? <Text style={s.label}>{label}</Text> : null}
      <TextInput placeholderTextColor={colors.muted} keyboardAppearance="light" {...props} style={[s.input, props.multiline && s.multiline, props.style]} />
    </View>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[s.card, style]}>{children}</View>;
}

export function Empty({ icon, title, text, children }: { icon: IconName; title: string; text: string; children?: ReactNode }) {
  return (
    <View style={s.empty}>
      <Ionicons name={icon} size={48} color={colors.muted} />
      <Text style={s.emptyTitle}>{title}</Text>
      <Text style={s.emptyText}>{text}</Text>
      {children}
    </View>
  );
}

export const s = StyleSheet.create({
  // The gradient lives on the navigator's scene style, so screens stay see-through.
  screen: { flex: 1, backgroundColor: 'transparent' },
  content: { padding: 16, paddingBottom: 120 },
  pageTitle: { fontSize: 34, fontWeight: '700', fontFamily: serif, color: colors.text, letterSpacing: -0.4 },
  section: { marginBottom: 22 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 10 },
  hint: { fontSize: 13, color: colors.muted, marginTop: -6, marginBottom: 10 },
  label: { fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: 6 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 15, paddingVertical: 9, borderRadius: 22, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  chipOn: { backgroundImage: gradients.primary, borderColor: 'transparent' },
  chipText: { fontSize: 14, color: colors.text },
  chipTextOn: { color: '#FFFFFF', fontWeight: '600' },
  stepper: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: colors.card, borderRadius: 24, borderWidth: 1, borderColor: colors.border, marginBottom: 8 },
  stepBtn: { padding: 11 },
  stepValue: { minWidth: 84, textAlign: 'center', fontSize: 16, fontWeight: '600', color: colors.text },
  toggleRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 18, padding: 14, borderWidth: 1, borderColor: colors.border, marginBottom: 8, gap: 12 },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 15, paddingHorizontal: 18, borderRadius: 28 },
  primary: { backgroundImage: gradients.primary, boxShadow: glow },
  secondary: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  danger: { backgroundColor: 'rgba(255,90,90,0.12)', borderWidth: 1, borderColor: 'rgba(255,138,138,0.28)' },
  btnText: { fontSize: 16, fontWeight: '700' },
  input: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 13, fontSize: 16, color: colors.text },
  multiline: { minHeight: 110, textAlignVertical: 'top' },
  card: { backgroundColor: colors.card, borderRadius: 24, padding: 18, borderWidth: 1, borderColor: colors.border, marginBottom: 14 },
  empty: { alignItems: 'center', padding: 32, gap: 8 },
  emptyTitle: { fontSize: 20, fontWeight: '700', fontFamily: serif, color: colors.text },
  emptyText: { fontSize: 15, color: colors.muted, textAlign: 'center', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '700', fontFamily: serif, color: colors.text },
  muted: { fontSize: 14, color: colors.muted },
  body: { fontSize: 15, color: colors.text, lineHeight: 22 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
