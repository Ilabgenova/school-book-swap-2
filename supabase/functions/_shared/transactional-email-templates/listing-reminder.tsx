/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  bookTitle?: string
  stillAvailableUrl?: string
  markSoldUrl?: string
}

const brand = '#2F6B4F'
const sold = '#B45309'

const main: React.CSSProperties = {
  backgroundColor: '#f6f7f6',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  margin: 0,
  padding: '24px 0',
}
const container: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  margin: '0 auto',
  maxWidth: '560px',
  padding: '32px',
}
const h1: React.CSSProperties = {
  color: brand,
  fontSize: '24px',
  fontWeight: 700,
  margin: '0 0 16px',
  textAlign: 'center',
}
const h2: React.CSSProperties = {
  color: '#111827',
  fontSize: '18px',
  fontWeight: 600,
  margin: '0 0 12px',
}
const text: React.CSSProperties = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '22px',
  margin: '0 0 12px',
}
const bookTitleStyle: React.CSSProperties = {
  color: '#111827',
  fontSize: '17px',
  fontWeight: 700,
  margin: '12px 0 20px',
}
const btnPrimary: React.CSSProperties = {
  backgroundColor: brand,
  borderRadius: '6px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '15px',
  fontWeight: 600,
  padding: '12px 20px',
  textDecoration: 'none',
  marginRight: '8px',
}
const btnSecondary: React.CSSProperties = {
  ...btnPrimary,
  backgroundColor: sold,
}
const hr: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid #e5e7eb',
  margin: '24px 0',
}
const footer: React.CSSProperties = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '16px 0 0',
  textAlign: 'center',
}
const fallback: React.CSSProperties = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '18px',
  wordBreak: 'break-all',
  margin: '4px 0',
}

const Email = ({
  bookTitle = 'Your DISbook listing',
  stillAvailableUrl = 'https://www.disbook.it',
  markSoldUrl = 'https://www.disbook.it',
}: Props) => (
  <Html>
    <Head />
    <Preview>Is your DISbook listing still available?</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>DISbook</Heading>

        <Section>
          <Heading as="h2" style={h2}>Is your DISbook listing still available?</Heading>
          <Text style={text}>Hello,</Text>
          <Text style={text}>You listed this book on DISbook:</Text>
          <Text style={bookTitleStyle}>{bookTitle}</Text>
          <Text style={text}>
            Please confirm whether it is still available or mark it as sold.
          </Text>

          <Section style={{ margin: '20px 0' }}>
            <Button href={stillAvailableUrl} style={btnPrimary}>
              Still Available
            </Button>
            <Button href={markSoldUrl} style={btnSecondary}>
              Mark as Sold
            </Button>
          </Section>

          <Text style={text}>
            Keeping listings up to date helps other DISbook families avoid contacting users about books that are no longer available.
          </Text>
          <Text style={text}>Thank you,<br />DISbook</Text>
        </Section>

        <Hr style={hr} />

        <Text style={{ ...text, fontSize: '13px', color: '#6b7280' }}>
          If the buttons do not work, copy and open these links:
        </Text>
        <Text style={fallback}>
          Still available: <Link href={stillAvailableUrl}>{stillAvailableUrl}</Link>
        </Text>
        <Text style={fallback}>
          Mark as sold: <Link href={markSoldUrl}>{markSoldUrl}</Link>
        </Text>

        <Text style={footer}>
          You are receiving this because you have an active listing on DISbook.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Is your DISbook listing still available?',
  displayName: 'Listing availability reminder',
  previewData: {
    bookTitle: 'Example Book Title',
    stillAvailableUrl: 'https://www.disbook.it/listing-action?token=example&action=still_available',
    markSoldUrl: 'https://www.disbook.it/listing-action?token=example&action=mark_sold',
  },
} satisfies TemplateEntry
