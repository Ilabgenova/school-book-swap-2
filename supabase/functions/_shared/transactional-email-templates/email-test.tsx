/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const brand = '#2F6B4F'

const main: React.CSSProperties = {
  backgroundColor: '#ffffff',
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
}

const text: React.CSSProperties = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '22px',
  margin: 0,
}

const Email = () => (
  <Html>
    <Head />
    <Preview>DISbook email test</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>DISbook email test</Heading>
        <Text style={text}>
          This is a test email from DISbook to confirm that email notifications are working.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'DISbook email test',
  displayName: 'Admin email test',
  previewData: {},
} satisfies TemplateEntry