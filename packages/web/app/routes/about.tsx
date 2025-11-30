import { Card, PageContainer, PageHeader } from "../components";

export default function About() {
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
            </div>
        </PageContainer>
    );
}
