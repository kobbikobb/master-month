interface PageContainerProps {
    children: React.ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
    return (
        <div className="max-w-5xl mx-auto px-4">
            <div className="py-12">{children}</div>
        </div>
    );
}
