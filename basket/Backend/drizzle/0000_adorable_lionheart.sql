-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "roles" (
	"id_rol" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre_rol" varchar(50) NOT NULL,
	CONSTRAINT "roles_nombre_rol_key" UNIQUE("nombre_rol")
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id_usuario" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" varchar(100) NOT NULL,
	"apellido" varchar(100) NOT NULL,
	"correo" varchar(150) NOT NULL,
	"contrasena" varchar(255) NOT NULL,
	"id_rol" uuid NOT NULL,
	"fecha_registro" timestamp DEFAULT CURRENT_TIMESTAMP,
	"activo" boolean DEFAULT true,
	CONSTRAINT "usuarios_correo_key" UNIQUE("correo")
);
--> statement-breakpoint
CREATE TABLE "tipo_canal" (
	"id_tipo" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"descripcion" varchar(50) NOT NULL,
	CONSTRAINT "tipo_canal_descripcion_key" UNIQUE("descripcion")
);
--> statement-breakpoint
CREATE TABLE "canales" (
	"id_canal" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre_canal" varchar(150) NOT NULL,
	"id_tipo" uuid NOT NULL,
	"url_sitio" varchar(255),
	"numero_canal" varchar(20),
	"horario" text,
	"activo" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "clasificacion_equipo" (
	"id_clasificacion" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"descripcion" varchar(50) NOT NULL,
	CONSTRAINT "clasificacion_equipo_descripcion_key" UNIQUE("descripcion")
);
--> statement-breakpoint
CREATE TABLE "torneos" (
	"id_torneo" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre_torneo" varchar(200) NOT NULL,
	"descripcion" text,
	"categoria" varchar(50),
	"fecha_inicio" date NOT NULL,
	"fecha_fin" date NOT NULL,
	"numero_equipos" integer,
	"estado" varchar(20) DEFAULT 'En inscripción',
	"id_clasificacion" uuid,
	"reglamento" text
);
--> statement-breakpoint
CREATE TABLE "equipos" (
	"id_equipo" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre_oficial" varchar(150) NOT NULL,
	"siglas" varchar(10) NOT NULL,
	"id_clasificacion" uuid,
	"direccion_cancha" varchar(255),
	"id_entrenador" uuid,
	"id_cancha" uuid,
	"fecha_creacion" timestamp DEFAULT CURRENT_TIMESTAMP,
	"activo" boolean DEFAULT true,
	CONSTRAINT "equipos_nombre_oficial_key" UNIQUE("nombre_oficial")
);
--> statement-breakpoint
CREATE TABLE "canchas" (
	"id_cancha" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre_cancha" varchar(150) NOT NULL,
	"capacidad" integer,
	"direccion" varchar(255) NOT NULL,
	"activo" boolean DEFAULT true,
	CONSTRAINT "canchas_direccion_key" UNIQUE("direccion")
);
--> statement-breakpoint
CREATE TABLE "inscripciones" (
	"id_inscripcion" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_equipo" uuid NOT NULL,
	"id_torneo" uuid NOT NULL,
	"fecha_inscripcion" timestamp DEFAULT CURRENT_TIMESTAMP,
	"estado_inscripcion" varchar(20) DEFAULT 'Pendiente',
	CONSTRAINT "unique_equipo_torneo" UNIQUE("id_equipo","id_torneo")
);
--> statement-breakpoint
CREATE TABLE "partidos" (
	"id_partido" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_torneo" uuid NOT NULL,
	"id_equipo_local" uuid NOT NULL,
	"id_equipo_visitante" uuid NOT NULL,
	"id_cancha" uuid NOT NULL,
	"id_arbitro_principal" uuid,
	"id_arbitro_asistente1" uuid,
	"id_arbitro_asistente2" uuid,
	"fecha" date NOT NULL,
	"hora" time NOT NULL,
	"ronda_torneo" varchar(50),
	"estado" varchar(20) DEFAULT 'Programado',
	"marcador_local" integer,
	"marcador_visitante" integer,
	CONSTRAINT "equipos_diferentes" CHECK (id_equipo_local <> id_equipo_visitante)
);
--> statement-breakpoint
CREATE TABLE "plantilla_equipo" (
	"id_plantilla" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_equipo" uuid NOT NULL,
	"id_jugador" uuid NOT NULL,
	"numero_camiseta" integer NOT NULL,
	"es_capitan" boolean DEFAULT false,
	"fecha_ingreso" date DEFAULT CURRENT_DATE,
	"fecha_salida" date,
	"activo" boolean DEFAULT true,
	"rol_equipo" varchar(20) DEFAULT 'Suplente',
	CONSTRAINT "unique_jugador_equipo" UNIQUE("id_equipo","id_jugador"),
	CONSTRAINT "plantilla_equipo_rol_equipo_check" CHECK ((rol_equipo)::text = ANY ((ARRAY['Titular'::character varying, 'Suplente'::character varying, 'No Convocado'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "jugadores" (
	"id_jugador" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" varchar(100) NOT NULL,
	"apellido" varchar(100) NOT NULL,
	"fecha_nacimiento" date,
	"posicion" varchar(50),
	"estatura" numeric(4, 2),
	"activo" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "favoritos" (
	"id_favorito" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_usuario" uuid NOT NULL,
	"id_equipo" uuid,
	"id_jugador" uuid,
	CONSTRAINT "check_fav_tipo" CHECK (((id_equipo IS NOT NULL) AND (id_jugador IS NULL)) OR ((id_equipo IS NULL) AND (id_jugador IS NOT NULL)))
);
--> statement-breakpoint
CREATE TABLE "alineaciones" (
	"id_alineacion" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_partido" uuid NOT NULL,
	"id_jugador" uuid NOT NULL,
	"id_equipo" uuid NOT NULL,
	"presente" boolean DEFAULT false,
	"minutos_jugados" integer,
	"puntos_anotados" integer DEFAULT 0,
	"faltas_cometidas" integer DEFAULT 0,
	"rol_partido" varchar(20) DEFAULT 'Suplente',
	CONSTRAINT "alineaciones_rol_partido_check" CHECK ((rol_partido)::text = ANY ((ARRAY['Titular'::character varying, 'Suplente'::character varying, 'No Convocado'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "estadisticas_partido" (
	"id_estadistica" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_partido" uuid NOT NULL,
	"id_jugador" uuid NOT NULL,
	"puntos_anotados" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "informes_partido" (
	"id_informe" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_partido" uuid NOT NULL,
	"id_arbitro" uuid NOT NULL,
	"contenido" text NOT NULL,
	"fecha_creacion" timestamp DEFAULT CURRENT_TIMESTAMP,
	"fecha_modificacion" timestamp,
	"enviado" boolean DEFAULT false,
	CONSTRAINT "informes_partido_id_partido_key" UNIQUE("id_partido")
);
--> statement-breakpoint
CREATE TABLE "sanciones" (
	"id_sancion" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_jugador" uuid NOT NULL,
	"id_torneo" uuid,
	"id_partido" uuid,
	"motivo" text,
	"fecha_inicio" date,
	"fecha_fin" date,
	"tipo_sancion" varchar(50),
	"activa" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "transmisiones" (
	"id_transmision" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_canal" uuid NOT NULL,
	"id_partido" uuid NOT NULL,
	"hora_transmision" time NOT NULL
);
--> statement-breakpoint
CREATE TABLE "incidentes" (
	"id_incidente" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_informe" uuid NOT NULL,
	"tipo_incidente" varchar(100) NOT NULL,
	"minuto_aprox" integer,
	"descripcion_breve" text
);
--> statement-breakpoint
CREATE TABLE "evaluaciones_arbitro" (
	"id_evaluacion" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_informe" uuid NOT NULL,
	"id_arbitro" uuid NOT NULL,
	"id_evaluador" uuid,
	"puntuacion" integer,
	"comentarios" text,
	"fecha_evaluacion" timestamp DEFAULT CURRENT_TIMESTAMP,
	"respuesta_arbitro" text,
	"fecha_respuesta" timestamp,
	CONSTRAINT "evaluaciones_arbitro_puntuacion_check" CHECK ((puntuacion >= 1) AND (puntuacion <= 10))
);
--> statement-breakpoint
CREATE TABLE "asistencia_partidos" (
	"id_partido" uuid NOT NULL,
	"id_jugador" uuid NOT NULL,
	"estado" varchar(20) DEFAULT 'Ausente',
	CONSTRAINT "asistencia_partidos_pkey" PRIMARY KEY("id_partido","id_jugador")
);
--> statement-breakpoint
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "public"."roles"("id_rol") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "canales" ADD CONSTRAINT "canales_id_tipo_fkey" FOREIGN KEY ("id_tipo") REFERENCES "public"."tipo_canal"("id_tipo") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "torneos" ADD CONSTRAINT "torneos_id_clasificacion_fkey" FOREIGN KEY ("id_clasificacion") REFERENCES "public"."clasificacion_equipo"("id_clasificacion") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipos" ADD CONSTRAINT "equipos_id_cancha_fkey" FOREIGN KEY ("id_cancha") REFERENCES "public"."canchas"("id_cancha") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipos" ADD CONSTRAINT "equipos_id_clasificacion_fkey" FOREIGN KEY ("id_clasificacion") REFERENCES "public"."clasificacion_equipo"("id_clasificacion") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipos" ADD CONSTRAINT "equipos_id_entrenador_fkey" FOREIGN KEY ("id_entrenador") REFERENCES "public"."usuarios"("id_usuario") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inscripciones" ADD CONSTRAINT "inscripciones_id_equipo_fkey" FOREIGN KEY ("id_equipo") REFERENCES "public"."equipos"("id_equipo") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inscripciones" ADD CONSTRAINT "inscripciones_id_torneo_fkey" FOREIGN KEY ("id_torneo") REFERENCES "public"."torneos"("id_torneo") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partidos" ADD CONSTRAINT "partidos_id_arbitro_asistente1_fkey" FOREIGN KEY ("id_arbitro_asistente1") REFERENCES "public"."usuarios"("id_usuario") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partidos" ADD CONSTRAINT "partidos_id_arbitro_asistente2_fkey" FOREIGN KEY ("id_arbitro_asistente2") REFERENCES "public"."usuarios"("id_usuario") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partidos" ADD CONSTRAINT "partidos_id_arbitro_principal_fkey" FOREIGN KEY ("id_arbitro_principal") REFERENCES "public"."usuarios"("id_usuario") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partidos" ADD CONSTRAINT "partidos_id_cancha_fkey" FOREIGN KEY ("id_cancha") REFERENCES "public"."canchas"("id_cancha") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partidos" ADD CONSTRAINT "partidos_id_equipo_local_fkey" FOREIGN KEY ("id_equipo_local") REFERENCES "public"."equipos"("id_equipo") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partidos" ADD CONSTRAINT "partidos_id_equipo_visitante_fkey" FOREIGN KEY ("id_equipo_visitante") REFERENCES "public"."equipos"("id_equipo") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partidos" ADD CONSTRAINT "partidos_id_torneo_fkey" FOREIGN KEY ("id_torneo") REFERENCES "public"."torneos"("id_torneo") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plantilla_equipo" ADD CONSTRAINT "plantilla_equipo_id_equipo_fkey" FOREIGN KEY ("id_equipo") REFERENCES "public"."equipos"("id_equipo") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plantilla_equipo" ADD CONSTRAINT "plantilla_equipo_id_jugador_fkey" FOREIGN KEY ("id_jugador") REFERENCES "public"."jugadores"("id_jugador") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_id_equipo_fkey" FOREIGN KEY ("id_equipo") REFERENCES "public"."equipos"("id_equipo") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_id_jugador_fkey" FOREIGN KEY ("id_jugador") REFERENCES "public"."jugadores"("id_jugador") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuarios"("id_usuario") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alineaciones" ADD CONSTRAINT "alineaciones_id_equipo_fkey" FOREIGN KEY ("id_equipo") REFERENCES "public"."equipos"("id_equipo") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alineaciones" ADD CONSTRAINT "alineaciones_id_jugador_fkey" FOREIGN KEY ("id_jugador") REFERENCES "public"."jugadores"("id_jugador") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alineaciones" ADD CONSTRAINT "alineaciones_id_partido_fkey" FOREIGN KEY ("id_partido") REFERENCES "public"."partidos"("id_partido") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "estadisticas_partido" ADD CONSTRAINT "estadisticas_partido_id_jugador_fkey" FOREIGN KEY ("id_jugador") REFERENCES "public"."jugadores"("id_jugador") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "estadisticas_partido" ADD CONSTRAINT "estadisticas_partido_id_partido_fkey" FOREIGN KEY ("id_partido") REFERENCES "public"."partidos"("id_partido") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "informes_partido" ADD CONSTRAINT "informes_partido_id_arbitro_fkey" FOREIGN KEY ("id_arbitro") REFERENCES "public"."usuarios"("id_usuario") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "informes_partido" ADD CONSTRAINT "informes_partido_id_partido_fkey" FOREIGN KEY ("id_partido") REFERENCES "public"."partidos"("id_partido") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sanciones" ADD CONSTRAINT "sanciones_id_jugador_fkey" FOREIGN KEY ("id_jugador") REFERENCES "public"."jugadores"("id_jugador") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sanciones" ADD CONSTRAINT "sanciones_id_partido_fkey" FOREIGN KEY ("id_partido") REFERENCES "public"."partidos"("id_partido") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sanciones" ADD CONSTRAINT "sanciones_id_torneo_fkey" FOREIGN KEY ("id_torneo") REFERENCES "public"."torneos"("id_torneo") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transmisiones" ADD CONSTRAINT "transmisiones_id_canal_fkey" FOREIGN KEY ("id_canal") REFERENCES "public"."canales"("id_canal") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transmisiones" ADD CONSTRAINT "transmisiones_id_partido_fkey" FOREIGN KEY ("id_partido") REFERENCES "public"."partidos"("id_partido") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incidentes" ADD CONSTRAINT "incidentes_id_informe_fkey" FOREIGN KEY ("id_informe") REFERENCES "public"."informes_partido"("id_informe") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluaciones_arbitro" ADD CONSTRAINT "evaluaciones_arbitro_id_arbitro_fkey" FOREIGN KEY ("id_arbitro") REFERENCES "public"."usuarios"("id_usuario") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluaciones_arbitro" ADD CONSTRAINT "evaluaciones_arbitro_id_evaluador_fkey" FOREIGN KEY ("id_evaluador") REFERENCES "public"."usuarios"("id_usuario") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluaciones_arbitro" ADD CONSTRAINT "evaluaciones_arbitro_id_informe_fkey" FOREIGN KEY ("id_informe") REFERENCES "public"."informes_partido"("id_informe") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asistencia_partidos" ADD CONSTRAINT "asistencia_partidos_id_jugador_fkey" FOREIGN KEY ("id_jugador") REFERENCES "public"."jugadores"("id_jugador") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asistencia_partidos" ADD CONSTRAINT "asistencia_partidos_id_partido_fkey" FOREIGN KEY ("id_partido") REFERENCES "public"."partidos"("id_partido") ON DELETE cascade ON UPDATE no action;
*/