"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getGames,
  getPlayers,
  getAnnouncements,
  getFundraising,
  getCalendarEvents,
  getPhotos,
  getSession,
  type DbGame,
  type DbPlayer,
  type DbAnnouncement,
  type DbFundraising,
  type DbCalendarEvent,
  type DbPhoto,
} from "./database";
import { supabase } from "./supabase";

// Generic hook for async data fetching
function useQuery<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    fetcher()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, deps);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

export function useGames(team?: string) {
  return useQuery(() => getGames(team), [team]);
}

export function usePlayers(team?: string) {
  return useQuery(() => getPlayers(team), [team]);
}

export function useAllPlayers() {
  return useQuery(() => getPlayers(), []);
}

export function useAnnouncements(activeOnly = true) {
  return useQuery(() => getAnnouncements(activeOnly), [activeOnly]);
}

export function useFundraising() {
  return useQuery(() => getFundraising(), []);
}

export function useAllGames() {
  const result = useQuery(() => getGames(), []);
  const grouped = result.data
    ? {
        varsity: result.data.filter((g) => g.team === "varsity"),
        jv: result.data.filter((g) => g.team === "jv"),
        cteam: result.data.filter((g) => g.team === "cteam"),
      }
    : null;
  return { ...result, grouped };
}

export function useAllPlayersGrouped() {
  const result = useQuery(() => getPlayers(), []);
  const grouped = result.data
    ? {
        varsity: result.data.filter((p) => p.team === "varsity"),
        jv: result.data.filter((p) => p.team === "jv"),
        cteam: result.data.filter((p) => p.team === "cteam"),
      }
    : null;
  return { ...result, grouped };
}

export function useCalendarEvents() {
  return useQuery(() => getCalendarEvents(), []);
}

export function usePhotos(category?: string) {
  return useQuery(() => getPhotos(category), [category]);
}

export function useAuth() {
  const [session, setSession] = useState<Awaited<ReturnType<typeof getSession>>>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession().then((s) => {
      setSession(s);
      setLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  return { session, isAdmin: !!session, loading };
}
