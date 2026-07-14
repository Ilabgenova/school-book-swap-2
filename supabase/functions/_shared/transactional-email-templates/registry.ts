/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import type { ComponentType } from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'
import { template as newMessage } from './new-message.tsx'

export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: any) => string)
  displayName?: string
  previewData?: Record<string, unknown>
  to?: string
}

const testMain: React.CSSProperties = {
  backgroundColor: '#ffffff',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  margin: 0,
  padding: '24px 0',
}

const testContainer: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  margin: '0 auto',
  maxWidth: '560px',
  padding: '32px',
}

const EmailTest = () => (
  <Html>
    <Head />
    <Preview>DISbook email test</Preview>
    <Body style={testMain}>
      <Container style={testContainer}>
        <Heading style={{ color: '#2F6B4F', fontSize: '24px', margin: '0 0 16px' }}>
          DISbook email test
        </Heading>
        <Text style={{ color: '#374151', fontSize: '15px', lineHeight: '22px', margin: 0 }}>
          This is a test email from DISbook to confirm that email notifications are working.
        </Text>
      </Container>
    </Body>
  </Html>
)

const emailTest = {
  component: EmailTest,
  subject: 'DISbook email test',
  displayName: 'Admin email test',
  previewData: {},
} satisfies TemplateEntry

export const TEMPLATES: Record<string, TemplateEntry> = {
  'new-message': newMessage,
  'email-test': emailTest,
}
