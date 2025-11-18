interface ButtonProps {
    type?: "button" | "submit";
    variant?: "primary" | "secondary";
    onClick?: () => void;
    disabled?: boolean;
    children: React.ReactNode;
    fullWidth?: boolean;
}

export function Button({
    type = "button",
    variant = "primary",
    onClick,
    disabled = false,
    children,
    fullWidth = false,
}: ButtonProps) {
    const baseClasses =
        "px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
    const variantClasses =
        variant === "primary"
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800";
    const widthClasses = fullWidth ? "w-full" : "";

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses} ${widthClasses}`}
        >
            {children}
        </button>
    );
}
