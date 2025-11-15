interface FeatureCardProps {
    title: string;
    description: string;
}

export function FeatureCard({ title, description }: FeatureCardProps) {
    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{description}</p>
        </div>
    );
}
