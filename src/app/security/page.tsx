import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SecurityPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Política de Seguridad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground prose prose-invert max-w-none">
            <p>
              La seguridad de su información es de suma importancia para nosotros en Rangel Guitar. Hemos implementado una variedad de medidas de seguridad para mantener la seguridad de su información personal cuando realiza un pedido o ingresa, envía o accede a su información personal.
            </p>
            <h2 className="text-xl font-semibold text-foreground pt-4">Protección de Datos</h2>
            <p>
              Utilizamos encriptación SSL (Secure Socket Layer) para proteger sus datos durante la transmisión. Sus datos personales se almacenan detrás de redes seguras y solo son accesibles por un número limitado de personas que tienen derechos de acceso especiales a dichos sistemas y están obligadas a mantener la confidencialidad de la información.
            </p>
            <h2 className="text-xl font-semibold text-foreground pt-4">Contraseñas</h2>
            <p>
              Las contraseñas de los usuarios se almacenan utilizando algoritmos de hash seguros. Nunca almacenamos contraseñas en texto plano. Es su responsabilidad mantener la confidencialidad de su contraseña y no compartirla con nadie.
            </p>
            <h2 className="text-xl font-semibold text-foreground pt-4">Proveedores de Terceros</h2>
            <p>
              Trabajamos con proveedores de servicios de confianza, como Firebase de Google para la autenticación, que cumplen con los más altos estándares de seguridad de la industria para proteger sus datos.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
