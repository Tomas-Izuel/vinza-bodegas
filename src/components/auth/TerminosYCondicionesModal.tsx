"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

interface TerminosYCondicionesModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TerminosYCondicionesModal({
  isOpen,
  onOpenChange,
}: TerminosYCondicionesModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Términos y Condiciones</DialogTitle>
          <DialogDescription>
            Por favor, lee cuidadosamente los siguientes términos y condiciones
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            <section>
              <h2 className="text-lg font-semibold mb-3">1. Introducción.</h2>
              <p className="text-muted-foreground leading-relaxed">
                Estos Términos de Servicio (&quot;Términos&quot;, &quot;Términos
                de Servicio&quot;) se utilizan para determinar las reglas del
                Servicio y para aclarar la relación legal entre la entidad que
                utiliza el Servicio y la Empresa.vinza. (&quot;Empresa&quot;)
                opera páginas web ubicadas en vinza.fun (&quot;Sitio Web&quot;)
                y ofrece el servicio (como se define a continuación en la
                Sección 2). El Servicio está dedicado a entidades profesionales
                para ayudarlas a conducir su negocio. Al usar el Sitio Web y/o
                el Servicio de cualquier manera, también al pasar por el proceso
                de registro de la Cuenta, el Usuario o el Invitado declara que
                (i) ha leído, entendido y acepta las disposiciones de los
                Términos y la Política de Privacidad, (ii) su edad y capacidad
                legal le permite celebrar un acuerdo con la Empresa, (iii) tiene
                derecho a actuar en nombre de la entidad que representa y sus
                declaraciones son efectivas. Si el Usuario no está de acuerdo en
                aplicar bajo las disposiciones de los Términos, no debe utilizar
                el Servicio. En tal caso, sin embargo, el Usuario puede
                contactar a la Empresa enviando un correo electrónico a
                support@vinza.fun para que la Empresa pueda intentar encontrar
                una solución.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">2. Definiciones.</h2>
              <p className="text-muted-foreground leading-relaxed">
                A menos que se indique lo contrario, los siguientes términos en
                mayúsculas tienen el siguiente significado: Cuenta - significa
                panel individualizado que sirve al Usuario para explotar el
                Servicio y/o el Sitio Web. Acuerdo significa un acuerdo de
                suscripción que puede celebrarse entre el Usuario y la Empresa,
                que especifica el alcance y el precio por el uso del Servicio.
                Empresa - significa Vinza.com. Contenido significa los
                contenidos como textos, imágenes y otros, que el Invitado o el
                Usuario publica, presenta o envía en el Sitio Web o con el uso
                del Servicio. Dispositivo significa dispositivos como una
                computadora, teléfono, smartphone, tableta u otro equipo
                electrónico que permite navegar por páginas web. Invitado
                significa una entidad que navega por el Sitio Web. Propiedad
                Intelectual significa cualquier designación, invención, modelo
                de utilidad, diseño industrial, obras y otras expresiones
                externalizadas de actividad creativa que son objeto de derechos
                exclusivos de la Empresa. Enlace - significa hipervínculo que
                hace referencia a Otros Sitios Web. Dispositivo Móvil -
                significa un dispositivo portátil como un teléfono, smartphone,
                tableta u otro equipo electrónico que opera el Sitio Web y/o el
                Servicio. Notificación - significa mensaje enviado al Usuario
                como parte del Servicio. Otros Sitios Web - significa sitios web
                distintos del Sitio Web. Contraseña - significa la herramienta
                de verificación anonimizada del Usuario que permite el acceso a
                la Cuenta y es la secuencia de signos posiblemente para ingresar
                mediante el uso del teclado de la computadora o Dispositivo
                Móvil, que también permite ingresar mensajes de texto en la
                cantidad y configuración inventada por el Usuario, sin embargo,
                contiene al menos 8 signos. Política de Privacidad - Significa
                la Política de Privacidad, que define las reglas de
                procesamiento de datos personales por parte de la Empresa.
                Servicio - significa conjuntamente el Sitio Web, o aplicación
                mobile (dependiendo del alcance dedicado a un Usuario
                determinado de conformidad con el Acuerdo). Las definiciones
                mencionadas anteriormente conservan su significado
                independientemente de si se expresan en singular o en plural.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">
                3. Reglas Generales.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                El uso del Servicio significa la aceptación total de los
                Términos. Los Términos se aplican a las relaciones entre la
                Empresa y el Invitado o el Usuario únicamente. Si el Servicio
                y/o el Sitio Web introduce la posibilidad de proporcionar
                servicios por otras entidades, se proporcionarán sobre la base
                de regulaciones compartidas por estas entidades y solo estas
                entidades serán responsables de la ejecución de los servicios,
                excepto que el contenido de los Términos indique clara e
                inequívocamente lo contrario. Cada entidad que utiliza el
                Servicio y/o el Sitio Web está obligada a utilizarlo de acuerdo
                con su destino resultante de los Términos. El uso del Sitio Web
                está permitido siempre que el Dispositivo cumpla conjuntamente
                los siguientes requisitos técnicos mínimos: tiene acceso a
                Internet, permite el inicio de uno de los siguientes navegadores
                de Internet: (i) Google Chrome, (ii) Opera, (iii) Firefox, (iv)
                Safari, (v) Microsoft Edge, la versión del navegador de Internet
                utilizada no puede tener más de un año de antigüedad, tiene
                JavaScript habilitado.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
