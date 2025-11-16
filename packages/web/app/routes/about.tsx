import { Card, PageContainer, PageHeader } from "../components";

export default function About() {
    const testFetchData = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}test`);
        const data = await res.json();
        alert(`Response from API: ${data.message} (Bucket: ${data.bucket})`);
    };

    return (
        <PageContainer>
            <PageHeader
                title="About Master Month"
                subtitle="Building lasting habits, one month at a time."
            />

            <div className="space-y-6">
                <Card>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        About This Project
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Master Month is a habit-building application designed to
                        help you create lasting change by focusing on one month
                        at a time. Each master month has a theme, and you can
                        set goals and track your daily progress through journal
                        entries.
                    </p>
                </Card>

                <Card>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        About the Creator
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Created by Jakob Jonasson, a developer passionate about
                        building tools that help people achieve their goals and
                        develop positive habits.
                    </p>
                </Card>

                <Card>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        API Connection Test
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Test your connection to the backend API.
                    </p>
                    <button
                        type="button"
                        onClick={() => testFetchData()}
                        className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium"
                    >
                        Fetch Data from API
                    </button>
                </Card>
            </div>
        </PageContainer>
    );
}
