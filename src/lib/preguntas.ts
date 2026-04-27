import { Dimension, RespuestaPareja, RespuestaIndividual } from "./types";

export const PREGUNTAS_PAREJA: { id: number; texto: string; dimension: Dimension }[] = [
  { id: 1, dimension: "AMISTAD", texto: "¿Disfruto genuinamente estar con mi pareja... y cómo siento que ella/él disfruta estar conmigo?" },
  { id: 2, dimension: "AMISTAD", texto: "¿Puedo ser yo mismo/a sin filtros en esta relación... y cuánto siento que mi pareja también puede serlo?" },
  { id: 3, dimension: "AMISTAD", texto: "¿Nuestras conversaciones van más allá de lo funcional y cotidiano... y cuánto siento que mi pareja también busca o cree eso?" },
  { id: 4, dimension: "AMISTAD", texto: "¿Me siento en confianza real con mi pareja... y cuánto siente que ella/él confía genuinamente en mí?" },
  { id: 5, dimension: "AMISTAD", texto: "¿Hay liviandad, humor y momentos de disfrute de mi parte... y cuánto percibo ese mismo disfrute en mi pareja cuando estamos juntos?" },
  { id: 6, dimension: "AMISTAD", texto: "Cuando algo importante me pasa, ¿mi pareja es de las primeras personas en las que pienso... y cuánto creo que ella/él siente lo mismo?" },
  { id: 7, dimension: "AMISTAD", texto: "¿Siento que aporto a que seamos un equipo real en lo cotidiano... y cuánto percibo ese mismo aporte en mi pareja?" },
  
  { id: 8, dimension: "DESEO", texto: "¿Siento deseo genuino por mi pareja... y cómo percibo que ella/él me desea a mí?" },
  { id: 9, dimension: "DESEO", texto: "¿Me siento atraído/a físicamente por mi pareja... y cuánto siento que esa atracción es recíproca?" },
  { id: 10, dimension: "DESEO", texto: "¿Tomo iniciativa en nuestra vida sexual... y cuánto percibo iniciativa genuina también en mi pareja?" },
  { id: 11, dimension: "DESEO", texto: "¿Estoy satisfecho/a con nuestra vida sexual... y cuánto siento que mi pareja también lo está?" },
  { id: 12, dimension: "DESEO", texto: "¿Puedo expresar lo que deseo o necesito sexualmente... y cuánto siento que mi pareja hace lo mismo conmigo?" },
  { id: 13, dimension: "DESEO", texto: "Cuando estamos íntimamente, ¿siento que me entrego y me conecto de verdad... y cuánto percibo esa misma conexión en mi pareja?" },

  { id: 14, dimension: "PROYECTO", texto: "¿Siento que quiero construir algo real con mi pareja... y cuánto percibo en ella/él esa misma intención?" },
  { id: 15, dimension: "PROYECTO", texto: "¿Me siento parte del proyecto de vida de mi pareja... y cuánto siento que ella/él se siente parte del mío?" },
  { id: 16, dimension: "PROYECTO", texto: "¿He puesto de mi parte para conversar y construir lo que queremos juntos... y cuánto percibo esa disposición también en mi pareja?" },
  { id: 17, dimension: "PROYECTO", texto: "¿Mis decisiones del día a día van en línea con lo que queremos como pareja... y cuánto percibo esa coherencia también en ella/él?" },
  { id: 18, dimension: "PROYECTO", texto: "¿Este proyecto de relación me hace sentido hoy... y cuánto siento que a mi pareja también se lo hace?" },

  { id: 19, dimension: "COMPROMISO", texto: "¿Me hago cargo de cuidar y sostener esta relación más allá del ánimo del momento... y cuánto percibo ese mismo cuidado en mi pareja?" },
  { id: 20, dimension: "COMPROMISO", texto: "¿Soy coherente entre lo que digo y lo que hago en esta relación... y cuánto percibo esa coherencia en mi pareja?" },
  { id: 21, dimension: "COMPROMISO", texto: "¿Estoy dispuesto/a a hacer cambios genuinos por el bienestar de la relación... y cuánto siento esa disposición también en ella/él?" },
  { id: 22, dimension: "COMPROMISO", texto: "Cuando aparecen problemas, ¿me hago cargo de mi parte sin evitar ni culpar... y cuánto percibo esa misma responsabilidad en mi pareja?" },
  { id: 23, dimension: "COMPROMISO", texto: "¿Elijo activamente a mi pareja incluso en los momentos difíciles... y cuánto siento que ella/él también me elige?" },
];

export const PREGUNTAS_INDIVIDUAL: { id: number; texto: string; dimension: Dimension }[] = [
  { id: 1, dimension: "AMISTAD", texto: "¿Disfruto genuinamente estar con mi pareja, o compartir tiempo juntos se ha vuelto más obligación que elección?" },
  { id: 2, dimension: "AMISTAD", texto: "¿Puedo ser completamente yo mismo/a con mi pareja, o hay partes mías que guardo o escondo cuando estoy con ella/él?" },
  { id: 3, dimension: "AMISTAD", texto: "¿Nuestras conversaciones van más allá de lo funcional y cotidiano, o siento que nos hemos quedado sin temas reales?" },
  { id: 4, dimension: "AMISTAD", texto: "¿Siento que existe una confianza genuina entre nosotros, o hay zonas donde me cuido o me contengo?" },
  { id: 5, dimension: "AMISTAD", texto: "¿Cuándo fue la última vez que sentí que mi pareja realmente me veía — no el rol que cumplo, sino quién soy?" },
  { id: 6, dimension: "AMISTAD", texto: "Si pienso en mi pareja como persona — más allá de la relación — ¿me sigue gustando quién es?" },

  { id: 7, dimension: "DESEO", texto: "¿Siento deseo genuino por mi pareja, o esa energía se ha ido apagando con el tiempo?" },
  { id: 8, dimension: "DESEO", texto: "¿Me siento elegido/a y deseado/a por mi pareja, o siento que soy más una presencia que una elección activa?" },
  { id: 9, dimension: "DESEO", texto: "¿Hay iniciativa real de ambos lados en nuestra vida íntima, o siento que la energía la pone más uno que el otro?" },
  { id: 10, dimension: "DESEO", texto: "¿Estoy satisfecho/a con nuestra vida sexual, o hay algo que siento pero no he podido decir?" },
  { id: 11, dimension: "DESEO", texto: "¿Hay algo que deseo o necesito en este ámbito que nunca he podido poner en palabras con mi pareja?" },
  { id: 12, dimension: "DESEO", texto: "Cuando pienso en intimidad con mi pareja, lo que siento es ganas o es más bien indiferencia — o incluso evitación?" },

  { id: 13, dimension: "PROYECTO", texto: "¿Siento que queremos construir cosas parecidas como pareja, o noto que vamos hacia lugares distintos?" },
  { id: 14, dimension: "PROYECTO", texto: "¿Me siento parte del mundo y los sueños de mi pareja, y siento que ella/él es parte de los míos?" },
  { id: 15, dimension: "PROYECTO", texto: "¿Hay algo que quiero para mi vida y siento que esta relación no me lo permite — o que tendría que sacrificar para seguir en ella?" },
  { id: 16, dimension: "PROYECTO", texto: "¿Nuestras decisiones del día a día reflejan que somos un equipo, o siento que cada uno va más por su lado?" },
  { id: 17, dimension: "PROYECTO", texto: "¿Este proyecto de relación me hace sentido hoy — o me doy cuenta de que le estoy buscando el sentido que ya no encuentro?" },

  { id: 18, dimension: "COMPROMISO", texto: "¿Me hago cargo de cuidar esta relación con acciones concretas, o noto que voy más en piloto automático?" },
  { id: 19, dimension: "COMPROMISO", texto: "¿Elijo a mi pareja activamente — incluso en los momentos difíciles — o siento que la elección se ha vuelto más costumbre que decisión?" },
  { id: 20, dimension: "COMPROMISO", texto: "¿Existe coherencia entre lo que me digo sobre esta relación y lo que realmente hago en ella?" },
  { id: 21, dimension: "COMPROMISO", texto: "Cuando aparecen problemas, ¿los enfrento y me hago cargo de mi parte, o tiendo a evitarlos, minimizarlos o culpar al otro?" },
  { id: 22, dimension: "COMPROMISO", texto: "Si hoy tuviese que elegir a esta persona de nuevo — sabiendo lo que sé — ¿la elegiría?" },
];

export const PREGUNTAS_CONVERSACION: Record<Dimension, string[]> = {
  AMISTAD: [
    "¿En qué momentos te sientes más cerca de mí... y en cuáles más lejos?",
    "¿Qué echas de menos de cómo éramos antes?",
    "¿Hay algo que ya no me cuentas y antes sí me contabas?",
    "¿Cuándo fue la última vez que reímos de verdad juntos?",
    "¿Sientes que te conozco de verdad... o que me quedé con una versión antigua de ti?",
    "¿Qué parte de ti siente que no puede mostrarse conmigo?"
  ],
  DESEO: [
    "¿Qué te hace sentir más deseado/a por mí?",
    "¿Qué no estamos diciendo en este ámbito?",
    "¿Qué necesitas de mí para volver a sentir esa chispa?",
    "¿Hay algo que deseas y nunca has podido decirme?",
    "¿En qué momento dejaste de sentirte elegido/a por mí?",
    "¿Qué te acerca a mí... y qué te aleja?"
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
    "¿Dónde sientes que estoy fallando en sostener esto?",
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
    frase2: "Buen momento para hacer explícito lo que hasta ahora han asumió. Decirlo en voz alta lo hace más real."
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
    frase1: "El compromiso muestra solidez. Ambos parecen estar elegido activamente esta relación.",
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