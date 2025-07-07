'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { useI18n } from "@/context/i18n-context";
import { GoogleIcon } from "@/components/icons";
import { useState } from "react";

/**
 * Componente del formulario de inicio de sesión.
 * Permite a los usuarios iniciar sesión con correo/contraseña o con Google.
 * @returns {JSX.Element} El formulario de inicio de sesión.
 */
export function LoginForm() {
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);

  // Define el esquema de validación del formulario con Zod.
  const formSchema = z.object({
    email: z.string().email({ message: t('invalidEmail') }),
    password: z.string().min(1, { message: t('passwordRequired') }),
  });

  // Inicializa el formulario con react-hook-form y el resolver de Zod.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /**
   * Maneja el envío del formulario de inicio de sesión con correo y contraseña.
   * @param {z.infer<typeof formSchema>} values - Los datos del formulario validados.
   */
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    await signInWithEmail(values);
    setIsLoading(false);
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{t('loginTitle')}</CardTitle>
        <CardDescription>{t('loginDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('emailLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('passwordLabel')}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t('loading') + '...' : t('loginButton')}
            </Button>
          </form>
        </Form>
        {/* Separador "O continuar con" */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {t('orContinueWith')}
            </span>
          </div>
        </div>
        {/* Botón de inicio de sesión con Google */}
        <Button onClick={signInWithGoogle} variant="outline" className="w-full" disabled={isLoading}>
          <GoogleIcon className="mr-2 h-5 w-5" />
          {t('loginWithGoogle')}
        </Button>
        {/* Enlace a la página de registro */}
        <div className="mt-4 text-center text-sm">
          {t('noAccount')}{" "}
          <Link href="/register" className="underline text-accent">
            {t('registerLink')}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
