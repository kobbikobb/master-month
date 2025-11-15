import { Card, PageContainer, PageHeader } from "../components";

export default function Goals() {
    const fetchData = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}goals`);
        const data = await res.json();
        alert(`Response from API: ${data.message} (Bucket: ${data.bucket})`);
    };

    return (
        <PageContainer>
            <PageHeader
                title="Your Goals"
                subtitle="Track and manage your monthly goals."
            />

            <div className="space-y-6">
                <Card>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        API Connection Test
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Test your connection to the backend API.
                    </p>
                    <button
                        type="button"
                        onClick={() => fetchData()}
                        className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium"
                    >
                        Fetch Data from API
                    </button>
                </Card>

                <Card>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        No Goals Yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Start by adding your first goal to begin your monthly
                        journey.
                    </p>
                </Card>
            </div>
        </PageContainer>
    );
}
