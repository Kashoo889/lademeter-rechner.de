import { describe, expect, it } from "vitest";
import { buildFaqJsonLd } from "@/lib/seo/jsonLd";

describe("buildFaqJsonLd", () => {
  it("builds a FAQPage with one Question per item", () => {
    const data = buildFaqJsonLd([
      { question: "Frage 1?", answer: "Antwort 1." },
      { question: "Frage 2?", answer: "Antwort 2." },
    ]);
    expect(data["@type"]).toBe("FAQPage");
    expect(data.mainEntity).toHaveLength(2);
    expect(data.mainEntity[0]).toEqual({
      "@type": "Question",
      name: "Frage 1?",
      acceptedAnswer: { "@type": "Answer", text: "Antwort 1." },
    });
  });
});
