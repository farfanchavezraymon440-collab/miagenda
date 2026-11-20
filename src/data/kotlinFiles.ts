export interface KotlinFileSpec {
  id: string;
  fileName: string;
  packagePath: string;
  summary: string;
  code: string;
}

export const KOTLIN_FILES: KotlinFileSpec[] = [
  {
    id: 'screen',
    fileName: 'MiAgendaScreen.kt',
    packagePath: 'app/src/main/java/com/ejemplo/miagenda/ui/MiAgendaScreen.kt',
    summary:
      'Pantalla principal con formulario validado, selector de fecha y prioridad, tarjeta de progreso, búsqueda en tiempo real y edición.',
    code: `package com.ejemplo.miagenda.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.CalendarToday
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DatePicker
import androidx.compose.material3.DatePickerDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.rememberDatePickerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import com.ejemplo.miagenda.model.Actividad
import com.ejemplo.miagenda.model.Prioridad
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MiAgendaScreen() {
    // Estado en memoria: se conserva solo mientras la app está abierta
    val actividades = remember { mutableStateListOf<Actividad>() }
    var siguienteId by remember { mutableIntStateOf(1) }

    // Estado del formulario de creación
    var textoActividad by remember { mutableStateOf("") }
    var mostrarErrorVacio by remember { mutableStateOf(false) }
    var fechaSeleccionada by remember { mutableStateOf(LocalDate.now()) }
    var mostrarSelectorFecha by remember { mutableStateOf(false) }
    var prioridadSeleccionada by remember { mutableStateOf(Prioridad.MEDIA) }

    // Estado de búsqueda en tiempo real
    var textoBusqueda by remember { mutableStateOf("") }

    // Estado para editar una actividad existente
    var actividadEnEdicion by remember { mutableStateOf<Actividad?>(null) }

    // Lista filtrada por nombre en tiempo real
    val actividadesFiltradas = actividades.filter { actividad ->
        actividad.nombre.contains(textoBusqueda.trim(), ignoreCase = true)
    }

    val formatoFecha = remember {
        DateTimeFormatter.ofPattern("d MMM yyyy", Locale("es", "ES"))
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Mi Agenda",
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.Bold
                    )
                }
            )
        }
    ) { paddingInterno ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingInterno)
                .padding(horizontal = 16.dp, vertical = 12.dp)
        ) {
            // 1. Formulario para agregar actividad
            OutlinedTextField(
                value = textoActividad,
                onValueChange = { nuevoTexto ->
                    textoActividad = nuevoTexto
                    if (nuevoTexto.isNotBlank()) {
                        mostrarErrorVacio = false
                    }
                },
                label = { Text("Escribe una actividad") },
                isError = mostrarErrorVacio,
                supportingText = {
                    if (mostrarErrorVacio) {
                        Text("Debes escribir una actividad antes de agregarla.")
                    }
                },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Selector de fecha (usa la fecha de hoy por defecto)
            OutlinedButton(
                onClick = { mostrarSelectorFecha = true },
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(
                    imageVector = Icons.Default.CalendarToday,
                    contentDescription = "Elegir fecha",
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text("Fecha: \${fechaSeleccionada.format(formatoFecha)}")
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Selector de prioridad (Baja, Media, Alta)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Prioridad.entries.forEach { prioridad ->
                    FilterChip(
                        selected = prioridadSeleccionada == prioridad,
                        onClick = { prioridadSeleccionada = prioridad },
                        label = { Text(prioridad.etiqueta) },
                        modifier = Modifier.weight(1f)
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            Button(
                onClick = {
                    val nombreLimpio = textoActividad.trim()
                    if (nombreLimpio.isEmpty()) {
                        mostrarErrorVacio = true
                    } else {
                        actividades.add(
                            0,
                            Actividad(
                                id = siguienteId++,
                                nombre = nombreLimpio,
                                fecha = fechaSeleccionada,
                                prioridad = prioridadSeleccionada,
                                completada = false
                            )
                        )
                        textoActividad = ""
                        fechaSeleccionada = LocalDate.now()
                        prioridadSeleccionada = Prioridad.MEDIA
                        mostrarErrorVacio = false
                    }
                },
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(
                    imageVector = Icons.Default.Add,
                    contentDescription = null,
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text("Agregar actividad")
            }

            Spacer(modifier = Modifier.height(16.dp))

            // 2. Tarjeta de resumen con porcentaje completado
            TarjetaResumenProgreso(
                total = actividades.size,
                completadas = actividades.count { it.completada }
            )

            Spacer(modifier = Modifier.height(12.dp))

            // 3. Barra de búsqueda en tiempo real
            OutlinedTextField(
                value = textoBusqueda,
                onValueChange = { textoBusqueda = it },
                placeholder = { Text("Buscar actividad por nombre...") },
                leadingIcon = {
                    Icon(Icons.Default.Search, contentDescription = "Buscar")
                },
                trailingIcon = {
                    if (textoBusqueda.isNotEmpty()) {
                        IconButton(onClick = { textoBusqueda = "" }) {
                            Icon(Icons.Default.Close, contentDescription = "Limpiar búsqueda")
                        }
                    }
                },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(12.dp))

            // 4. Lista de actividades
            if (actividadesFiltradas.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = if (actividades.isEmpty()) {
                            "Aún no hay actividades. Agrega la primera arriba."
                        } else {
                            "No hay actividades que coincidan con tu búsqueda."
                        },
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            } else {
                LazyColumn(
                    modifier = Modifier.weight(1f),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(actividadesFiltradas, key = { it.id }) { actividad ->
                        ActividadFila(
                            actividad = actividad,
                            formatoFecha = formatoFecha,
                            onToggleCompletada = {
                                val index = actividades.indexOfFirst { it.id == actividad.id }
                                if (index != -1) {
                                    actividades[index] = actividades[index].copy(
                                        completada = !actividades[index].completada
                                    )
                                }
                            },
                            onEditar = { actividadEnEdicion = actividad },
                            onEliminar = {
                                actividades.removeAll { it.id == actividad.id }
                            }
                        )
                    }
                }
            }
        }
    }

    // Diálogo para elegir la fecha al crear una actividad
    if (mostrarSelectorFecha) {
        val datePickerState = rememberDatePickerState(
            initialSelectedDateMillis = fechaSeleccionada
                .atStartOfDay(ZoneOffset.UTC)
                .toInstant()
                .toEpochMilli()
        )
        DatePickerDialog(
            onDismissRequest = { mostrarSelectorFecha = false },
            confirmButton = {
                TextButton(
                    onClick = {
                        val millis = datePickerState.selectedDateMillis
                        fechaSeleccionada = if (millis != null) {
                            Instant.ofEpochMilli(millis).atZone(ZoneOffset.UTC).toLocalDate()
                        } else {
                            LocalDate.now()
                        }
                        mostrarSelectorFecha = false
                    }
                ) {
                    Text("Aceptar")
                }
            },
            dismissButton = {
                TextButton(onClick = { mostrarSelectorFecha = false }) {
                    Text("Cancelar")
                }
            }
        ) {
            DatePicker(state = datePickerState)
        }
    }

    // Diálogo sencillo para editar nombre y fecha de una actividad existente
    actividadEnEdicion?.let { actividad ->
        DialogoEditarActividad(
            actividad = actividad,
            formatoFecha = formatoFecha,
            onDismiss = { actividadEnEdicion = null },
            onGuardar = { nuevoNombre, nuevaFecha ->
                val index = actividades.indexOfFirst { it.id == actividad.id }
                if (index != -1) {
                    actividades[index] = actividades[index].copy(
                        nombre = nuevoNombre,
                        fecha = nuevaFecha
                    )
                }
                actividadEnEdicion = null
            }
        )
    }
}

@Composable
fun TarjetaResumenProgreso(total: Int, completadas: Int) {
    val porcentaje = if (total == 0) 0f else completadas.toFloat() / total.toFloat()
    val porcentajeEntero = (porcentaje * 100).toInt()

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, MaterialTheme.colorScheme.outlineVariant, RoundedCornerShape(16.dp)),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        shape = RoundedCornerShape(16.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier.size(56.dp)
            ) {
                CircularProgressIndicator(
                    progress = { porcentaje },
                    modifier = Modifier.size(56.dp),
                    strokeWidth = 6.dp
                )
                Text(
                    text = "$porcentajeEntero%",
                    style = MaterialTheme.typography.labelLarge,
                    fontWeight = FontWeight.Bold
                )
            }

            Spacer(modifier = Modifier.width(14.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "Progreso de hoy",
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.SemiBold
                )
                Text(
                    text = "$completadas de $total actividades completadas",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(modifier = Modifier.height(6.dp))
                LinearProgressIndicator(
                    progress = { porcentaje },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(6.dp)
                        .clip(RoundedCornerShape(3.dp))
                )
            }
        }
    }
}

@Composable
fun ActividadFila(
    actividad: Actividad,
    formatoFecha: DateTimeFormatter,
    onToggleCompletada: () -> Unit,
    onEditar: () -> Unit,
    onEliminar: () -> Unit
) {
    val colorPrioridad = when (actividad.prioridad) {
        Prioridad.ALTA -> Color(0xFFDC2626)
        Prioridad.MEDIA -> Color(0xFFD97706)
        Prioridad.BAJA -> Color(0xFF059669)
    }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, MaterialTheme.colorScheme.outlineVariant, RoundedCornerShape(14.dp)),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        shape = RoundedCornerShape(14.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Checkbox(
                checked = actividad.completada,
                onCheckedChange = { onToggleCompletada() }
            )

            Column(
                modifier = Modifier
                    .weight(1f)
                    .padding(horizontal = 6.dp)
            ) {
                Text(
                    text = actividad.nombre,
                    style = MaterialTheme.typography.bodyLarge,
                    fontWeight = FontWeight.Medium,
                    textDecoration = if (actividad.completada) {
                        TextDecoration.LineThrough
                    } else {
                        TextDecoration.None
                    },
                    color = if (actividad.completada) {
                        MaterialTheme.colorScheme.onSurfaceVariant
                    } else {
                        MaterialTheme.colorScheme.onSurface
                    }
                )

                Spacer(modifier = Modifier.height(4.dp))

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(
                        text = actividad.fecha.format(formatoFecha),
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = "·",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Box(
                        modifier = Modifier
                            .size(8.dp)
                            .clip(CircleShape)
                            .background(colorPrioridad)
                    )
                    Text(
                        text = "Prioridad \${actividad.prioridad.etiqueta}",
                        style = MaterialTheme.typography.labelMedium,
                        color = colorPrioridad,
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }

            IconButton(onClick = onEditar) {
                Icon(
                    imageVector = Icons.Default.Edit,
                    contentDescription = "Editar actividad"
                )
            }

            IconButton(onClick = onEliminar) {
                Icon(
                    imageVector = Icons.Default.Delete,
                    contentDescription = "Eliminar actividad",
                    tint = Color(0xFFDC2626)
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DialogoEditarActividad(
    actividad: Actividad,
    formatoFecha: DateTimeFormatter,
    onDismiss: () -> Unit,
    onGuardar: (String, LocalDate) -> Unit
) {
    var nombreEditado by remember { mutableStateOf(actividad.nombre) }
    var fechaEditada by remember { mutableStateOf(actividad.fecha) }
    var mostrarError by remember { mutableStateOf(false) }
    var mostrarPickerFecha by remember { mutableStateOf(false) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Editar actividad") },
        text = {
            Column {
                OutlinedTextField(
                    value = nombreEditado,
                    onValueChange = {
                        nombreEditado = it
                        if (it.isNotBlank()) mostrarError = false
                    },
                    label = { Text("Nombre de la actividad") },
                    isError = mostrarError,
                    supportingText = {
                        if (mostrarError) {
                            Text("El nombre no puede quedar vacío.")
                        }
                    },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(10.dp))

                OutlinedButton(
                    onClick = { mostrarPickerFecha = true },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(
                        imageVector = Icons.Default.CalendarToday,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Fecha: \${fechaEditada.format(formatoFecha)}")
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    val nombreLimpio = nombreEditado.trim()
                    if (nombreLimpio.isEmpty()) {
                        mostrarError = true
                    } else {
                        onGuardar(nombreLimpio, fechaEditada)
                    }
                }
            ) {
                Text("Guardar")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancelar")
            }
        }
    )

    if (mostrarPickerFecha) {
        val state = rememberDatePickerState(
            initialSelectedDateMillis = fechaEditada
                .atStartOfDay(ZoneOffset.UTC)
                .toInstant()
                .toEpochMilli()
        )
        DatePickerDialog(
            onDismissRequest = { mostrarPickerFecha = false },
            confirmButton = {
                TextButton(
                    onClick = {
                        val millis = state.selectedDateMillis
                        if (millis != null) {
                            fechaEditada = Instant.ofEpochMilli(millis)
                                .atZone(ZoneOffset.UTC)
                                .toLocalDate()
                        }
                        mostrarPickerFecha = false
                    }
                ) {
                    Text("Aceptar")
                }
            },
            dismissButton = {
                TextButton(onClick = { mostrarPickerFecha = false }) {
                    Text("Cancelar")
                }
            }
        ) {
            DatePicker(state = state)
        }
    }
}
`,
  },
  {
    id: 'model',
    fileName: 'Actividad.kt',
    packagePath: 'app/src/main/java/com/ejemplo/miagenda/model/Actividad.kt',
    summary:
      'Modelo de datos sencillo con id, nombre, fecha (LocalDate), prioridad (Baja, Media, Alta) y estado completado.',
    code: `package com.ejemplo.miagenda.model

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
`,
  },
  {
    id: 'main',
    fileName: 'MainActivity.kt',
    packagePath: 'app/src/main/java/com/ejemplo/miagenda/MainActivity.kt',
    summary:
      'Actividad principal de Android que carga el tema Material 3 y muestra la pantalla única MiAgendaScreen.',
    code: `package com.ejemplo.miagenda

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import com.ejemplo.miagenda.ui.MiAgendaScreen

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MaterialTheme {
                Surface(color = MaterialTheme.colorScheme.background) {
                    MiAgendaScreen()
                }
            }
        }
    }
}
`,
  },
  {
    id: 'gradle',
    fileName: 'build.gradle.kts',
    packagePath: 'app/build.gradle.kts',
    summary:
      'Configuración mínima del módulo Android con Jetpack Compose, Material 3 e íconos estándar.',
    code: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
}

android {
    namespace = "com.ejemplo.miagenda"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.ejemplo.miagenda"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"
    }

    buildFeatures {
        compose = true
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    implementation(platform("androidx.compose:compose-bom:2024.10.01"))
    implementation("androidx.activity:activity-compose:1.9.3")
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.compose.ui:ui-tooling-preview")
}
`,
  },
];
