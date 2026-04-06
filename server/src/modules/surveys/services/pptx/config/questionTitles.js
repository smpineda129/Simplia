/**
 * Mapeo de claves de preguntas a sus títulos completos
 * Extraído del surveyConfig.js del frontend
 */

export const QUESTION_TITLES = {
  // === ASPECTOS ADMINISTRATIVOS (1-4) ===
  // Instancias asesoras
  '1_1_1': '1.1.1 ¿La Entidad ha conformado el Comité Interno de Archivo?',
  '1_1_2': '1.1.2 ¿Lo integran los coordinadores de áreas?',
  '1_1_3': '1.1.3 ¿Las Funciones del Comité Interno de Archivos son las enunciadas en el artículo 2.8.2.16 del Decreto 1080 de 2015?',
  '1_1_4': '1.1.4 ¿La Entidad ha formulado una política de gestión Documental?',

  // Estructura organizacional
  '2_1_1': '2.1.1 ¿Tiene la Entidad el Organigrama por dependencias actualizado?',
  '2_1_2': '2.1.2 ¿Tiene la Entidad un manual de funciones actualizado?',

  // Acuerdo 001 de 2024, art. 1.3.2
  '2_2_1': '2.2.1 ¿En el Manual de Funciones se ha regulado el recibo y la entrega de los documentos de archivo?',

  // Procesos y Procedimientos
  '2_3_1': '2.3.1 ¿La Entidad cuenta con el Mapa de Procesos actualizado?',
  '2_3_2': '2.3.2 ¿Ha desarrollado la Entidad un Normograma de acuerdo a su contexto legal?',
  '2_3_3': '2.3.3 ¿La entidad ha sufrido reestructuraciones?',
  '2_3_4': '2.3.4 ¿La entidad ha tenido cambios en la estructura orgánico-funcional?',
  '2_3_5': '2.3.5 Indique el Acto Administrativo de creación de la Entidad.',
  '2_3_6': '2.3.6 Indique el número de dependencias de la Entidad.',
  '2_3_7': '2.3.7 ¿Se ha designado a una dependencia específica la función archivística?',

  // Acuerdo 001 de 2024, art. 4.4.2
  '2_4_1': '2.4.1 ¿La Entidad ha conformado el Archivo Central Institucional?',
  '2_4_2': '2.4.2 ¿La Entidad ha creado el Archivo Histórico?',

  // Derechos Humanos
  '2_5_1': '2.5.1 ¿Tiene la Entidad funciones relacionadas con la garantía y protección de los Derechos Humanos y el DIH?',

  // Financiación
  '3_1_1': '3.1.1 ¿Se tiene un presupuesto designado a las funciones de archivo?',
  '3_1_2': '3.1.2 ¿Se tiene asignado un presupuesto para gastos de funcionamiento del archivo?',
  '3_1_3': '3.1.3 ¿Se ha asignado un presupuesto para gastos de inversión para el archivo?',

  // Formación y Capacitación
  '4_1_1': '4.1.1 ¿Los funcionarios encargados de los archivos han sido capacitados?',
  '4_2_1': '4.2.1 ¿Los funcionarios han sido capacitados en manejo y organización de los archivos?',
  '4_3_1': '4.3.1 ¿Los funcionarios han sido capacitados y entrenados para la atención de emergencias?',
  '4_4_1': '4.4.1 ¿La Unidad de Correspondencia cuenta con el personal suficiente y capacitado?',

  // === ASPECTOS DE FUNCIÓN ARCHIVÍSTICA (5-7) ===
  // Instrumentos archivísticos
  '5_1_1': '5.1.1 ¿La Entidad ha elaborado el Cuadro de Clasificación Documental?',
  '5_2_1': '5.2.1 ¿La Entidad ha elaborado las Tablas de Retención Documental?',
  '5_2_2': '5.2.2 ¿Las TRD fueron aprobadas por la instancia competente?',
  '5_2_3': '5.2.3 ¿Las TRD fueron implementadas por la instancia competente?',
  '5_2_4': '5.2.4 ¿Han sido actualizadas las Tablas de Retención Documental?',
  '5_2_5': '5.2.5 ¿La Entidad ha elaborado las Tablas de Valoración Documental?',
  '5_2_6': '5.2.6 ¿Las TVD fueron aprobadas por la instancia competente?',
  '5_2_7': '5.2.7 ¿Las TVD fueron implementadas por la instancia competente?',
  '5_3_1': '5.3.1 ¿La Entidad ha elaborado el Programa de Gestión Documental?',
  '5_3_2': '5.3.2 ¿El PGD fue aprobado por la instancia competente?',
  '5_3_3': '5.3.3 ¿Se ha realizado la implementación del PGD?',
  '5_3_4': '5.3.4 ¿Se ha realizado el seguimiento al PGD?',
  '5_3_5': '5.3.5 ¿Se ha publicado el PGD en la página intranet de la Entidad?',
  '5_3_6': '5.3.6 ¿Se ha implementado la elaboración de los inventarios documentales en los archivos de gestión?',
  '5_3_7': '5.3.7 ¿Ha desarrollado la Entidad los mapas de procesos, flujos documentales y la descripción de funciones?',

  // Organización y descripción
  '6_1_1': '6.1.1 ¿Se están conformando los expedientes de acuerdo a los Cuadros de Clasificación?',
  '6_1_2': '6.1.2 ¿Se realiza la foliación de los expedientes en su etapa de gestión?',
  '6_1_3': '6.1.3 ¿Los expedientes son identificados de acuerdo al sistema de descripción adoptado?',
  '6_1_4': '6.1.4 ¿Se realiza y mantiene actualizado el inventario de los expedientes?',
  '6_1_5': '6.1.5 ¿La Entidad realiza o ha realizado procesos de digitalización?',
  '6_1_6': '6.1.6 ¿Se han realizado las transferencias primarias?',
  '6_1_7': '6.1.7 ¿Tiene la entidad documentos sin ningún criterio de organización archivística (Fondos Acumulados)?',
  '6_1_8': '6.1.8 ¿En los archivos de gestión se utilizan unidades como AZ o carpetas argolladas?',
  '6_2_1': '6.2.1 ¿Las carpetas reflejan las series y subseries documentales correspondientes?',
  '6_2_2': '6.2.2 ¿Se realiza préstamo de documentos para trámites internos?',
  '6_2_3': '6.2.3 ¿Las dependencias realizan registro de los préstamos y solicitan su devolución?',
  '6_2_4': '6.2.4 ¿Las cajas usadas para la transferencia primaria se encuentran identificadas?',
  '6_3_1': '6.3.1 ¿Se ha implementado la Hoja de Control de documentos al interior del expediente?',
  '6_3_2': '6.3.2 ¿La Entidad ha elaborado instrumentos de descripción?',
  '6_4_1': '6.4.1 ¿La Entidad ha adoptado el Formato Único de Inventario Documental?',
  '6_5_1': '6.5.1 ¿El material gráfico es extraído y se deja en su lugar un testigo?',
  '6_5_2': '6.5.2 ¿El material gráfico es almacenado en la sección del archivo dispuesta para conservar distintos formatos?',
  '6_6_1': '6.6.1 ¿Se ha establecido un procedimiento para la Eliminación de documentos?',
  '6_6_2': '6.6.2 ¿El procedimiento para eliminación está acorde con el Acuerdo 04 de 2013?',
  '6_7_1': '6.7.1 ¿Se han perdido parcial o totalmente uno o más expedientes?',
  '6_8_1': '6.8.1 ¿Las Historias Laborales son organizadas de acuerdo al Acuerdo 001 de 2024?',

  // Comunicaciones Oficiales
  '7_1_1': '7.1.1 ¿La Entidad ha creado o conformado la Unidad de Correspondencia?',
  '7_1_2': '7.1.2 ¿La Entidad ha adoptado una política respecto las firmas responsables?',
  '7_1_3': '7.1.3 ¿La entidad cuenta con el procedimiento de radicación de documentos?',
  '7_1_4': '7.1.4 ¿La entidad cuenta con el procedimiento para la numeración de actos administrativos?',
  '7_1_5': '7.1.5 ¿Se han desarrollado planillas, formatos o controles para certificar la recepción de documentos?',
  '7_1_6': '7.1.6 ¿Se han dispuesto servicios de alerta para el seguimiento de tiempos de respuesta?',
  '7_1_7': '7.1.7 ¿La entidad ha publicado el horario de atención al público de la unidad de correspondencia?',

  // === ASPECTOS DE PRESERVACIÓN (8) ===
  // Condiciones de edificios y locales
  '8_1_1': '8.1.1 ¿Cuenta la entidad con los tres depósitos para almacenamiento?',
  '8_1_2': '8.1.2 ¿El terreno se presenta sin riesgos de Humedad subterránea o problemas de inundación?',
  '8_1_3': '8.1.3 ¿El terreno se encuentra lejos de industrias contaminantes o riesgos bélicos?',
  '8_1_4': '8.1.4 ¿El espacio ofrece suficiente espacio para albergar la documentación acumulada?',
  '8_1_5': '8.1.5 ¿Los pisos, muros, techos y puertas están construidos con materiales resistentes?',
  '8_1_6': '8.1.6 ¿Las pinturas empleadas presentan propiedades ignífugas?',
  '8_1_7': '8.1.7 ¿La resistencia de las placas es igual o mayor a 1200 Kg/m2?',
  '8_1_8': '8.1.8 ¿El depósito fue diseñado teniendo en cuenta la manipulación, transporte y seguridad?',
  '8_1_9': '8.1.9 ¿Fue adecuado el depósito climáticamente?',
  '8_1_10': '8.1.10 ¿Las áreas destinadas a custodia cuentan con elementos de control y aislamiento?',
  '8_1_11': '8.1.11 ¿Las zonas técnicas o de trabajo archivístico se encuentran fuera del área de almacenamiento?',
  '8_1_12': '8.1.12 ¿La estantería está diseñada para almacenar las unidades de conservación?',
  '8_1_13': '8.1.13 ¿La estantería está elaborada en láminas metálicas con tratamiento anticorrosivo?',
  '8_1_14': '8.1.14 ¿Las bandejas soportan al menos 100 Kg?',
  '8_1_15': '8.1.15 ¿Se encuentran los parales de la estantería fijados al piso?',
  '8_1_16': '8.1.16 ¿La balda inferior se encuentra al menos a 10 cm del piso?',
  '8_1_17': '8.1.17 ¿Los acabados del mobiliario son redondeados?',
  '8_1_18': '8.1.18 ¿Se utiliza el cerramiento superior para almacenar documentos u otro material?',
  '8_1_19': '8.1.19 ¿Se encuentra la estantería recostada sobre los muros?',
  '8_1_20': '8.1.20 ¿Tiene la estantería un sistema de identificación visual?',
  '8_1_21': '8.1.21 ¿Presentan oxidación los elementos de la estantería?',
  '8_1_22': '8.1.22 ¿Las bandejas o parales de la estantería se encuentran deformados?',
  '8_1_23': '8.1.23 ¿La Entidad usa planotecas?',
  '8_1_24': '8.1.24 ¿Se encuentran las planotecas en buen estado?',
  '8_1_25': '8.1.25 ¿Se realiza mantenimiento periódico a los sistemas de rodaje de las planotecas?',

  // Unidades de Conservación
  '8_2_1': '8.2.1 ¿Las unidades de conservación están elaboradas en cartón neutro?',
  '8_2_2': '8.2.2 ¿Las unidades de conservación presentan un recubrimiento interno?',
  '8_2_3': '8.2.3 ¿Las Unidades de conservación presentan orificios?',
  '8_2_4': '8.2.4 ¿Las carpetas ofrecen protección a los documentos?',
  '8_2_5': '8.2.5 ¿Es necesario perforar los documentos?',
  '8_2_6': '8.2.6 ¿Se desgastan o se deforman fácilmente las unidades de conservación?',
  '8_2_7': '8.2.7 ¿Los diseños y tamaños son acordes al tipo de documentación?',

  // Condiciones ambientales
  '8_3_1': '8.3.1 ¿Se han realizado mediciones de condiciones ambientales en los depósitos?',
  '8_3_2': '8.3.2 ¿Se han instalado equipos de modificación de condiciones ambientales?',
  '8_3_3': '8.3.3 ¿Las ventanas, puertas o celosías permiten el intercambio de aire?',
  '8_3_4': '8.3.4 ¿Los vanos están acondicionados con filtros contra partículas o contaminantes?',
  '8_3_5': '8.3.5 ¿Se utilizan luminarias fluorescentes de baja intensidad?',
  '8_3_6': '8.3.6 ¿Tiene ventanas que permiten la entrada de luz solar al depósito?',

  // Mantenimiento
  '8_4_1': '8.4.1 ¿Se realiza la limpieza de las instalaciones?',
  '8_4_2': '8.4.2 ¿Se realiza la limpieza de la estantería?',
  '8_4_3': '8.4.3 ¿Se realiza la limpieza de las unidades de conservación?',

  // Seguridad y emergencias
  '8_5_1': '8.5.1 ¿Ha dispuesto la Entidad extintores en el área de archivo?',
  '8_5_2': '8.5.2 ¿Los extintores son de agentes limpios?',
  '8_5_3': '8.5.3 ¿Los extintores son recargados anualmente?',
  '8_5_4': '8.5.4 ¿Se han instalado sistemas de alarma contra intrusiones?',
  '8_5_5': '8.5.5 ¿Se han instalado sistemas de alarma para detección de incendios?',
  '8_5_6': '8.5.6 ¿Se han instalado sistemas de alarma para detección de inundaciones?',
  '8_5_7': '8.5.7 ¿Se ha proveído señalización para equipos de desastres y rutas de evacuación?',
  '8_5_8': '8.5.8 ¿Se ha elaborado un Plan de prevención de desastres y situaciones de riesgo?',
  '8_5_9': '8.5.9 ¿Se ha realizado el levantamiento y valoración del panorama de riesgo?'
};

/**
 * Obtener el título de una pregunta por su clave
 * @param {string} key - Clave de la pregunta (ej: '1_1_1')
 * @returns {string} Título de la pregunta o la clave formateada si no se encuentra
 */
export function getQuestionTitle(key) {
  return QUESTION_TITLES[key] || key.replace(/_/g, '.');
}
