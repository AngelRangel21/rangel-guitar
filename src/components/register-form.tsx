'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { useI18n } from "@/context/i18n-context";
import { GoogleIcon } from "@/components/icons";

export function RegisterForm() {
  const { signInWithGoogle } = useAuth();
  const { t } = useI18n();

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{t('registerTitle')}</CardTitle>
        <CardDescription>{t('registerDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            <Button onClick={signInWithGoogle} className="w-full">
                <GoogleIcon className="mr-2 h-5 w-5" />
                {t('registerWithGoogle')}
            </Button>
            <div className="mt-4 text-center text-sm">
                {t('haveAccount')}{" "}
                <Link href="/login" className="underline text-accent">
                    {t('loginLink')}
                </Link>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}