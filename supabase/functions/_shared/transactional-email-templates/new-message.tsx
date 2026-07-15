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
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  senderName?: string
  conversationUrl?: string
}

const brand = '#2F6B4F' // Forest green (DISbook primary)

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

const section: React.CSSProperties = {
  margin: '16px 0',
}

const text: React.CSSProperties = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '22px',
  margin: '0 0 12px',
}

const button: React.CSSProperties = {
  backgroundColor: brand,
  borderRadius: '6px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '15px',
  fontWeight: 600,
  padding: '12px 20px',
  textDecoration: 'none',
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

const Email = ({
  senderName = 'un altro utente / another user',
  conversationUrl = 'https://www.disbook.it/messages',
}: Props) => (
  <Html>
    <Head />
    <Preview>Hai un nuovo messaggio su DISbook — You have a new message on DISbook</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>DISbook</Heading>

        {/* Italian */}
        <Section style={section}>
          <Heading as="h2" style={h2}>Hai ricevuto un nuovo messaggio</Heading>
          <Text style={text}>
            <strong>{senderName}</strong> ti ha inviato un messaggio su DISbook.
          </Text>
          <Text style={text}>
            Per leggerlo e rispondere, apri la conversazione:
          </Text>
          <Button href={conversationUrl} style={button}>
            Apri il messaggio
          </Button>
        </Section>

        <Hr style={hr} />

        {/* English */}
        <Section style={section}>
          <Heading as="h2" style={h2}>You have a new message</Heading>
          <Text style={text}>
            <strong>{senderName}</strong> sent you a message on DISbook.
          </Text>
          <Text style={text}>
            To read it and reply, open the conversation:
          </Text>
          <Button href={conversationUrl} style={button}>
            Open the message
          </Button>
        </Section>

        <Hr style={hr} />

        <Text style={footer}>
          Ricevi questa email perché hai attivato le notifiche dei messaggi nel tuo account DISbook.
          Puoi disattivarle dalla pagina Messaggi.
          <br />
          You are receiving this because message notifications are enabled on your DISbook account.
          You can turn them off from the Messages page.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Hai un nuovo messaggio su DISbook / New message on DISbook',
  displayName: 'New message notification',
  previewData: {
    senderName: 'Mario',
    conversationUrl: 'https://www.disbook.it/messages',
  },
} satisfies TemplateEntry
