import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "secondary" | "warning";
}

const Badge = ({ children, variant = "default" }: BadgeProps) => {
  const variants = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    warning: "bg-yellow-100 text-yellow-800",
  };

  return (
    <span className={`text-xs px-2 py-1 rounded ${variants[variant]}`}>
      {children}
    </span>
  );
};

export default Badge;
