const VARIANT_CLASSES = {
  primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
  secondary: "border border-gray-300 hover:bg-gray-50 text-gray-700",
  danger: "border border-red-200 hover:bg-red-50 text-red-600",
};

export default function Button({
  children,
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`font-medium rounded-lg px-4 py-2 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
