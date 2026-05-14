import { getLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";

export async function generateMetadata() {
  const locale = await getLocale();
  return {
    title:
      locale === "es"
        ? "Términos y Condiciones · Cerritos Beach"
        : "Terms of Service · Cerritos Beach",
  };
}

export default async function TermsPage() {
  const locale = await getLocale();
  return (
    <Container className="py-16 lg:py-24">
      <article className="mx-auto max-w-3xl space-y-8 text-ink/85">
        {locale === "es" ? <TermsES /> : <TermsEN />}
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

function TermsES() {
  return (
    <>
      <header className="space-y-3">
        <h1 className="font-display text-4xl font-medium text-ink tracking-tight">
          Términos y Condiciones
        </h1>
        <p className="text-sm text-mist">Última actualización: 13 de mayo de 2026</p>
      </header>

      <SectionHeading>1. Aceptación</SectionHeading>
      <p>
        Al usar cerritosbeach.com aceptas estos términos. Si no estás de acuerdo con alguna
        parte, por favor no uses el servicio.
      </p>

      <SectionHeading>2. Descripción del servicio</SectionHeading>
      <p>
        Cerritos Beach es una guía digital y comunidad para la playa de Cerritos, en Baja
        California Sur, México. Ofrecemos información, recursos y un espacio para conectar
        entre residentes y visitantes.
      </p>

      <SectionHeading>3. Quién puede usar el servicio</SectionHeading>
      <p>
        El servicio está disponible para personas mayores de 18 años. Al crear una cuenta
        declaras que cumples este requisito y que la información que proporcionas es verdadera
        y actual.
      </p>

      <SectionHeading>4. Tu cuenta</SectionHeading>
      <p>
        Eres responsable de mantener la confidencialidad de tu sesión y de toda actividad que
        ocurra desde tu cuenta. Una persona puede tener una sola cuenta. Notifícanos de
        inmediato si sospechas acceso no autorizado.
      </p>

      <SectionHeading>5. Conducta esperada</SectionHeading>
      <p>
        No publiques ni distribuyas: spam o publicidad no solicitada; contenido que acose,
        amenace o discrimine; información personal de terceros sin su consentimiento;
        contenido sexual o violento; material que infrinja derechos de propiedad intelectual;
        ni contenido ilegal bajo la ley mexicana. Nos reservamos el derecho de moderar,
        ocultar o eliminar contenido que viole estas normas.
      </p>

      <SectionHeading>6. Tu contenido</SectionHeading>
      <p>
        Conservas la propiedad del contenido que publiques. Al publicarlo nos otorgas una
        licencia no exclusiva, mundial y gratuita para mostrarlo dentro de la plataforma con
        el fin de operar el servicio. Esta licencia termina cuando elimines el contenido o tu
        cuenta.
      </p>

      <SectionHeading>7. Nuestro contenido</SectionHeading>
      <p>
        El diseño, textos, código, logos y materiales originales del sitio son propiedad de
        Cerritos Beach (Cristobal Gomez) y están protegidos por derechos de autor.
      </p>

      <SectionHeading>8. Suspensión y cierre</SectionHeading>
      <p>
        Podemos suspender o cerrar tu cuenta si violas estos términos, si presentas riesgo
        para otras personas, o por requerimiento legal. Puedes cerrar tu cuenta cuando quieras
        escribiéndonos a hola@cerritosbeach.com.
      </p>

      <SectionHeading>9. Sin garantías</SectionHeading>
      <p>
        El servicio se ofrece &quot;tal cual&quot;. No garantizamos disponibilidad continua,
        ausencia de errores, ni la exactitud de toda la información publicada por la
        comunidad. Verifica datos críticos (como teléfonos de emergencia o condiciones de
        surf) con fuentes oficiales.
      </p>

      <SectionHeading>10. Limitación de responsabilidad</SectionHeading>
      <p>
        Hasta el máximo permitido por la ley, Cerritos Beach no será responsable por daños
        indirectos, incidentales o consecuentes derivados del uso del servicio.
      </p>

      <SectionHeading>11. Cambios a los términos</SectionHeading>
      <p>
        Podemos actualizar estos términos. Cambios materiales se notificarán por correo
        electrónico con al menos 15 días de anticipación.
      </p>

      <SectionHeading>12. Ley aplicable y jurisdicción</SectionHeading>
      <p>
        Estos términos se rigen por las leyes de México. Cualquier disputa se resolverá en los
        tribunales competentes de La Paz, Baja California Sur.
      </p>

      <SectionHeading>13. Contacto</SectionHeading>
      <p>hola@cerritosbeach.com</p>
    </>
  );
}

function TermsEN() {
  return (
    <>
      <header className="space-y-3">
        <h1 className="font-display text-4xl font-medium text-ink tracking-tight">
          Terms of Service
        </h1>
        <p className="text-sm text-mist">Last updated: May 13, 2026</p>
      </header>

      <SectionHeading>1. Acceptance</SectionHeading>
      <p>
        By using cerritosbeach.com you accept these terms. If you disagree with any part,
        please do not use the service.
      </p>

      <SectionHeading>2. The service</SectionHeading>
      <p>
        Cerritos Beach is a digital guide and community for Cerritos Beach in Baja California
        Sur, Mexico. We offer information, resources and a space to connect between residents
        and visitors.
      </p>

      <SectionHeading>3. Who can use it</SectionHeading>
      <p>
        The service is available to people 18 years or older. By creating an account you
        declare you meet this requirement and that the information you provide is truthful
        and current.
      </p>

      <SectionHeading>4. Your account</SectionHeading>
      <p>
        You are responsible for the confidentiality of your session and any activity that
        happens from your account. One person, one account. Notify us immediately if you
        suspect unauthorized access.
      </p>

      <SectionHeading>5. Expected conduct</SectionHeading>
      <p>
        Do not post or distribute: spam or unsolicited advertising; content that harasses,
        threatens or discriminates; personal information of third parties without their
        consent; sexual or violent content; material that infringes intellectual property
        rights; or content illegal under Mexican law. We reserve the right to moderate, hide
        or remove content that violates these norms.
      </p>

      <SectionHeading>6. Your content</SectionHeading>
      <p>
        You retain ownership of the content you publish. By posting it you grant us a
        non-exclusive, worldwide, royalty-free license to display it within the platform for
        the purpose of operating the service. This license ends when you delete the content
        or your account.
      </p>

      <SectionHeading>7. Our content</SectionHeading>
      <p>
        The design, text, code, logos and original materials of the site are property of
        Cerritos Beach (Cristobal Gomez) and protected by copyright.
      </p>

      <SectionHeading>8. Suspension and termination</SectionHeading>
      <p>
        We may suspend or terminate your account if you violate these terms, pose risk to
        others, or by legal requirement. You may close your account at any time by writing to
        hola@cerritosbeach.com.
      </p>

      <SectionHeading>9. No warranties</SectionHeading>
      <p>
        The service is provided &quot;as is&quot;. We do not guarantee continuous
        availability, absence of errors, or the accuracy of all information posted by the
        community. Verify critical data (such as emergency phone numbers or surf conditions)
        with official sources.
      </p>

      <SectionHeading>10. Limitation of liability</SectionHeading>
      <p>
        To the maximum extent permitted by law, Cerritos Beach will not be liable for
        indirect, incidental or consequential damages arising from use of the service.
      </p>

      <SectionHeading>11. Changes to the terms</SectionHeading>
      <p>
        We may update these terms. Material changes will be notified by email at least 15
        days in advance.
      </p>

      <SectionHeading>12. Governing law and jurisdiction</SectionHeading>
      <p>
        These terms are governed by the laws of Mexico. Any dispute will be resolved in the
        competent courts of La Paz, Baja California Sur.
      </p>

      <SectionHeading>13. Contact</SectionHeading>
      <p>hola@cerritosbeach.com</p>
    </>
  );
}
