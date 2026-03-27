// ./memorama/data/score/scoreService.js

import { createClient } from "https://esm.sh/@supabase/supabase-js"

const supabaseUrl = "https://gwwddqzfrvvbyvphamzu.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3d2RkcXpmcnZ2Ynl2cGhhbXp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NDA5MDMsImV4cCI6MjA4OTUxNjkwM30.oMj5yWFZ9arRPCoN81JxNg9T06qHF8HrJXXbgv18e_Q"

export const supabase = createClient(supabaseUrl, supabaseKey)

// 🔹 guardar score
export async function guardarScore({ nombre, sistema, aciertos, rondas, intentos }) {

  const { data, error } = await supabase
    .from("scores")
    .insert([{
      nombre,
      sistema: sistema.toLowerCase(),
      aciertos,
      rondas,
      intentos
    }])

  if(error){
    console.error("ERROR GUARDANDO:", error)
  }

  return data
}

// 🔹 obtener top
export async function obtenerTop(sistema, limite = 10){

  const { data, error } = await supabase
    .from("scores")
    .select("*")
    .eq("sistema", sistema.toLowerCase())
    .order("rondas", { ascending: false })
    .order("aciertos", { ascending: false })
    .order("intentos", { ascending: true })
    .limit(limite)

  if(error){
    console.error("ERROR OBTENER:", error)
    return []
  }

  return data || []
}
