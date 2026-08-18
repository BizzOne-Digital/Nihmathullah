type JsonLdItem = Record<string, unknown> | null | undefined;

type JsonLdProps = {
  data: JsonLdItem | JsonLdItem[];
};

export function JsonLd({ data }: JsonLdProps) {
  if (!data) return null;

  const items = Array.isArray(data) ? data : [data];

  return (
    <>
      {items
        .filter(
          (item): item is Record<string, unknown> =>
            item != null && typeof item === "object" && Object.keys(item).length > 0
        )
        .map((item, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
          />
        ))}
    </>
  );
}
