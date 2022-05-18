
export default function Home({ ProductTable }) {
    return (
        <>
            <header className="Section-header">
                Available services
            </header>
            <div className="Section-container">
                {ProductTable}
            </div>
        </>
    );
}