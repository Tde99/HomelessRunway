import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "react-email";

interface LogoInfo {
  label: string;
  fileName: string;
  selectedZones: string[];
  imageUrl?: string;
}

interface AllocationRequestEmailProps {
  brandName: string;
  contactName: string;
  email: string;
  phone?: string;
  website?: string;
  industry: string;
  selectedPackage: string;
  packagePrice: number;
  selectedZones: string[];
  logos?: LogoInfo[];
  garmentImageUrl?: string;
  restrictions?: string;
  notes?: string;
  reviewNotes?: string;
}

export default function AllocationRequestEmail({
  brandName = "Acme Corp",
  contactName = "Jane Doe",
  email = "jane@acme.com",
  phone,
  website,
  industry = "Fashion / Apparel",
  selectedPackage = "Editorial Entry Allocation",
  packagePrice = 1000,
  selectedZones = ["Front Hero", "Back Hero"],
  logos = [],
  garmentImageUrl,
  restrictions,
  notes,
  reviewNotes,
}: AllocationRequestEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        New allocation request from {brandName} — {selectedPackage}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logoText}>HOMELESS RUNWAY</Text>
            <Text style={seriesLabel}>Series 001 — Hong Kong</Text>
          </Section>

          <Hr style={hr} />

          <Heading style={h1}>New Allocation Request</Heading>
          <Text style={subtitle}>
            A new partner allocation request has been submitted and requires
            review.
          </Text>

          {/* Package */}
          <Section style={section}>
            <Heading as="h2" style={h2}>
              Package
            </Heading>
            <Row>
              <Column>
                <Text style={label}>Selected Package</Text>
                <Text style={value}>{selectedPackage}</Text>
              </Column>
              <Column>
                <Text style={label}>Price</Text>
                <Text style={value}>${packagePrice.toLocaleString()}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          {/* Garment Preview */}
          {garmentImageUrl && (
            <>
              <Section style={section}>
                <Heading as="h2" style={h2}>
                  Garment Preview
                </Heading>
                <Img
                  src={garmentImageUrl}
                  alt="Garment preview with logo placement"
                  width="100%"
                  style={garmentImage}
                />
              </Section>
              <Hr style={hr} />
            </>
          )}

          {/* Placement */}
          <Section style={section}>
            <Heading as="h2" style={h2}>
              Placement Zones
            </Heading>
            {selectedZones.map((zone) => (
              <Text key={zone} style={zoneItem}>
                ▸ {zone}
              </Text>
            ))}
          </Section>

          {/* Logos */}
          {logos.length > 0 && (
            <>
              <Hr style={hr} />
              <Section style={section}>
                <Heading as="h2" style={h2}>
                  Logos ({logos.length})
                </Heading>
                {logos.map((logo, i) => (
                  <Section key={i} style={logoCard}>
                    {logo.imageUrl && (
                      <Img
                        src={logo.imageUrl}
                        alt={logo.label}
                        width="120"
                        height="120"
                        style={logoImage}
                      />
                    )}
                    <Text style={logoLabel}>{logo.label}</Text>
                    {logo.fileName && (
                      <Text style={logoFile}>File: {logo.fileName}</Text>
                    )}
                    {logo.selectedZones.length > 0 ? (
                      <Text style={logoZones}>
                        Zones: {logo.selectedZones.join(", ")}
                      </Text>
                    ) : (
                      <Text style={logoZones}>No zones assigned</Text>
                    )}
                  </Section>
                ))}
              </Section>
            </>
          )}

          <Hr style={hr} />

          {/* Partner Details */}
          <Section style={section}>
            <Heading as="h2" style={h2}>
              Partner Details
            </Heading>
            <Text style={label}>Brand Name</Text>
            <Text style={value}>{brandName}</Text>

            <Text style={label}>Industry</Text>
            <Text style={value}>{industry}</Text>

            <Text style={label}>Contact</Text>
            <Text style={value}>{contactName}</Text>

            <Text style={label}>Email</Text>
            <Text style={value}>{email}</Text>

            {phone && (
              <>
                <Text style={label}>Phone</Text>
                <Text style={value}>{phone}</Text>
              </>
            )}

            {website && (
              <>
                <Text style={label}>Website</Text>
                <Text style={value}>{website}</Text>
              </>
            )}
          </Section>

          {(restrictions || notes || reviewNotes) && (
            <>
              <Hr style={hr} />
              <Section style={section}>
                <Heading as="h2" style={h2}>
                  Additional Notes
                </Heading>
                {restrictions && (
                  <>
                    <Text style={label}>Restrictions / Exclusions</Text>
                    <Text style={value}>{restrictions}</Text>
                  </>
                )}
                {reviewNotes && (
                  <>
                    <Text style={label}>Product Review Notes</Text>
                    <Text style={value}>{reviewNotes}</Text>
                  </>
                )}
                {notes && (
                  <>
                    <Text style={label}>General Notes</Text>
                    <Text style={value}>{notes}</Text>
                  </>
                )}
              </Section>
            </>
          )}

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              This is an automated notification from the HOMELESS RUNWAY
              allocation system. Review and respond to the applicant at {email}.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/* ─── Styles ─── */

const main = {
  backgroundColor: "#0a0a0a",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "40px 24px",
  maxWidth: "600px",
};

const header = {
  textAlign: "center" as const,
  paddingBottom: "24px",
};

const logoText = {
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: "700" as const,
  letterSpacing: "0.25em",
  textTransform: "uppercase" as const,
  margin: "0 0 4px",
};

const seriesLabel = {
  color: "#666666",
  fontSize: "11px",
  letterSpacing: "0.2em",
  textTransform: "uppercase" as const,
  margin: "0",
};

const h1 = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "600" as const,
  margin: "24px 0 8px",
};

const subtitle = {
  color: "#999999",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0 0 24px",
};

const h2 = {
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600" as const,
  letterSpacing: "0.15em",
  textTransform: "uppercase" as const,
  margin: "0 0 16px",
};

const section = {
  padding: "16px 0",
};

const label = {
  color: "#666666",
  fontSize: "11px",
  fontWeight: "600" as const,
  letterSpacing: "0.15em",
  textTransform: "uppercase" as const,
  margin: "12px 0 2px",
};

const value = {
  color: "#e0e0e0",
  fontSize: "14px",
  margin: "0 0 8px",
};

const zoneItem = {
  color: "#e0e0e0",
  fontSize: "14px",
  margin: "4px 0",
  paddingLeft: "8px",
};

const hr = {
  borderColor: "#222222",
  margin: "8px 0",
};

const footer = {
  padding: "16px 0 0",
};

const footerText = {
  color: "#555555",
  fontSize: "12px",
  lineHeight: "1.5",
};

const logoCard = {
  backgroundColor: "#111111",
  border: "1px solid #222222",
  borderRadius: "4px",
  padding: "12px 16px",
  marginBottom: "8px",
};

const logoImage = {
  borderRadius: "4px",
  marginBottom: "8px",
  objectFit: "contain" as const,
};

const garmentImage = {
  borderRadius: "6px",
  maxWidth: "100%",
};

const logoLabel = {
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600" as const,
  margin: "0 0 4px",
};

const logoFile = {
  color: "#888888",
  fontSize: "12px",
  margin: "0 0 4px",
};

const logoZones = {
  color: "#e0e0e0",
  fontSize: "13px",
  margin: "0",
};
