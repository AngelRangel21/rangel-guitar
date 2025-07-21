
'use client';

import { useState, useEffect } from 'react';
import type { Artist } from '@/lib/types';
import { useI18n } from '@/context/i18n-context';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { addArtist, updateArtist, deleteArtist, type ArtistData } from '@/lib/client/artists';
import { getArtistsForClient } from '@/lib/client/artists';
import { revalidateArtists } from '@/app/admin/artists/actions';
import Image from 'next/image';

export function AdminArtistsContent() {
    const { t } = useI18n();
    const { toast } = useToast();
    const [artists, setArtists] = useState<Artist[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentArtist, setCurrentArtist] = useState<Artist | null>(null);
    const [artistName, setArtistName] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const fetchedArtists = await getArtistsForClient();
                setArtists(fetchedArtists);
            } catch (error) {
                console.error("Failed to fetch artists:", error);
                toast({ variant: "destructive", title: t('error'), description: "Failed to load artists." });
            } finally {
                setIsLoading(false);
            }
        };
        fetchArtists();
    }, [toast, t]);
    
    const handleOpenDialog = (artist: Artist | null) => {
        setCurrentArtist(artist);
        setArtistName(artist ? artist.name : '');
        setImageUrl(artist ? artist.imageUrl : '');
        setDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!artistName) return;

        setIsSubmitting(true);
        const artistData: ArtistData = { name: artistName, imageUrl: imageUrl || 'https://placehold.co/400x400.png' };

        try {
            if (currentArtist) {
                await updateArtist(currentArtist.id, artistData);
                setArtists(artists.map(a => a.id === currentArtist.id ? { ...a, ...artistData } : a).sort((a, b) => a.name.localeCompare(b.name)));
                toast({ title: t('artistUpdatedSuccess') });
            } else {
                const newArtist = await addArtist(artistData);
                setArtists([...artists, newArtist].sort((a, b) => a.name.localeCompare(b.name)));
                toast({ title: t('artistAddedSuccess') });
            }
            await revalidateArtists();
            setDialogOpen(false);
        } catch (error) {
            toast({ variant: 'destructive', title: t('error'), description: currentArtist ? t('artistUpdatedError') : t('artistAddedError') });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleDelete = async (artistId: string) => {
        setIsSubmitting(true);
        try {
            await deleteArtist(artistId);
            setArtists(artists.filter(a => a.id !== artistId));
            await revalidateArtists();
            toast({ title: t('artistDeletedSuccess') });
        } catch (error) {
            toast({ variant: 'destructive', title: t('error'), description: t('artistDeletedError') });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
       return (
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </div>
                        <Skeleton className="h-10 w-32" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>{t('manageArtists')}</CardTitle>
                        <CardDescription>{t('editArtistsDescription')}</CardDescription>
                    </div>
                    <Button onClick={() => handleOpenDialog(null)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {t('addArtist')}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('artistImageUrl')}</TableHead>
                            <TableHead>{t('artistName')}</TableHead>
                            <TableHead className="text-right">{t('actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {artists.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center h-24">{t('noArtistsFound')}</TableCell>
                            </TableRow>
                        ) : (
                            artists.map(artist => (
                                <TableRow key={artist.id}>
                                    <TableCell>
                                        <Image src={artist.imageUrl || 'https://placehold.co/40x40.png'} alt={artist.name} width={40} height={40} className="rounded-full aspect-square object-cover" />
                                    </TableCell>
                                    <TableCell className="font-medium">{artist.name}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(artist)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                         <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" disabled={isSubmitting}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>{t('deleteSongConfirmTitle')}</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        {t('artistDeleteConfirmation', { name: artist.name })}
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(artist.id)} className="bg-destructive hover:bg-destructive/90" disabled={isSubmitting}>
                                                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                                        {t('delete')}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{currentArtist ? t('editArtist') : t('addArtist')}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="artist-name">{t('artistName')}</Label>
                            <Input id="artist-name" value={artistName} onChange={(e) => setArtistName(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="image-url">{t('artistImageUrl')}</Label>
                            <Input id="image-url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://placehold.co/400x400.png" />
                        </div>
                         <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">{t('cancel')}</Button>
                            </DialogClose>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isSubmitting ? t('saving') + '...' : t('saveChanges')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
