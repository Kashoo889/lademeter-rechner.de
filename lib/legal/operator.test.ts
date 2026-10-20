import { describe, expect, it } from "vitest";
import { getMissingOperatorFields, operator, type OperatorConfig } from "@/lib/legal/operator";

describe("operator configuration", () => {
  it("contains only the owner details that have been confirmed", () => {
    expect(operator).toMatchObject({
      kind: "person",
      name: "Muhammad Kashif",
      country: "Pakistan",
      email: "mkashifshah10@gmail.com",
      street: null,
      postalCode: null,
      city: null,
      phone: null,
      register: null,
      vatId: null,
      hosting: {
        provider: "Vercel Inc.",
        privacyPolicyUrl: "https://vercel.com/legal/privacy-notice",
        dpaUrl: "https://vercel.com/legal/dpa",
        subprocessorsUrl: "https://vercel.com/legal/sub-processors",
        runtimeLogsUrl: "https://vercel.com/docs/logs/runtime",
        confirmed: false,
      },
      legalReview: { reviewed: false, reviewedAt: null, reviewer: null },
    });
  });

  it("keeps every unresolved launch safeguard active", () => {
    const fields = getMissingOperatorFields(operator).map((item) => item.field);

    expect(fields).toEqual(
      expect.arrayContaining([
        "street",
        "postalCode",
        "city",
        "editorialResponsibilityReview",
        "euRepresentative",
        "consumerDisputeStatement",
        "hosting.confirmed",
      ]),
    );
    expect(fields).not.toEqual(expect.arrayContaining(["kind", "name", "email", "supervisoryAuthority"]));
  });

  it("accepts documented review outcomes without inventing representatives", () => {
    const reviewed: OperatorConfig = {
      ...operator,
      street: "Confirmed street 1",
      postalCode: "12345",
      city: "Confirmed city",
      phone: "+92 000 0000000",
      editorialResponsibilityReview: {
        applies: false,
        reviewedAt: "2026-10-20",
        reviewer: "Qualified reviewer",
      },
      euRepresentativeExemption: {
        reason: "Documented assessment",
        reviewedAt: "2026-10-20",
        reviewer: "Qualified reviewer",
      },
      consumerDisputeStatement: "Reviewed statement",
      hosting: {
        provider: "Confirmed host",
        privacyPolicyUrl: "https://example.com/privacy",
        dpaUrl: "https://example.com/dpa",
        subprocessorsUrl: "https://example.com/subprocessors",
        runtimeLogsUrl: "https://example.com/logs",
        confirmed: true,
      },
    };

    expect(getMissingOperatorFields(reviewed)).toEqual([]);
  });
});
