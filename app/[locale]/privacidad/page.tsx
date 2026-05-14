import { getLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";

export async function generateMetadata() {
  const locale = await getLocale();
  return {
    title:
      locale === "es"
        ? "Aviso de Privacidad · Cerritos Beach"
        : "Privacy Policy · Cerritos Beach",
  };
}

export default async function PrivacyPage() {
  const locale = await getLocale();
  return (
    <Container className="py-16 lg:py-24">
      <article className="mx-auto max-w-3xl space-y-8 text-ink/85">
        {locale === "es" ? <PrivacyES /> : <PrivacyEN />}
      </article>
    </Container>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-xl font-medium text-ink tracking-tight pt-6">
      {children}
    </h2>
  );
}

function PrivacyES() {
  return (
    <>
      <header className="space-y-3">
        <h1 className="font-display text-4xl font-medium text-ink tracking-tight">
          Aviso de Privacidad
        </h1>
        <p className="text-sm text-mist">Última actualización: 13 de mayo de 2026</p>
      </header>

      <SectionHeading>1. Responsable</SectionHeading>
      <p>
        Cerritos Beach es operado por Cristobal Gomez (&quot;nosotros&quot;), con domicilio en
        Baja California Sur, México, y contacto a través de hola@cerritosbeach.com.
      </p>

      <SectionHeading>2. Datos que recopilamos</SectionHeading>
      <p>
        Para crear tu cuenta y participar en la comunidad recopilamos: dirección de correo
        electrónico, nombre para mostrar, nombre de usuario, idioma preferido, tipo de miembro
        (visitante, residente, local) y, opcionalmente, una foto de perfil. Cuando publiques en
        los foros guardamos ese contenido junto con tu identificador de usuario. También
        registramos datos técnicos básicos como tu dirección IP y tipo de navegador en logs de
        servidor con fines de seguridad.
      </p>

      <SectionHeading>3. Finalidades del tratamiento</SectionHeading>
      <p>
        Usamos tus datos para: (a) autenticarte y mantener tu sesión activa, (b) mostrar tu
        perfil público en la comunidad, (c) enviarte comunicaciones sobre el servicio (no
        marketing sin tu consentimiento), (d) operar y mejorar el sitio, (e) cumplir
        obligaciones legales.
      </p>

      <SectionHeading>4. Datos sensibles</SectionHeading>
      <p>
        No recolectamos datos personales sensibles (origen racial, religión, salud, orientación
        sexual, datos financieros, ni similares).
      </p>

      <SectionHeading>5. Transferencia a terceros</SectionHeading>
      <p>
        Para operar el servicio compartimos tus datos con proveedores ubicados en Estados
        Unidos: Supabase (base de datos y autenticación), Vercel (alojamiento web), Resend
        (envío de correos transaccionales) y Google (sólo si eliges iniciar sesión con Google,
        en cuyo caso recibimos tu correo y nombre desde tu cuenta). Estos proveedores tienen
        sus propias políticas de privacidad y operan bajo acuerdos de protección de datos.
      </p>

      <SectionHeading>6. Cookies</SectionHeading>
      <p>
        Usamos cookies estrictamente necesarias para mantener tu sesión iniciada, gestionadas
        por Supabase. No usamos cookies de tracking ni de publicidad de terceros.
      </p>

      <SectionHeading>7. Tus derechos ARCO</SectionHeading>
      <p>
        Conforme a la Ley Federal de Protección de Datos Personales en Posesión de los
        Particulares (LFPDPPP) tienes derecho a <strong>A</strong>cceder a tus datos,
        <strong> R</strong>ectificarlos si son incorrectos, <strong>C</strong>ancelarlos cuando
        lo desees, y <strong>O</strong>ponerte a tratamientos específicos. Para ejercer
        cualquiera de estos derechos escríbenos a hola@cerritosbeach.com. Responderemos en un
        plazo máximo de 20 días hábiles.
      </p>

      <SectionHeading>8. Conservación de datos</SectionHeading>
      <p>
        Mantenemos tus datos mientras tu cuenta esté activa. Si cancelas tu cuenta, eliminamos
        tus datos personales en un plazo de 30 días, salvo aquellos que estemos obligados a
        conservar por requerimientos legales.
      </p>

      <SectionHeading>9. Cambios a este aviso</SectionHeading>
      <p>
        Podemos actualizar este aviso. Cambios materiales se notificarán por correo electrónico
        con al menos 15 días de anticipación. Cambios menores se publicarán aquí con nueva
        fecha de actualización.
      </p>

      <SectionHeading>10. Contacto</SectionHeading>
      <p>
        Para cualquier duda sobre este aviso o el tratamiento de tus datos:
        hola@cerritosbeach.com
      </p>
    </>
  );
}

function PrivacyEN() {
  return (
    <>
      <header className="space-y-3">
        <h1 className="font-display text-4xl font-medium text-ink tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-mist">Last updated: May 13, 2026</p>
      </header>

      <SectionHeading>1. Who we are</SectionHeading>
      <p>
        Cerritos Beach is operated by Cristobal Gomez (&quot;we&quot;), based in Baja California
        Sur, Mexico. You can reach us at hola@cerritosbeach.com.
      </p>

      <SectionHeading>2. What we collect</SectionHeading>
      <p>
        To create your account and participate in the community we collect: email address,
        display name, username, preferred language, member type (visitor, resident, local),
        and optionally a profile picture. When you post in the forums we store that content
        alongside your user ID. We also log basic technical data such as IP address and browser
        type for security purposes.
      </p>

      <SectionHeading>3. How we use your data</SectionHeading>
      <p>
        We use your data to: (a) authenticate you and maintain your session, (b) display your
        public profile in the community, (c) send you service-related communications (no
        marketing without your consent), (d) operate and improve the site, (e) comply with
        legal obligations.
      </p>

      <SectionHeading>4. Sensitive data</SectionHeading>
      <p>
        We do not collect sensitive personal data (racial origin, religion, health, sexual
        orientation, financial data, or similar).
      </p>

      <SectionHeading>5. Third parties</SectionHeading>
      <p>
        To operate the service we share your data with providers located in the United States:
        Supabase (database and authentication), Vercel (web hosting), Resend (transactional
        email), and Google (only if you choose Sign in with Google, in which case we receive
        your email and name from your account). These providers have their own privacy
        policies and operate under data protection agreements.
      </p>

      <SectionHeading>6. Cookies</SectionHeading>
      <p>
        We use strictly necessary cookies to keep you signed in, managed by Supabase. We do
        not use tracking or third-party advertising cookies.
      </p>

      <SectionHeading>7. Your rights</SectionHeading>
      <p>
        Under Mexican law (LFPDPPP) and similar privacy frameworks you have the right to
        access, rectify, cancel, or oppose the processing of your data. To exercise any of
        these rights write to hola@cerritosbeach.com. We will respond within 20 business days.
      </p>

      <SectionHeading>8. Data retention</SectionHeading>
      <p>
        We keep your data while your account is active. If you delete your account, we remove
        your personal data within 30 days, except for data we are required to retain by law.
      </p>

      <SectionHeading>9. Changes to this policy</SectionHeading>
      <p>
        We may update this policy. Material changes will be notified by email at least 15 days
        in advance. Minor changes will be posted here with a new last-updated date.
      </p>

      <SectionHeading>10. Contact</SectionHeading>
      <p>For any question about this policy or your data: hola@cerritosbeach.com</p>
    </>
  );
}
