interface PlaygroundDetailProps {
  params: Promise<{ placeId: string }>;
}

export default async function PlaygroundDetailPage({
  params,
}: PlaygroundDetailProps) {
  const { placeId } = await params;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold">Playground Details</h1>
      <p className="mt-2 text-gray-600">Place ID: {placeId}</p>
      {/* TODO: Playground detail view with reviews */}
    </main>
  );
}
