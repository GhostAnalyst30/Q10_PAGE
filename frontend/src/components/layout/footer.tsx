import Link from "next/link";
import { BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Q10 Courses
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Plataforma de cursos online. Aprende desde cualquier lugar.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Plataforma</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/courses" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Cursos
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Registrarse
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Iniciar Sesión
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Categorías</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/courses?category=Programación" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Programación
                </Link>
              </li>
              <li>
                <Link href="/courses?category=Marketing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Marketing
                </Link>
              </li>
              <li>
                <Link href="/courses?category=Diseño" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Diseño
                </Link>
              </li>
              <li>
                <Link href="/courses?category=Finanzas" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Finanzas
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Legal</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-muted-foreground">Términos y condiciones</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Política de privacidad</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Q10 Courses. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
