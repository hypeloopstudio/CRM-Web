import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components"

interface OrderItem {
  nombre: string
  cantidad: number
  precio: number
}

interface OrderConfirmationEmailProps {
  customerName: string
  orderId: string
  items: OrderItem[]
  total: number
  direccion: string
  fecha: string
}

export function OrderConfirmationEmail({
  customerName,
  orderId,
  items,
  total,
  direccion,
  fecha,
}: OrderConfirmationEmailProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(price)
  }

  return (
    <Html>
      <Head />
      <Preview>¡Gracias por tu compra en Rapunzzel! Tu pedido #{orderId.slice(-8).toUpperCase()} está confirmado.</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>RAPUNZZEL</Text>
            <Text style={tagline}>La Fábrica de Transformaciones</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Heading style={heading}>¡Gracias por tu pedido!</Heading>
            
            <Text style={paragraph}>
              Hola <strong>{customerName}</strong>,
            </Text>
            
            <Text style={paragraph}>
              Hemos recibido tu pedido correctamente. Aquí tienes los detalles de tu compra:
            </Text>

            {/* Order Info */}
            <Section style={orderInfo}>
              <Text style={orderNumber}>
                Pedido #{orderId.slice(-8).toUpperCase()}
              </Text>
              <Text style={orderDate}>
                Fecha: {fecha}
              </Text>
            </Section>

            <Hr style={hr} />

            {/* Items */}
            <Section style={itemsSection}>
              <Text style={sectionTitle}>Productos</Text>
              {items.map((item, index) => (
                <Row key={index} style={itemRow}>
                  <Column style={itemName}>
                    {item.nombre} x{item.cantidad}
                  </Column>
                  <Column style={itemPrice}>
                    {formatPrice(item.precio * item.cantidad)}
                  </Column>
                </Row>
              ))}
            </Section>

            <Hr style={hr} />

            {/* Total */}
            <Section style={totalSection}>
              <Row>
                <Column style={totalLabel}>Subtotal:</Column>
                <Column style={totalValue}>{formatPrice(total)}</Column>
              </Row>
              <Row>
                <Column style={totalLabel}>Envío:</Column>
                <Column style={totalValue}>
                  {total >= 50000 ? "Gratis" : formatPrice(3990)}
                </Column>
              </Row>
              <Hr style={hrSmall} />
              <Row>
                <Column style={grandTotalLabel}>Total:</Column>
                <Column style={grandTotalValue}>
                  {formatPrice(total >= 50000 ? total : total + 3990)}
                </Column>
              </Row>
            </Section>

            <Hr style={hr} />

            {/* Shipping Address */}
            <Section style={addressSection}>
              <Text style={sectionTitle}>Dirección de envío</Text>
              <Text style={addressText}>{direccion}</Text>
            </Section>

            <Hr style={hr} />

            {/* Next Steps */}
            <Section style={stepsSection}>
              <Text style={sectionTitle}>¿Qué sigue?</Text>
              <Text style={stepText}>
                1. Procesaremos tu pedido en las próximas 24-48 horas
              </Text>
              <Text style={stepText}>
                2. Recibirás un email cuando tu pedido sea despachado
              </Text>
              <Text style={stepText}>
                3. El tiempo de entrega estimado es de 3-5 días hábiles
              </Text>
            </Section>

            {/* CTA */}
            <Section style={ctaSection}>
              <Link href="https://www.instagram.com/extensionesrapunzzel/" style={ctaButton}>
                Síguenos en Instagram
              </Link>
            </Section>

            <Text style={paragraph}>
              Si tienes alguna pregunta, no dudes en contactarnos a{" "}
              <Link href="mailto:contacto@rapunzzel.cl" style={link}>
                contacto@rapunzzel.cl
              </Link>
            </Text>

            <Text style={signature}>
              Con cariño,<br />
              El equipo de Rapunzzel 💛
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Extensiones Rapunzzel - La Fábrica de Transformaciones
            </Text>
            <Text style={footerText}>
              Santiago, Chile
            </Text>
            <Text style={footerLinks}>
              <Link href="https://www.instagram.com/extensionesrapunzzel/" style={footerLink}>
                Instagram
              </Link>
              {" • "}
              <Link href="mailto:contacto@rapunzzel.cl" style={footerLink}>
                Email
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: "#f6f6f6",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "0",
  maxWidth: "600px",
}

const header = {
  backgroundColor: "#1a1a1a",
  padding: "30px 40px",
  textAlign: "center" as const,
}

const logo = {
  color: "#d4a853",
  fontSize: "28px",
  fontWeight: "bold",
  letterSpacing: "4px",
  margin: "0",
}

const tagline = {
  color: "#888888",
  fontSize: "12px",
  letterSpacing: "2px",
  margin: "8px 0 0",
  textTransform: "uppercase" as const,
}

const content = {
  padding: "40px",
}

const heading = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 20px",
  textAlign: "center" as const,
}

const paragraph = {
  color: "#4a4a4a",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "0 0 16px",
}

const orderInfo = {
  backgroundColor: "#faf8f5",
  borderRadius: "8px",
  padding: "20px",
  margin: "20px 0",
  textAlign: "center" as const,
}

const orderNumber = {
  color: "#d4a853",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0 0 4px",
}

const orderDate = {
  color: "#666666",
  fontSize: "14px",
  margin: "0",
}

const hr = {
  borderColor: "#e6e6e6",
  margin: "24px 0",
}

const hrSmall = {
  borderColor: "#e6e6e6",
  margin: "12px 0",
}

const sectionTitle = {
  color: "#1a1a1a",
  fontSize: "14px",
  fontWeight: "bold",
  margin: "0 0 12px",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
}

const itemsSection = {
  margin: "0",
}

const itemRow = {
  margin: "8px 0",
}

const itemName = {
  color: "#4a4a4a",
  fontSize: "14px",
}

const itemPrice = {
  color: "#4a4a4a",
  fontSize: "14px",
  textAlign: "right" as const,
}

const totalSection = {
  margin: "0",
}

const totalLabel = {
  color: "#666666",
  fontSize: "14px",
  padding: "4px 0",
}

const totalValue = {
  color: "#666666",
  fontSize: "14px",
  textAlign: "right" as const,
  padding: "4px 0",
}

const grandTotalLabel = {
  color: "#1a1a1a",
  fontSize: "16px",
  fontWeight: "bold",
  padding: "8px 0",
}

const grandTotalValue = {
  color: "#d4a853",
  fontSize: "18px",
  fontWeight: "bold",
  textAlign: "right" as const,
  padding: "8px 0",
}

const addressSection = {
  margin: "0",
}

const addressText = {
  color: "#4a4a4a",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0",
}

const stepsSection = {
  backgroundColor: "#faf8f5",
  borderRadius: "8px",
  padding: "20px",
  margin: "0",
}

const stepText = {
  color: "#4a4a4a",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0 0 8px",
}

const ctaSection = {
  textAlign: "center" as const,
  margin: "24px 0",
}

const ctaButton = {
  backgroundColor: "#d4a853",
  borderRadius: "4px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "14px",
  fontWeight: "bold",
  padding: "12px 24px",
  textDecoration: "none",
}

const link = {
  color: "#d4a853",
  textDecoration: "underline",
}

const signature = {
  color: "#4a4a4a",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "24px 0 0",
}

const footer = {
  backgroundColor: "#1a1a1a",
  padding: "24px 40px",
  textAlign: "center" as const,
}

const footerText = {
  color: "#888888",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "0 0 4px",
}

const footerLinks = {
  color: "#888888",
  fontSize: "12px",
  margin: "12px 0 0",
}

const footerLink = {
  color: "#d4a853",
  textDecoration: "none",
}

export default OrderConfirmationEmail
