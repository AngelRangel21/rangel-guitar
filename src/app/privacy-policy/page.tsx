import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Página estática que muestra la política de privacidad del sitio web.
 * Contiene información legal sobre cómo se manejan los datos de los usuarios.
 * @returns {JSX.Element} La página de política de privacidad.
 */
export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Política de Privacidad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground prose prose-invert max-w-none">
            {/* Contenido de la política de privacidad */}
            <p>
              En Rangel Guitar, accesible desde rangelguitar.com, una de nuestras principales prioridades es la privacidad de nuestros visitantes. Este documento de Política de Privacidad contiene tipos de información que son recopilados y registrados por Rangel Guitar y cómo la usamos.
            </p>
            <h2 className="text-xl font-semibold text-foreground pt-4">Consentimiento</h2>
            <p>
              Al utilizar nuestro sitio web, usted consiente nuestra Política de Privacidad y acepta sus términos.
            </p>
            <h2 className="text-xl font-semibold text-foreground pt-4">Información que recopilamos</h2>
            <p>
              La información personal que se le solicita que proporcione, y las razones por las que se le solicita que la proporcione, se le aclararán en el momento en que le pidamos que proporcione su información personal. Si se comunica con nosotros directamente, es posible que recibamos información adicional sobre usted, como su nombre, dirección de correo electrónico, número de teléfono, el contenido del mensaje y/o los archivos adjuntos que nos pueda enviar, y cualquier otra información que elija proporcionar.
            </p>
            <h2 className="text-xl font-semibold text-foreground pt-4">Uso de su información</h2>
            <p>
                Utilizamos la información que recopilamos de varias maneras, que incluyen:
            </p>
            <ul className="list-disc pl-6 space-y-2">
                <li>Proporcionar, operar y mantener nuestro sitio web.</li>
                <li>Mejorar, personalizar y expandir nuestro sitio web.</li>
                <li>Comprender y analizar cómo utiliza nuestro sitio web.</li>
                <li>Desarrollar nuevos productos, servicios, características y funcionalidades.</li>
                <li>Comunicarnos con usted, ya sea directamente o a través de uno de nuestros socios, incluido el servicio al cliente, para proporcionarle actualizaciones y otra información relacionada con el sitio web, y con fines promocionales y de marketing.</li>
            </ul>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
