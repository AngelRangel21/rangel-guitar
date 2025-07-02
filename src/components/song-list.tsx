"use client";

import { useState, useMemo, useEffect } from "react";
import { Grid, List } from "lucide-react";
import type { Song } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { SongCard } from "@/components/song-card";
import { SongListItem } from "@/components/song-list-item";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useI18n } from "@/context/i18n-context";

const SONGS_PER_PAGE = 16;

export function SongList({ songs }: { songs: Song[] }) {
  const [view, setView] = useState<"grid" | "list">("list");
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useI18n();

  useEffect(() => {
    setCurrentPage(1);
  }, [songs]);

  const totalPages = Math.ceil(songs.length / SONGS_PER_PAGE);

  const currentSongs = useMemo(() => {
    const start = (currentPage - 1) * SONGS_PER_PAGE;
    const end = start + SONGS_PER_PAGE;
    return songs.slice(start, end);
  }, [currentPage, songs]);
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 3;
    const halfMaxPages = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(2, currentPage - halfMaxPages);
    let endPage = Math.min(totalPages - 1, currentPage + halfMaxPages);

    if (currentPage <= maxPagesToShow) {
        startPage = 2;
        endPage = Math.min(totalPages - 1, maxPagesToShow);
    }

    if (currentPage > totalPages - maxPagesToShow) {
        startPage = Math.max(2, totalPages - maxPagesToShow);
        endPage = totalPages - 1;
    }
    
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}/>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink isActive={currentPage === 1} onClick={() => handlePageChange(1)}>
                        1
                    </PaginationLink>
                </PaginationItem>

                {startPage > 2 && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}

                {pageNumbers.map(number => (
                    <PaginationItem key={number}>
                        <PaginationLink isActive={currentPage === number} onClick={() => handlePageChange(number)}>
                            {number}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                {endPage < totalPages - 1 && (
                     <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}

                {totalPages > 1 && (
                    <PaginationItem>
                        <PaginationLink isActive={currentPage === totalPages} onClick={() => handlePageChange(totalPages)}>
                            {totalPages}
                        </PaginationLink>
                    </PaginationItem>
                )}

                <PaginationItem>
                    <PaginationNext onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}/>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        <div className="flex items-center gap-2">
          <Button variant={view === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('grid')} aria-label={t('gridView')}>
            <Grid className="h-5 w-5" />
          </Button>
          <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('list')} aria-label={t('listView')}>
            <List className="h-5 w-5" />
          </Button>
        </div>
      </div>
        
      {songs.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">{t('noSongsFound')}</p>
        </div>
      ) : (
        <>
        <div
            className={`transition-all duration-300 ${
            view === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6'
                : 'flex flex-col space-y-3'
            }`}
        >
            {currentSongs.map((song, index) => (
            <div 
              key={song.id} 
              style={{ animationDelay: `${index * 50}ms` }} 
              className="opacity-0 animate-fade-in-up"
            >
                {view === 'grid' ? <SongCard song={song} /> : <SongListItem song={song} />}
            </div>
            ))}
        </div>

        {totalPages > 1 && (
            <div className="pt-6">
            {renderPagination()}
            </div>
        )}
        </>
      )}

    </div>
  );
}
