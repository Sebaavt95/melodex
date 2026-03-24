# Melody Harmonizer --- Documento de planificación

## CONTEXTO

La aplicación tiene como objetivo ayudar a músicos, estudiantes y
arregladores a **explorar posibles armonizaciones de una melodía** de
manera rápida y visual.

Muchas veces, al trabajar con una melodía, surge la pregunta:

- ¿Cómo podría armonizar esta línea?
- ¿Qué pasaría si agrego terceras o sextas?
- ¿Qué acordes podrían acompañar esta melodía?

La app busca resolver esto permitiendo que el usuario:

1.  Ingrese una melodía en una tonalidad determinada.
2.  Seleccione un tipo de armonización.
3.  Visualice las notas sugeridas para la armonización.
4.  Escuche el resultado para evaluar musicalmente las opciones.

El objetivo no es reemplazar el criterio musical del usuario, sino
**ofrecer sugerencias y herramientas de exploración armónica** que
faciliten el aprendizaje, la experimentación y la composición.

La aplicación está pensada como una **herramienta educativa y
creativa**, accesible desde el navegador.

---

# REQUERIMIENTOS

## 1. Entrada de información (melodía)

La aplicación debe permitir ingresar la melodía de dos formas.

### 1.1 Ingreso por texto

El usuario puede escribir una secuencia de notas separadas por espacios.

Ejemplo:

    C D E F G A G

Características:

- Solo notas musicales.
- Ordenadas en secuencia.
- Representan la melodía principal.
- No es necesario indicar duración rítmica en la primera versión.

El usuario también deberá seleccionar la **tonalidad** de la melodía.

Ejemplo:

- C mayor
- G mayor
- D menor
- etc.

---

### 1.2 Piano interactivo

La aplicación incluirá un **piano virtual** que permitirá ingresar notas
haciendo clic sobre las teclas.

Funcionamiento esperado:

- El usuario hace clic en una tecla.
- La nota se agrega a la secuencia de la melodía.
- Las notas ingresadas se muestran en orden.
- El usuario puede borrar la última nota o limpiar toda la secuencia.

Objetivo:

- Facilitar el uso a músicos que prefieren **interacción visual** en
  lugar de escribir notas.

---

# 2. Tipos de armonización

La aplicación deberá permitir seleccionar diferentes formas de armonizar
la melodía.

Se implementarán inicialmente **dos tipos principales de armonización**
para el MVP.

---

## 2.1 Armonización por intervalos paralelos

Consiste en generar una segunda voz moviéndose en intervalos constantes
respecto a la melodía.

Para el **MVP de la aplicación**, estos intervalos serán **siempre
diatónicos**, es decir, calculados dentro de la escala de la tonalidad
seleccionada. Esto garantiza que la armonización permanezca dentro del
contexto tonal y produzca resultados musicalmente coherentes.

Opciones disponibles:

- terceras arriba\
- terceras abajo\
- quintas\
- sextas arriba\
- sextas abajo

La armonía se mueve **paralelamente** a la melodía respetando siempre
las notas de la escala.

Ejemplo conceptual:

Tonalidad: C mayor

Melodía\
C D E F

Terceras diatónicas arriba\
E F G A

Nota de alcance del MVP:

La aplicación **no calculará intervalos cromáticos** en esta versión
inicial. En futuras versiones podría incorporarse un modo adicional de
**intervalos cromáticos** donde los intervalos se calculen por distancia
exacta en semitonos.

---

## 2.2 Sugerencia de acordes

La aplicación analiza la melodía y propone **acordes compatibles** que
podrían acompañarla.

El objetivo no es generar una segunda voz directa, sino sugerir
**posibles armonías armónicas**.

Ejemplo conceptual:

Melodía\
C E G

Posibles acordes:

- C
- Am
- F

Las sugerencias pueden mostrarse como una lista de acordes posibles para
cada nota o grupo de notas.

---

# 3. Visualización de resultados

Una vez generada la armonización, el usuario debe poder verla de dos
formas.

---

## 3.1 Visualización en tabla

Se mostrará la relación entre la melodía original y la armonización.

Ejemplo:

Posición Melodía Armonía

---

1 C E
2 D F
3 E G
4 F A

Beneficios:

- Simple
- Fácil de entender
- Muy útil para estudiantes

---

## 3.2 Piano Roll

También se mostrará una visualización estilo **piano roll**, similar a
la que usan los DAWs.

Características:

- Eje horizontal: tiempo / posición de la melodía
- Eje vertical: altura de la nota
- Las notas se representan como bloques

Se visualizarán dos capas:

- melodía original
- armonía generada

Beneficios:

- Permite ver la relación entre ambas líneas
- Ayuda a entender el movimiento melódico

---

# 4. Reproducción de audio

La aplicación debe permitir escuchar el resultado.

Se incluirán dos opciones de reproducción.

---

## 4.1 Reproducir solo la melodía

Permite escuchar la línea original ingresada por el usuario.

Objetivo:

- Verificar la melodía
- Confirmar que fue ingresada correctamente

---

## 4.2 Reproducir melodía con armonía

Permite escuchar simultáneamente:

- melodía original
- armonización generada

Esto permite al usuario evaluar:

- si la armonización funciona
- cómo suenan los intervalos
- si desea probar otro tipo de armonización

---

# ANALISIS FUNCIONAL

## Flujo general de uso

El funcionamiento de la aplicación se puede dividir en varias etapas.

---

### 1. Ingreso de melodía

El usuario puede:

- escribir la melodía en formato de texto\
  o
- ingresar notas mediante el piano interactivo.

La aplicación almacena la secuencia de notas como **melodía base**.

---

### 2. Selección de tonalidad

El usuario selecciona la tonalidad de la melodía.

La tonalidad define:

- qué escala se utiliza
- qué notas son diatónicas
- qué acordes pertenecen a la tonalidad

Esta información será utilizada en los modos de armonización que
dependen de la escala.

---

### 3. Selección del tipo de armonización

El usuario elige el método de armonización que desea aplicar.

Opciones disponibles:

- intervalos paralelos
- sugerencia de acordes

Cada método utiliza reglas distintas para generar el resultado.

---

### 4. Generación de la armonía

Una vez seleccionadas las opciones, la aplicación analiza la melodía y
genera el resultado.

Dependiendo del modo elegido:

**Intervalos paralelos (diatónicos)**

- se calcula una segunda nota para cada nota de la melodía\
- el intervalo elegido (3ra, 5ta, 6ta) se determina **dentro de la
  escala de la tonalidad seleccionada**\
- la segunda voz se mueve paralelamente respetando siempre las notas
  de la escala

**Sugerencia de acordes**

- se identifican acordes compatibles con las notas de la melodía

---

## Modelo interno de notas (Pitch Classes)

Para simplificar el análisis musical y facilitar la implementación, la
aplicación representará las notas utilizando el concepto de **pitch
classes**.

Las pitch classes representan las notas ignorando la octava, reduciendo
todas las alturas posibles a **12 valores numéricos**.

Nota Pitch class

---

C 0
C# / Db 1
D 2
D# / Eb 3
E 4
F 5
F# / Gb 6
G 7
G# / Ab 8
A 9
A# / Bb 10
B 11

Esto permite analizar melodías de manera abstracta sin depender de la
octava específica.

---

### Representación interna de la melodía

Si el usuario ingresa:

    C D E G

La aplicación lo transforma en:

    [0, 2, 4, 7]

Esta representación simplifica los cálculos musicales.

---

### Representación de escalas

Las escalas también se representan como listas de pitch classes.

Ejemplo: **C mayor**

Notas:

    C D E F G A B

Pitch classes:

    [0,2,4,5,7,9,11]

---

### Cálculo de intervalos diatónicos

Una vez conocida la posición de cada nota dentro de la escala, los
intervalos se calculan desplazándose dentro del array de la escala.

Ejemplo:

Escala C mayor

    C D E F G A B
    0 1 2 3 4 5 6

Melodía:

    C D E F

Terceras diatónicas:

    E F G A

Esto se obtiene desplazando **dos posiciones dentro de la escala**.

---

## Estructuras de datos internas para la implementación

Para facilitar la implementación del motor musical de la aplicación, se
utilizarán estructuras de datos simples que permitan generar escalas,
intervalos y acordes dinámicamente.

---

### Pitch classes base

Lista base de notas del sistema cromático:

    [C, C#, D, D#, E, F, F#, G, G#, A, A#, B]

Esto permite convertir fácilmente entre **nombre de nota** y **valor
numérico**.

---

### Patrones de escalas

Las escalas se definen mediante **patrones de intervalos**.

Escala mayor:

    [2,2,1,2,2,2,1]

Esto representa:

    tono
    tono
    semitono
    tono
    tono
    tono
    semitono

A partir de un root y este patrón se puede generar cualquier escala
mayor.

---

### Intervalos diatónicos

Los intervalos utilizados por la aplicación se representan como
desplazamientos dentro de la escala.

    third = 2
    fifth = 4
    sixth = 5

Esto significa que el intervalo se calcula desplazando posiciones dentro
del array de la escala.

---

### Generación de acordes de la tonalidad

Los acordes diatónicos de una escala mayor siguen el patrón:

    I   mayor
    ii  menor
    iii menor
    IV  mayor
    V   mayor
    vi  menor
    vii disminuido

Estos acordes pueden generarse automáticamente a partir de la escala.

---

### Representación de acordes

Los acordes pueden representarse como grados de la escala:

Triada básica:

    [0,2,4]

Esto corresponde a:

    1
    3
    5

De esta manera cualquier acorde puede construirse dinámicamente a partir
de la escala.

---

### Flujo interno simplificado

1.  El usuario ingresa una melodía\
2.  La melodía se convierte a pitch classes\
3.  Se genera la escala según la tonalidad elegida\
4.  Se identifica el grado de cada nota dentro de la escala\
5.  Se aplican desplazamientos diatónicos según el intervalo elegido\
6.  Se generan las notas armonizadas\
7.  Se convierten nuevamente a nombres de notas para mostrarlas al
    usuario

---

### 5. Visualización del resultado

El resultado se presenta en dos formatos:

1.  Tabla\
2.  Piano roll

Ambos muestran la relación entre la melodía y la armonía generada.

El usuario puede cambiar de visualización sin recalcular la armonía.

---

### 6. Reproducción sonora

El usuario puede escuchar:

- solo la melodía\
- melodía y armonía juntas

Esto permite validar musicalmente el resultado.

---

### 7. Iteración

El usuario puede repetir el proceso:

- cambiar tipo de armonización\
- modificar la melodía\
- probar otra tonalidad

La aplicación está pensada para **experimentación rápida**.

---

# Resultado esperado

La aplicación funcionará como una herramienta que permite:

- experimentar con armonizaciones
- entender intervalos
- explorar acompañamientos posibles
- escuchar resultados inmediatamente

Esto la convierte en una **herramienta útil tanto para educación musical
como para composición rápida**.
