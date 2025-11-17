interface ErrorMessageProps {
    message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
    return (
        <div
            className="text-red-600 dark:text-red-400 text-sm"
            role="alert"
            aria-live="polite"
        >
            {message}
        </div>
    );
}
