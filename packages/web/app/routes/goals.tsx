export default function Goals() {
  const fetchData = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/example`);
    const data = await res.text();
    alert(`Response from API: ${data}`);
  };

  return (
    <>
      <h1>Goals Page</h1>
      <button
        onClick={() => fetchData()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Fetch Data from API
      </button>
    </>
  );
}
