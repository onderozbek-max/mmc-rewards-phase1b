import * as React from "react";
import { Card, CardContent } from "../../components/Card";
import { Heading, Body } from "../../components/Text";
import { LinkButton } from "../../components/LinkButton";
import { Modal } from "../../components/Modal";
import { Divider } from "../../components/Divider";

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "What is Member's Mark Community?",
    a: "A space for Sam's Club members to take part in activities — mostly quick surveys — that help shape Member's Mark products and experiences.",
  },
  {
    q: "How do I earn points?",
    a: "Completing eligible Community activities earns points. Each activity shows how many points it's worth before you start.",
  },
  {
    q: "What are my points for?",
    a: "Your lifetime points move you toward Community Pass benefit milestones. See Community Pass for your current progress.",
  },
  {
    q: "Do my points expire?",
    a: "No. Lifetime points accumulate and never reset, even after you unlock a benefit milestone.",
  },
];

/**
 * "Have more questions about the community?" callout, present on both
 * Community Home and Profile in the current product. Opens a lightweight
 * FAQ modal rather than linking out — keeps the prototype self-contained and
 * avoids a dead link.
 */
export function FaqCallout() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Card>
        <CardContent>
          <div style={{ textAlign: "center", padding: "8px 4px" }}>
            <Heading as="h3" UNSAFE_style={{ margin: "0 0 8px", fontSize: 16 }}>
              Have more questions about the community?
            </Heading>
            <LinkButton href="#faq" onClick={(e) => { e.preventDefault(); setOpen(true); }}>
              View our FAQs
            </LinkButton>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Community FAQs" size="medium">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {FAQS.map((item, i) => (
            <React.Fragment key={item.q}>
              <div>
                <Body as="div" UNSAFE_style={{ margin: "0 0 4px", fontWeight: 700 }}>{item.q}</Body>
                <Body as="div" UNSAFE_style={{ margin: 0, color: "var(--ld-semantic-color-text-subtle)" }}>{item.a}</Body>
              </div>
              {i < FAQS.length - 1 ? <Divider /> : null}
            </React.Fragment>
          ))}
        </div>
      </Modal>
    </>
  );
}
