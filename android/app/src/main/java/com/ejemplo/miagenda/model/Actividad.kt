package com.ejemplo.miagenda.model

import java.time.LocalDate

enum class Prioridad(val etiqueta: String) {
    BAJA("Baja"),
    MEDIA("Media"),
    ALTA("Alta")
}

data class Actividad(
    val id: Int,
    val nombre: String,
    val fecha: LocalDate = LocalDate.now(),
    val prioridad: Prioridad = Prioridad.MEDIA,
    val completada: Boolean = false
)
