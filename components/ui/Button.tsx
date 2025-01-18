import { Colors } from "@/constants/Colors";
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
  children?: React.ReactNode;
  props?: ButtonProps;
  propStyle?: ViewStyle;
  textStyle?: TextStyle; // Add custom text style support
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  variant = "primary",
  disabled = false,
  children,
  props = {},
  propStyle,
  textStyle,
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
      style={[styles.base, variantStyles[variant], disabledStyle, propStyle]}
      {...props}
    >
      <Text
        style={[
          styles.textBase,
          variant === "outline" || variant === "ghost" ? styles.textOutline : null,
          disabled ? styles.textDisabled : null,
          textStyle, // Apply custom text style
        ]}
      >
        {children}
      </Text>
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

  textBase: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  } as TextStyle,

  primary: {
    backgroundColor: "#4CAF50",
  } as ViewStyle,

  secondary: {
    backgroundColor: "#E5E7EB",
  } as ViewStyle,

  warning: {
    backgroundColor: "#F59E0B",
  } as ViewStyle,

  danger: {
    backgroundColor: "#EF4444",
  } as ViewStyle,

  outline: {
    backgroundColor: "transparent",
    borderColor: "white",
    borderWidth: 1,
  } as ViewStyle,

  ghost: {
    backgroundColor: "transparent",
    borderColor: Colors.primary,
    borderWidth: 1,
  } as ViewStyle,

  gray: {
    backgroundColor: "#2D2D2D",
  } as ViewStyle,

  disabled: {
    backgroundColor: "#D1D5DB",
    borderColor: "#E5E7EB",
  } as ViewStyle,

  textOutline: {
    color: "black",
  } as TextStyle,

  textDisabled: {
    color: "#A1A1AA",
  } as TextStyle,
});

export default Button;
