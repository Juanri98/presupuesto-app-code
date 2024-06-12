import { Injectable } from '@angular/core';
import { supabase } from '../../config/supabase-config';
import { Observable, forkJoin, map } from 'rxjs';
import { PostgrestResponse, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class MovimientosService {
  supabase: SupabaseClient;
  constructor() {}

  async obtenerAnioPorValor(anio: number): Promise<any | null> {
    const { data, error } = await supabase
      .from('anios')
      .select('id')
      .eq('anio', anio);

    if (error) {
      throw error;
    }

    return data[0] || null;
  }

  async obtenerMesPorValor(mes: string): Promise<any | null> {
    const { data, error } = await supabase
      .from('meses')
      .select('id')
      .eq('mes', mes);

    if (error) {
      throw error;
    }

    return data[0] || null;
  }

  async obtenerTransaccionesPorAnioYMes(
    anioId: number,
    mesId: number
  ): Promise<any[]> {
    const { data, error } = await supabase
      .from('movimientos')
      .select()
      .eq('anio', anioId)
      .eq('mes', mesId);

    if (error) {
      throw error;
    }

    return data;
  }
}
