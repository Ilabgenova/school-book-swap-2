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

const Email = ({
  senderName = 'un altro utente / another user',
  conversationUrl = 'https://disbook.it/messages',
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
    conversationUrl: 'https://disbook.it/messages',
  },
} satisfies TemplateEntry
