export default function Loader({
  size = "sm",
}: {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}) {
  const sizeClasses: Record<"xs" | "sm" | "md" | "lg" | "xl", string> = {
    xs: "w-2 h-2 border",
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-4",
    xl: "w-10 h-10 border-4",
  };
  return (
    <div
      className={`${sizeClasses[size]} border-gray-300 border-t-transparent rounded-full animate-spin`}
    />
  );
}
