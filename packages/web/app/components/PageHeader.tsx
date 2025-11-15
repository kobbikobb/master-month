interface PageHeaderProps {
    title: string;
    subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
    return (
        <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4">
                {title}
            </h1>
            {subtitle && (
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    {subtitle}
                </p>
            )}
        </div>
    );
}
