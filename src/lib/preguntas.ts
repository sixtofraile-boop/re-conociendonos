import { Dimension, RespuestaPareja, RespuestaIndividual } from "./types";

export const PREGUNTAS_PAREJA: { id: number; yo: string; percepcion: string; dimension: Dimension }[] = [
  { id: 1,  dimension: "AMISTAD",    yo: "¿Disfruto genuinamente estar con mi pareja?",                                                            percepcion: "¿Percibo que mi pareja disfruta genuinamente estar conmigo?" },
  { id: 2,  dimension: "AMISTAD",    yo: "¿Puedo ser yo mismo/a sin filtros en esta relación?",                                                    percepcion: "¿Percibo que mi pareja también puede ser como es conmigo?" },
  { id: 3,  dimension: "AMISTAD",    yo: "¿Nuestras conversaciones van más allá de lo funcional?",                                                 percepcion: "¿Percibo que mi pareja también busca o valora conversaciones más reales?" },
  { id: 4,  dimension: "AMISTAD",    yo: "¿Me siento en confianza real con mi pareja?",                                                            percepcion: "¿Percibo que mi pareja confía genuinamente en mí?" },
  { id: 5,  dimension: "AMISTAD",    yo: "¿Aporto liviandad, humor y disfrute cuando estamos juntos?",                                             percepcion: "¿Percibo esa misma liviandad y disfrute en mi pareja?" },
  { id: 6,  dimension: "AMISTAD",    yo: "Cuando algo importante me pasa, ¿mi pareja es de las primeras personas en las que pienso?",             percepcion: "¿Percibo que mi pareja siente algo parecido conmigo?" },
  { id: 7,  dimension: "AMISTAD",    yo: "¿Siento que aporto a que seamos un equipo real en lo cotidiano?",                                       percepcion: "¿Percibo ese mismo aporte en mi pareja?" },

  { id: 8,  dimension: "DESEO",      yo: "¿Siento deseo genuino por mi pareja?",                                                                  percepcion: "¿Percibo deseo genuino de mi pareja hacia mí?" },
  { id: 9,  dimension: "DESEO",      yo: "¿Me siento atraído/a físicamente por mi pareja?",                                                       percepcion: "¿Percibo que esa atracción también está presente en mi pareja?" },
  { id: 10, dimension: "DESEO",      yo: "¿Tomo iniciativa en nuestra vida íntima?",                                                              percepcion: "¿Percibo iniciativa genuina también en mi pareja?" },
  { id: 11, dimension: "DESEO",      yo: "¿Estoy satisfecho/a con nuestra vida íntima?",                                                          percepcion: "¿Percibo que mi pareja también se siente satisfecha?" },
  { id: 12, dimension: "DESEO",      yo: "¿Puedo expresar lo que deseo o necesito en la intimidad?",                                              percepcion: "¿Percibo que mi pareja también puede expresarlo conmigo?" },
  { id: 13, dimension: "DESEO",      yo: "Cuando estamos íntimamente, ¿me entrego y me conecto de verdad?",                                       percepcion: "¿Percibo esa misma entrega y conexión en mi pareja?" },

  { id: 14, dimension: "PROYECTO",   yo: "¿Siento que quiero construir algo real con mi pareja?",                                                  percepcion: "¿Percibo en mi pareja esa misma intención?" },
  { id: 15, dimension: "PROYECTO",   yo: "¿Me siento parte del proyecto de vida de mi pareja?",                                                    percepcion: "¿Percibo que mi pareja se siente parte del mío?" },
  { id: 16, dimension: "PROYECTO",   yo: "¿He puesto de mi parte para conversar y construir lo que queremos juntos?",                              percepcion: "¿Percibo esa disposición también en mi pareja?" },
  { id: 17, dimension: "PROYECTO",   yo: "¿Mis decisiones cotidianas van en línea con lo que queremos como pareja?",                               percepcion: "¿Percibo esa coherencia también en mi pareja?" },
  { id: 18, dimension: "PROYECTO",   yo: "¿Este proyecto de relación me hace sentido hoy?",                                                        percepcion: "¿Percibo que también le hace sentido a mi pareja?" },

  { id: 19, dimension: "COMPROMISO", yo: "¿Me hago cargo de cuidar y sostener esta relación más allá del ánimo del momento?",                     percepcion: "¿Percibo ese mismo cuidado en mi pareja?" },
  { id: 20, dimension: "COMPROMISO", yo: "¿Soy coherente entre lo que digo y lo que hago en esta relación?",                                      percepcion: "¿Percibo esa coherencia en mi pareja?" },
  { id: 21, dimension: "COMPROMISO", yo: "¿Estoy dispuesto/a a hacer cambios genuinos por el bienestar de la relación?",                          percepcion: "¿Percibo esa disposición también en mi pareja?" },
  { id: 22, dimension: "COMPROMISO", yo: "Cuando aparecen problemas, ¿me hago cargo de mi parte sin evitar ni culpar?",                           percepcion: "¿Percibo esa misma responsabilidad en mi pareja?" },
  { id: 23, dimension: "COMPROMISO", yo: "¿Elijo activamente a mi pareja incluso en los momentos difíciles?",                                     percepcion: "¿Percibo que mi pareja también me elige activamente?" },
];

export const PREGUNTAS_INDIVIDUAL: { id: number; texto: string; dimension: Dimension }[] = [
  { id: 1, dimension: "AMISTAD", texto: "¿Disfruto genuinamente estar con mi pareja, o el tiempo juntos se ha vuelto más rutina que elección?" },
  { id: 2, dimension: "AMISTAD", texto: "¿Puedo ser yo mismo/a con mi pareja, o hay partes de mí que suelo guardar?" },
  { id: 3, dimension: "AMISTAD", texto: "¿Nuestras conversaciones van más allá de lo funcional, o siento que hemos dejado de hablar de lo que realmente importa?" },
  { id: 4, dimension: "AMISTAD", texto: "¿Siento confianza genuina en esta relación, o hay temas donde me cuido demasiado?" },
  { id: 5, dimension: "AMISTAD", texto: "¿Siento que mi pareja me ve de verdad —más allá del rol que cumplo— o me siento poco reconocido/a?" },
  { id: 6, dimension: "AMISTAD", texto: "Si miro a mi pareja como persona, más allá de la relación, ¿me sigue gustando quién es?" },

  { id: 7, dimension: "DESEO", texto: "¿Siento deseo genuino por mi pareja, o esa energía se ha ido apagando?" },
  { id: 8, dimension: "DESEO", texto: "¿Me siento elegido/a y deseado/a, o siento que mi presencia se da por sentada?" },
  { id: 9, dimension: "DESEO", texto: "¿Hay iniciativa y búsqueda de ambos en nuestra vida íntima, o siento que la energía la sostiene más uno que el otro?" },
  { id: 10, dimension: "DESEO", texto: "¿Estoy satisfecho/a con nuestra vida íntima, o hay algo importante que no he podido decir?" },
  { id: 11, dimension: "DESEO", texto: "¿Hay algo que deseo o necesito en la intimidad que aún no he podido poner en palabras?" },
  { id: 12, dimension: "DESEO", texto: "Cuando pienso en la intimidad con mi pareja, ¿qué aparece con más fuerza: ganas, distancia, indiferencia o evitación?" },

  { id: 13, dimension: "PROYECTO", texto: "¿Siento que queremos construir cosas parecidas, o noto que empezamos a imaginar caminos distintos?" },
  { id: 14, dimension: "PROYECTO", texto: "¿Me siento parte del mundo y los sueños de mi pareja, y siento que mi pareja tiene lugar en los míos?" },
  { id: 15, dimension: "PROYECTO", texto: "¿Hay algo importante para mi vida que no encuentra suficiente espacio en esta relación?" },
  { id: 16, dimension: "PROYECTO", texto: "¿Nuestras decisiones cotidianas reflejan que somos equipo, o siento que cada uno avanza más por su lado?" },
  { id: 17, dimension: "PROYECTO", texto: "¿Este proyecto de relación me hace sentido hoy, o siento que necesito volver a preguntarme para qué seguimos juntos?" },

  { id: 18, dimension: "COMPROMISO", texto: "¿Cuido esta relación con acciones concretas, o noto que voy más en piloto automático?" },
  { id: 19, dimension: "COMPROMISO", texto: "¿Elijo activamente a mi pareja, incluso en momentos difíciles, o siento que sigo más por costumbre que por decisión?" },
  { id: 20, dimension: "COMPROMISO", texto: "¿Hay coherencia entre lo que me digo sobre esta relación y lo que realmente hago?" },
  { id: 21, dimension: "COMPROMISO", texto: "Cuando aparecen problemas, ¿me hago cargo de mi parte o tiendo a evitar, minimizar o culpar?" },
  { id: 22, dimension: "COMPROMISO", texto: "Si hoy mirara esta relación con honestidad, ¿siento que volvería a elegir a mi pareja?" },
];

export const PREGUNTAS_CONVERSACION: Record<Dimension, string[]> = {
  AMISTAD: [
    "¿En qué momentos te sientes más cerca de mí... y en cuáles más lejos?",
    "¿Qué echas de menos de cómo éramos antes?",
    "¿Hay algo que ya no me cuentas y antes sí me contabas?",
    "¿Cuándo fue la última vez que reímos de verdad juntos?",
    "¿Sientes que te conozco de verdad o que me quedé con una versión antigua de ti?",
    "¿Hay alguna parte de ti que te cuesta mostrar conmigo y que te gustaría que yo pudiera recibir mejor?"
  ],
  DESEO: [
    "¿Qué te hace sentir más deseado/a por mí?",
    "¿Qué no estamos diciendo en este ámbito?",
    "¿Qué necesitas de mí para volver a sentir cercanía íntima?",
    "¿Hay algo que deseas y nunca has podido decirme?",
    "¿Hay momentos en que has dejado de sentirte elegido/a por mí? ¿Qué necesitarías que yo entienda?",
    "¿Qué te acerca a mí y qué te aleja?"
  ],
  PROYECTO: [
    "¿Estamos yendo hacia el mismo lugar o solo caminando juntos?",
    "¿Qué futuro ves que yo quizás no estoy viendo?",
    "¿Hay algo que quieres construir y sientes que esta relación no te lo permite?",
    "¿Qué conversación sobre el futuro llevamos tiempo evitando?",
    "¿Sientes que sumamos para ir hacia donde cada uno quiere ir?",
    "¿Qué significaría para ti que este proyecto funcionara de verdad?"
  ],
  COMPROMISO: [
    "¿Dónde sientes que necesitas más presencia o cuidado de mi parte?",
    "¿Qué necesitas ver en mí para sentir más compromiso?",
    "¿Hay algo que prometimos y dejamos de cumplir?",
    "¿En qué momento sientes que elijo otras cosas antes que la relación?",
    "¿Qué te haría sentir más seguro/a de que estoy aquí de verdad?",
    "¿Qué estás sosteniendo tú solo/a que deberíamos sostener juntos?"
  ]
};

export const PREGUNTAS_REFLEXION: Record<Dimension, string[]> = {
  AMISTAD: [
    "¿En qué momento siento que dejé de ser completamente yo con mi pareja?",
    "¿Hay algo de mi mundo que he ido guardando en esta relación?",
    "¿Qué extraño de cómo éramos o de cómo me sentía antes?",
    "¿Cuándo fue la última vez que disfruté genuinamente estar con mi pareja — sin agenda, sin tensión?",
    "Si mi mejor amigo/a me preguntara cómo estoy en esta relación, ¿qué le diría de verdad?"
  ],
  DESEO: [
    "¿Qué siento cuando pienso en intimidad con mi pareja — ganas, indiferencia, o algo que prefiero no nombrar?",
    "¿Hay algo que deseo o necesito en este ámbito que nunca he podido decir en voz alta?",
    "¿El enfriamiento que siento es de los dos, o es más mío — o más de mi pareja?",
    "¿Hay algo que evito o pospongo en este ámbito? ¿Por qué?",
    "¿Qué necesitaría cambiar para que algo se moviera aquí?"
  ],
  PROYECTO: [
    "¿Hay algo que quiero para mi vida que siento que esta relación no me permite?",
    "Cuando pienso en mi futuro, ¿mi pareja aparece naturalmente en ese mapa — o tengo que hacer un esfuerzo para incluirla?",
    "¿Hay una conversación sobre el futuro que llevo tiempo evitando? ¿De qué trata?",
    "¿Siento que esta relación me hace crecer — o siento que me contiene o me achica?",
    "Si pudiera diseñar mi vida en cinco años, ¿esta relación estaría en ella tal como está hoy?"
  ],
  COMPROMISO: [
    "¿Estoy en esta relación por elección activa o por inercia, miedo, o costumbre?",
    "¿Hay una decisión que sé que necesito tomar y que llevo tiempo postergando?",
    "¿Qué me dice la diferencia entre lo que me digo sobre esta relación y lo que realmente hago en ella?",
    "¿Qué perdería si me fuera? ¿Qué ganaría?",
    "Si tuviese que elegir a esta persona de nuevo hoy — sabiendo lo que sé — ¿lo haría? ¿Por qué sí o por qué no?"
  ]
};

export const FRASES_GATILLO_PAREJA: Record<`${Dimension}|${"ROJO" | "AMARILLO" | "VERDE"}`, { frase1: string; frase2: string }> = {
  "AMISTAD|VERDE": {
    frase1: "Su amistad como pareja muestra sintonía. Hay una base compartida que los sostiene.",
    frase2: "Buen momento para celebrar lo construido y preguntarse cómo seguir nutriéndolo."
  },
  "AMISTAD|AMARILLO": {
    frase1: "Existen diferencias en cómo están viviendo la amistad. Algo se está viviendo de manera distinta.",
    frase2: "Vale la pena detenerse: ¿qué está notando cada uno que el otro quizás no está viendo?"
  },
  "AMISTAD|ROJO": {
    frase1: "Hay una brecha importante en cómo experimentan la amistad. Uno puede estar sintiéndose más solo de lo que el otro percibe.",
    frase2: "Esta diferencia merece una conversación honesta. No para juzgar, sino para entender desde dónde mira cada uno."
  },
  "DESEO|VERDE": {
    frase1: "El deseo muestra reciprocidad. Hay energía compartida — sigan cultivándola.",
    frase2: "Pregúntense qué están haciendo bien y cómo seguir cuidando esa energía."
  },
  "DESEO|AMARILLO": {
    frase1: "Aparecen diferencias en cómo están viviendo el deseo. Algo se está apagando o no se está hablando.",
    frase2: "Hay conversaciones sobre el deseo que están pendientes. ¿Qué no se ha dicho todavía en este ámbito?"
  },
  "DESEO|ROJO": {
    frase1: "Existe una brecha significativa en cómo experimentan el deseo. Esta diferencia puede estar generando distancia sin que ninguno lo haya puesto en palabras.",
    frase2: "Este dominio merece una conversación honesta. No desde el reproche, sino desde la curiosidad genuina."
  },
  "PROYECTO|VERDE": {
    frase1: "Comparten una visión similar de hacia dónde van. Hay alineación en lo que quieren construir.",
    frase2: "Buen momento para hacer explícito lo que hasta ahora han asumido. Decirlo en voz alta lo hace más real."
  },
  "PROYECTO|AMARILLO": {
    frase1: "Hay diferencias en cómo están viviendo el proyecto. Puede que cada uno esté imaginando futuros sin compartirlos.",
    frase2: "¿Qué conversación sobre el futuro llevan tiempo evitando? Este puede ser el momento."
  },
  "PROYECTO|ROJO": {
    frase1: "Existe una brecha importante en cómo ven el proyecto compartido. Pueden estar caminando juntos pero hacia lugares distintos.",
    frase2: "Este dominio necesita una conversación profunda: ¿hacia dónde quiere ir cada uno y qué lugar ocupa el otro?"
  },
  "COMPROMISO|VERDE": {
    frase1: "El compromiso muestra solidez. Ambos parecen estar eligiendo activamente esta relación.",
    frase2: "Buen momento para reconocerse mutuamente lo que cada uno está sosteniendo."
  },
  "COMPROMISO|AMARILLO": {
    frase1: "Hay diferencias en cómo perciben el compromiso del otro. Lo que uno hace puede no estar siendo visto por el otro.",
    frase2: "¿Están hablando el mismo idioma en este ámbito? A veces el compromiso se muestra de formas que el otro no reconoce."
  },
  "COMPROMISO|ROJO": {
    frase1: "Existe una brecha importante en cómo están viviendo el compromiso. Uno puede estar sintiendo que sostiene más de lo que el otro percibe.",
    frase2: "Este dominio merece una conversación honesta sobre qué necesita cada uno para sentirse sostenido y elegido."
  }
};

export const FRASES_GATILLO_INDIVIDUAL: Record<`${Dimension}|${"ROJO" | "AMARILLO" | "VERDE"}`, { frase1: string; frase2: string }> = {
  "AMISTAD|VERDE": {
    frase1: "La amistad con tu pareja muestra una base presente. Hay complicidad y disfrute que vale la pena reconocer y cuidar activamente.",
    frase2: "Este no es el lugar donde duele. Pero sí vale preguntarse qué la sostiene — para no darlo por sentado."
  },
  "AMISTAD|AMARILLO": {
    frase1: "Algo en la amistad con tu pareja ha ido cambiando. Puede que la complicidad se haya vuelto más funcional que genuina, o que sientas que hay partes de ti que ya no muestras.",
    frase2: "Esto merece atención. No para alarmarse, sino para preguntarse qué se ha ido perdiendo y si quieres recuperarlo."
  },
  "AMISTAD|ROJO": {
    frase1: "La amistad muestra señales importantes de desgaste. Puede que sientas distancia, que las conversaciones se hayan vuelto superficiales, o que ya no te sientas completamente visto/a.",
    frase2: "Este es un lugar que duele y que necesita ser mirado con honestidad. No para juzgarte — sino para entender qué necesitas."
  },
  "DESEO|VERDE": {
    frase1: "El deseo sigue presente en tu relación. Hay atracción y energía que se sostienen — eso no es poco.",
    frase2: "Pregúntate qué lo alimenta y qué podrías hacer para seguir cuidándolo."
  },
  "DESEO|AMARILLO": {
    frase1: "El deseo muestra señales de enfriamiento. Puede que la atracción esté más apagada, o que algo no dicho esté ocupando espacio en la intimidad.",
    frase2: "Esto es común y no es definitivo — pero sí es una señal de que algo necesita conversación o atención."
  },
  "DESEO|ROJO": {
    frase1: "El deseo está en un momento crítico. Lo que sientes — o lo que ya no sientes — puede ser de las cosas más difíciles de nombrar. Y sin embargo, es de las más importantes.",
    frase2: "Este espacio merece honestidad contigo mismo/a antes que con nadie más. ¿Qué es lo que realmente sientes aquí?"
  },
  "PROYECTO|VERDE": {
    frase1: "Sientes que hay una dirección compartida. El proyecto de esta relación te hace sentido y percibes que van hacia el mismo lugar.",
    frase2: "Vale la pena hacer explícito lo que hasta ahora has asumido — decirlo en voz alta lo vuelve más real."
  },
  "PROYECTO|AMARILLO": {
    frase1: "El proyecto común muestra diferencias o pérdida de sentido. Puede que sientas que van hacia lugares distintos, o que lo que antes parecía claro ahora genera más dudas.",
    frase2: "¿Hay conversaciones sobre el futuro que llevan tiempo pendientes? Este puede ser el momento de empezar a tenerlas — aunque sea contigo mismo/a primero."
  },
  "PROYECTO|ROJO": {
    frase1: "El proyecto de esta relación está en una zona de riesgo. Puede que sientas que caminas solo/a, que tus sueños no caben en esta relación, o que el sentido compartido se ha ido perdiendo.",
    frase2: "Esto no significa que esté todo perdido — pero sí que hay algo que necesita ser mirado con valentía y sin postergación."
  },
  "COMPROMISO|VERDE": {
    frase1: "El compromiso muestra solidez. Sientes que eliges esta relación activamente y que hay coherencia entre lo que dices y lo que haces.",
    frase2: "Reconoce eso — el compromiso consciente es lo que sostiene todo lo demás cuando las otras dimensiones fluctúan."
  },
  "COMPROMISO|AMARILLO": {
    frase1: "El compromiso muestra señales de debilitamiento. Puede que sientas que vas más en automático que por elección, o que hay una distancia entre lo que te dices y lo que realmente haces.",
    frase2: "¿Estás eligiendo esta relación o simplemente continuando en ella? Es una pregunta que vale la pena hacerse con honestidad."
  },
  "COMPROMISO|ROJO": {
    frase1: "El compromiso está en una zona crítica. Lo que sientes aquí puede ser de las cosas más difíciles de admitir — porque implica responsabilidad propia y decisiones que quizás has estado postergando.",
    frase2: "No hay respuesta correcta. Pero hay una respuesta honesta — y solo tú la tienes."
  }
};

export const COLOR_DIMENSION: Record<Dimension, string> = {
  AMISTAD: "#5B8DD9",
  DESEO: "#C0504D",
  PROYECTO: "#6B9B3E",
  COMPROMISO: "#8064A2"
};

export const COLOR_ESTADO: Record<"ROJO" | "AMARILLO" | "VERDE", string> = {
  ROJO: "#E74C3C",
  AMARILLO: "#F39C12",
  VERDE: "#27AE60"
};

export const getPreguntaPareja = (id: number) => PREGUNTAS_PAREJA.find(p => p.id === id);
export const getPreguntaIndividual = (id: number) => PREGUNTAS_INDIVIDUAL.find(p => p.id === id);