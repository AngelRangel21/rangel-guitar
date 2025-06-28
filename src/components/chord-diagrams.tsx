"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useI18n } from "@/context/i18n-context";

export function ChordDiagrams({ chordName }: { chordName: string }) {
  const { t } = useI18n();
  return (
    <div>
      <h4 className="font-bold text-lg mb-2">{t('chord')}: {chordName}</h4>
      <Tabs defaultValue="guitar" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="guitar">{t('guitar')}</TabsTrigger>
          <TabsTrigger value="keyboard">{t('keyboard')}</TabsTrigger>
        </TabsList>
        <TabsContent value="guitar">
          <Card>
            <CardContent className="p-4 flex gap-4 overflow-x-auto">
              {/* Placeholder diagrams */}
              <Image src="https://placehold.co/150x200.png" width={150} height={200} alt={`Guitar chord diagram for ${chordName}`} data-ai-hint="guitar chord" />
              <Image src="https://placehold.co/150x200.png" width={150} height={200} alt={`Guitar chord diagram for ${chordName}`} data-ai-hint="guitar chord" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="keyboard">
          <Card>
            <CardContent className="p-4 flex gap-4 overflow-x-auto">
                {/* Placeholder diagrams */}
                <Image src="https://placehold.co/200x100.png" width={200} height={100} alt={`Keyboard chord diagram for ${chordName}`} data-ai-hint="piano chord" />
                <Image src="https://placehold.co/200x100.png" width={200} height={100} alt={`Keyboard chord diagram for ${chordName}`} data-ai-hint="piano chord" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
