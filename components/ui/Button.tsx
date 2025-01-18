import { StyleSheet, Text, TouchableOpacity, ViewStyle, TextStyle } from "react-native";

interface ButtonProps {
  onPress?: () => void;
  variant?:
    | "primary"
    | "secondary"
    | "ghost"
    | "gray"
    | "warning"
    | "outline"
    | "danger";
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  props?: ButtonProps;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  variant = "primary",
  disabled = false,
  className = "",
  children,
  props = {},
}) => {
  const variantStyles = {
    primary: styles.primary,
    secondary: styles.secondary,
    warning: styles.warning,
    danger: styles.danger,
    outline: styles.outline,
    ghost: styles.ghost,
    gray: styles.gray,
  };

  const disabledStyle = disabled ? styles.disabled : {};

  return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        disabled={disabled}
        style={[styles.base, variantStyles[variant], disabledStyle,]}
        {...props}
      >
        {children}
      </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,

  primary: {
    backgroundColor: "#1D4ED8",
    color: "white",
  } as TextStyle,

  secondary: {
    backgroundColor: "#E5E7EB",
    color: "black",
  } as TextStyle,

  warning: {
    backgroundColor: "#F59E0B",
    color: "white",
  } as TextStyle,

  danger: {
    backgroundColor: "#EF4444",
    color: "white",
  } as TextStyle,

  outline: {
    backgroundColor: "transparent",
    borderColor: "white",
    borderWidth: 1,
  } as ViewStyle,

  ghost: {
    backgroundColor: "transparent",
    borderColor: "#1D4ED8",
    borderWidth: 1,
    color: "#DC2626",
  } as TextStyle,

  gray: {
    backgroundColor: "#2D2D2D",
  } as TextStyle,

  disabled: {
    backgroundColor: "#D1D5DB",
    color: "#E5E7EB",
    borderColor: "#E5E7EB",
  } as ViewStyle,
});

export default Button;
