interface InputProps {
    id: string;
    label: string;
    type?: "text" | "month" | "email" | "password";
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
}

export function Input({
    id,
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    required = false,
}: InputProps) {
    return (
        <div>
            <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2"
            >
                {label}
            </label>
            <input
                type={type}
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                placeholder={placeholder}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
        </div>
    );
}
