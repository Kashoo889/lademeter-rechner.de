import { describe, expect, it } from "vitest";
import { formatAddressLines, getMissingOperatorFields, operator, type OperatorConfig } from "@/lib/legal/operator";

describe("operator configuration", () => {
  it("contains only the owner details that have been confirmed", () => {
    expect(operator).toMatchObject({
      kind: "person",
      name: "Muhammad Kashif",
      country: "Pakistan",
      email: "mkashifshah10@gmail.com",
      street: null,
      addressLines: ["Israr Boys Hostel", "Nashiman Iqbal Phase 1"],
      addressComplete: false,
      postalCode: "54000",
      city: "Lahore",
      region: "Punjab",
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
        "phone",
        "editorialResponsibilityReview",
        "euRepresentative",
        "hosting.confirmed",
      ]),
    );
    expect(fields).not.toContain("consumerDisputeStatement");
    expect(fields).not.toEqual(expect.arrayContaining(["kind", "name", "postalCode", "city", "email", "supervisoryAuthority"]));
  });

  it("formats the confirmed address in German order without inventing a street or house number", () => {
    expect(formatAddressLines(operator)).toEqual([
      "Israr Boys Hostel",
      "Nashiman Iqbal Phase 1",
      "54000 Lahore, Punjab",
      "Pakistan",
    ]);
    expect(operator.street).toBeNull();
  });

  it("returns no address while neither street nor confirmed address lines exist", () => {
    expect(formatAddressLines({ ...operator, street: null, addressLines: [] })).toBeNull();
    expect(getMissingOperatorFields({ ...operator, street: null, addressLines: [] }).map((item) => item.field)).toContain("street");
  });

  it("flags the missing street/house number precisely until the operator confirms the address", () => {
    const flagged = getMissingOperatorFields(operator).find((item) => item.field === "street");
    expect(flagged?.label).toContain("Israr Boys Hostel, Nashiman Iqbal Phase 1");
    expect(flagged?.label).toContain("Straße und Hausnummer");

    const confirmed = getMissingOperatorFields({ ...operator, addressComplete: true }).map((item) => item.field);
    expect(confirmed).not.toContain("street");
    const withStreet = getMissingOperatorFields({ ...operator, street: "Beispielstraße 1" }).map((item) => item.field);
    expect(withStreet).not.toContain("street");
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
