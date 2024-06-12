import { Injectable } from '@angular/core';
import { supabase } from '../../config/supabase-config';
@Injectable({
  providedIn: 'root',
})
export class AniosService {
  constructor() {}

  async agregarDato(tabla: string, nuevoDato: any) {
    const { data, error } = await supabase.from(tabla).upsert([nuevoDato]);
    return { data, error };
  }

  async eliminarDato(tabla: string, id: any) {
    const { data, error } = await supabase.from(tabla).delete().eq('id', id);
    return { data, error };
  }
}
