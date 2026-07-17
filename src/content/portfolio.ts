export const languageCodes = ["en", "es", "pt"] as const;
export const themeKeys = ["midnight", "graphite", "sunrise"] as const;

export type LanguageCode = (typeof languageCodes)[number];
export type ThemeKey = (typeof themeKeys)[number];
export type LocalizedText = Record<LanguageCode, string>;
export type LocalizedList = Record<LanguageCode, readonly string[]>;

export const portfolioContent = {
  profile: {
    name: "Patricio Montes Güemez",
    title: "Software Developer",
    email: "montesgpatricio@gmail.com",
    whatsapp: "https://wa.me/5491140518040",
    linkedin: "https://www.linkedin.com/in/patricio-montes-88212448/"
  },
  languages: [
    {
      code: "en",
      shortLabel: "EN",
      label: { en: "English", es: "Inglés", pt: "Inglês" }
    },
    {
      code: "es",
      shortLabel: "ES",
      label: { en: "Spanish", es: "Español", pt: "Espanhol" }
    },
    {
      code: "pt",
      shortLabel: "PT",
      label: { en: "Portuguese", es: "Portugués", pt: "Português" }
    }
  ],
  themes: [
    {
      key: "midnight",
      label: { en: "Midnight", es: "Medianoche", pt: "Meia-noite" }
    },
    {
      key: "graphite",
      label: { en: "Graphite", es: "Grafito", pt: "Grafite" }
    },
    {
      key: "sunrise",
      label: { en: "Sunrise", es: "Amanecer", pt: "Amanhecer" }
    }
  ],
  locales: {
    en: {
      skipToContent: "Skip to content",
      nav: {
        about: "Profile",
        experience: "Experience",
        skills: "Skills",
        projects: "Impact",
        education: "Training",
        contact: "Contact"
      },
      controls: {
        languageLabel: "Choose language",
        themeLabel: "Choose visual theme"
      },
      exports: {
        modernPdfLabel: "Download Modern PDF CV",
        atsPdfLabel: "Download ATS PDF CV",
        pdfHint: "Both files are generated with PDFKit and served as static portfolio assets."
      },
      hero: {
        eyebrow: "Software Developer",
        title: "Backend, cloud, and product delivery with a practical engineering mindset.",
        subtitle:
          "I build APIs, integrations, administrative tools, and delivery workflows across .NET, Java, TypeScript, cloud platforms, and AI-assisted engineering practices.",
        primaryCta: "Contact me",
        secondaryCta: "View experience",
        availability:
          "Available for software development, architecture support, and integration work.",
        focusAreas: ["REST APIs", "Cloud integrations", "Engineering tooling", "Code review"]
      },
      stats: [
        {
          value: "10+",
          label: "years across software delivery",
          detail:
            "From technical support and BPM integrations to senior development and architecture decisions."
        },
        {
          value: "3",
          label: "cloud ecosystems in verified work",
          detail:
            "Azure Platform, Google Cloud Platform, and Google App Engine-backed architecture."
        },
        {
          value: "ES / EN / PT",
          label: "portfolio languages",
          detail:
            "Content is available in Spanish, English, and Portuguese without server-only features."
        }
      ],
      sections: {
        about: {
          eyebrow: "Profile",
          title:
            "A delivery-focused developer who connects business process, backend architecture, and team execution.",
          intro:
            "Patricio Montes Güemez is a Software Developer with verified experience in .NET, Java, TypeScript, Python, Node, databases, cloud platforms, and integrations.",
          details: [
            "Recent work includes RESTful APIs for real-time fleet control, an AI multi-agent ecosystem with local memory and TDD plus SDD harnesses, microservice boilerplates, cloud deployments, API Gateway architecture, and administrative support tooling.",
            "This public portfolio intentionally uses only verified professional facts and omits sensitive personal data that is not appropriate for a static public site."
          ]
        },
        experience: {
          eyebrow: "Experience",
          title: "Verified professional timeline",
          intro:
            "The roles below are based on supplied CV facts and are presented without inventing private client claims or unverified metrics."
        },
        skills: {
          eyebrow: "Skills",
          title: "Technology map",
          intro: "Grouped from the verified CV technology categories."
        },
        projects: {
          eyebrow: "Projects and impact",
          title: "Selected verified work",
          intro: "Examples below use only project facts supplied from the CV.",
          linkLabel: "Open verified link"
        },
        education: {
          eyebrow: "Education and training",
          title: "Formal education, languages, and courses",
          intro:
            "Education and training are phrased conservatively where the CV lists status as ongoing."
        },
        contact: {
          eyebrow: "Contact",
          title: "Let’s talk about backend systems, integrations, and delivery workflows.",
          intro:
            "Choose the channel that fits the conversation: WhatsApp for direct coordination, email for detailed context, or LinkedIn for professional networking.",
          whatsappLabel: "Message on WhatsApp",
          emailLabel: "Email Patricio",
          linkedinLabel: "Open LinkedIn profile",
          whatsappDescription: "Best for quick coordination.",
          emailDescription: "Best for project context and attachments.",
          linkedinDescription: "Best for professional networking.",
          copyEmailLabel: "Email"
        }
      }
    },
    es: {
      skipToContent: "Saltar al contenido",
      nav: {
        about: "Perfil",
        experience: "Experiencia",
        skills: "Habilidades",
        projects: "Impacto",
        education: "Formación",
        contact: "Contacto"
      },
      controls: {
        languageLabel: "Elegir idioma",
        themeLabel: "Elegir tema visual"
      },
      exports: {
        modernPdfLabel: "Descargar CV PDF moderno",
        atsPdfLabel: "Descargar CV PDF ATS",
        pdfHint: "Ambos archivos se generan con PDFKit y se sirven como assets estáticos del portfolio."
      },
      hero: {
        eyebrow: "Desarrollador de Software",
        title: "Backend, cloud y entrega de producto con criterio práctico de ingeniería.",
        subtitle:
          "Construyo APIs, integraciones, herramientas administrativas y flujos de entrega con .NET, Java, TypeScript, plataformas cloud y prácticas de ingeniería asistidas por IA.",
        primaryCta: "Contactarme",
        secondaryCta: "Ver experiencia",
        availability:
          "Disponible para desarrollo de software, soporte de arquitectura e integraciones.",
        focusAreas: ["APIs REST", "Integraciones cloud", "Herramientas de ingeniería", "Code review"]
      },
      stats: [
        {
          value: "10+",
          label: "años en entrega de software",
          detail:
            "Desde soporte técnico e integraciones BPM hasta desarrollo senior y decisiones de arquitectura."
        },
        {
          value: "3",
          label: "ecosistemas cloud en trabajos verificados",
          detail:
            "Azure Platform, Google Cloud Platform y arquitectura sobre Google App Engine."
        },
        {
          value: "ES / EN / PT",
          label: "idiomas del portfolio",
          detail:
            "El contenido está disponible en español, inglés y portugués sin depender de funciones de servidor."
        }
      ],
      sections: {
        about: {
          eyebrow: "Perfil",
          title:
            "Un desarrollador enfocado en entrega que conecta procesos de negocio, arquitectura backend y ejecución de equipo.",
          intro:
            "Patricio Montes Güemez es Software Developer con experiencia verificada en .NET, Java, TypeScript, Python, Node, bases de datos, plataformas cloud e integraciones.",
          details: [
            "Su trabajo reciente incluye APIs RESTful para control de flota en tiempo real, un ecosistema multiagente con IA, memoria local y arneses TDD más SDD, boilerplates de microservicios, despliegues cloud, arquitectura de API Gateway y herramientas administrativas de soporte.",
            "El portfolio público usa únicamente datos profesionales verificados y omite información personal sensible que no corresponde publicar en un sitio estático."
          ]
        },
        experience: {
          eyebrow: "Experiencia",
          title: "Línea de tiempo profesional verificada",
          intro:
            "Los roles se basan en los datos provistos del CV y se presentan sin inventar clientes privados ni métricas no verificadas."
        },
        skills: {
          eyebrow: "Habilidades",
          title: "Mapa tecnológico",
          intro: "Agrupado desde las categorías tecnológicas verificadas del CV."
        },
        projects: {
          eyebrow: "Proyectos e impacto",
          title: "Trabajo verificado seleccionado",
          intro: "Los ejemplos usan únicamente datos de proyecto provistos por el CV.",
          linkLabel: "Abrir enlace verificado"
        },
        education: {
          eyebrow: "Educación y formación",
          title: "Educación formal, idiomas y cursos",
          intro:
            "La formación se redacta de manera conservadora cuando el CV lista el estado como actual."
        },
        contact: {
          eyebrow: "Contacto",
          title: "Hablemos sobre backends, integraciones y flujos de entrega.",
          intro:
            "Elegí el canal que mejor se ajuste a la conversación: WhatsApp para coordinación directa, email para contexto detallado o LinkedIn para contacto profesional.",
          whatsappLabel: "Escribir por WhatsApp",
          emailLabel: "Enviar email a Patricio",
          linkedinLabel: "Abrir perfil de LinkedIn",
          whatsappDescription: "Ideal para coordinación rápida.",
          emailDescription: "Ideal para contexto de proyecto y adjuntos.",
          linkedinDescription: "Ideal para networking profesional.",
          copyEmailLabel: "Email"
        }
      }
    },
    pt: {
      skipToContent: "Ir para o conteúdo",
      nav: {
        about: "Perfil",
        experience: "Experiência",
        skills: "Competências",
        projects: "Impacto",
        education: "Formação",
        contact: "Contato"
      },
      controls: {
        languageLabel: "Escolher idioma",
        themeLabel: "Escolher tema visual"
      },
      exports: {
        modernPdfLabel: "Baixar CV PDF moderno",
        atsPdfLabel: "Baixar CV PDF ATS",
        pdfHint: "Os dois arquivos são gerados com PDFKit e servidos como assets estáticos do portfólio."
      },
      hero: {
        eyebrow: "Desenvolvedor de Software",
        title: "Backend, cloud e entrega de produto com mentalidade prática de engenharia.",
        subtitle:
          "Construo APIs, integrações, ferramentas administrativas e fluxos de entrega com .NET, Java, TypeScript, plataformas cloud e práticas de engenharia assistidas por IA.",
        primaryCta: "Entrar em contato",
        secondaryCta: "Ver experiência",
        availability:
          "Disponível para desenvolvimento de software, apoio de arquitetura e integrações.",
        focusAreas: ["APIs REST", "Integrações cloud", "Ferramentas de engenharia", "Code review"]
      },
      stats: [
        {
          value: "10+",
          label: "anos em entrega de software",
          detail:
            "De suporte técnico e integrações BPM até desenvolvimento sênior e decisões de arquitetura."
        },
        {
          value: "3",
          label: "ecossistemas cloud em trabalhos verificados",
          detail:
            "Azure Platform, Google Cloud Platform e arquitetura sobre Google App Engine."
        },
        {
          value: "ES / EN / PT",
          label: "idiomas do portfólio",
          detail:
            "O conteúdo está disponível em espanhol, inglês e português sem recursos exclusivos de servidor."
        }
      ],
      sections: {
        about: {
          eyebrow: "Perfil",
          title:
            "Um desenvolvedor focado em entrega que conecta processos de negócio, arquitetura backend e execução em equipe.",
          intro:
            "Patricio Montes Güemez é Software Developer com experiência verificada em .NET, Java, TypeScript, Python, Node, bancos de dados, plataformas cloud e integrações.",
          details: [
            "Seu trabalho recente inclui APIs RESTful para controle de frota em tempo real, um ecossistema multiagente com IA, memória local e harnesses TDD mais SDD, boilerplates de microserviços, implantações cloud, arquitetura de API Gateway e ferramentas administrativas de suporte.",
            "O portfólio público usa apenas fatos profissionais verificados e omite informações pessoais sensíveis que não são adequadas para um site estático público."
          ]
        },
        experience: {
          eyebrow: "Experiência",
          title: "Linha do tempo profissional verificada",
          intro:
            "Os papéis abaixo são baseados nos fatos fornecidos pelo CV e apresentados sem inventar clientes privados ou métricas não verificadas."
        },
        skills: {
          eyebrow: "Competências",
          title: "Mapa tecnológico",
          intro: "Agrupado a partir das categorias tecnológicas verificadas do CV."
        },
        projects: {
          eyebrow: "Projetos e impacto",
          title: "Trabalho verificado selecionado",
          intro: "Os exemplos abaixo usam apenas fatos de projeto fornecidos pelo CV.",
          linkLabel: "Abrir link verificado"
        },
        education: {
          eyebrow: "Educação e formação",
          title: "Educação formal, idiomas e cursos",
          intro:
            "A formação é descrita de forma conservadora quando o CV lista o status como atual."
        },
        contact: {
          eyebrow: "Contato",
          title: "Vamos conversar sobre backends, integrações e fluxos de entrega.",
          intro:
            "Escolha o canal que melhor se ajusta à conversa: WhatsApp para coordenação direta, email para contexto detalhado ou LinkedIn para networking profissional.",
          whatsappLabel: "Enviar WhatsApp",
          emailLabel: "Enviar email para Patricio",
          linkedinLabel: "Abrir perfil no LinkedIn",
          whatsappDescription: "Melhor para coordenação rápida.",
          emailDescription: "Melhor para contexto de projeto e anexos.",
          linkedinDescription: "Melhor para networking profissional.",
          copyEmailLabel: "Email"
        }
      }
    }
  },
  experience: [
    {
      company: "Urbetrack",
      role: "Sr .Net Developer",
      period: { en: "July 2024 — April 2026", es: "Julio 2024 — Abril 2026", pt: "Julho 2024 — Abril 2026" },
      highlights: {
        en: [
          "Developed RESTful APIs for a real-time fleet-control application covering GPS positioning, fuel, and maintenance workflows.",
          "Built an AI multi-agent ecosystem with local memory and TDD plus SDD harnesses.",
          "Created administrative ASPX tools for help desk operations, participated in code review, and managed deployments."
        ],
        es: [
          "Desarrolló APIs RESTful para control de flotas en tiempo real con GPS, combustible y mantenimiento.",
          "Construyó un ecosistema multiagente con IA, memoria local y arneses TDD más SDD.",
          "Creó herramientas ASPX para mesa de ayuda, participó en code review y gestionó despliegues."
        ],
        pt: [
          "Desenvolveu APIs RESTful para controle de frota em tempo real com GPS, combustível e manutenção.",
          "Construiu um ecossistema multiagente com IA, memória local e harnesses TDD mais SDD.",
          "Criou ferramentas ASPX para help desk, participou de code review e gerenciou implantações."
        ]
      },
      tech: [".NET", "REST APIs", "ASPX", "TDD", "SDD"]
    },
    {
      company: "Digbang",
      role: "Sr .Net Developer",
      period: { en: "July 2023 — January 2024", es: "Julio 2023 — Enero 2024", pt: "Julho 2023 — Janeiro 2024" },
      highlights: {
        en: [
          "Created a .NET 7 microservice boilerplate serving a React Native web/backoffice and Android/iOS mobile apps for commercial-center discounts.",
          "Ran horizontal-scaling experiments for interconnected .NET and Node.js social-messaging apps and detected memory and synchronization problems.",
          "Supported documentation, estimates, development, tests, and implementation."
        ],
        es: [
          "Creó un boilerplate .NET 7 para microservicios que servían una web/backoffice React Native y apps Android/iOS de descuentos.",
          "Experimentó con escalado horizontal de aplicaciones .NET y Node.js interconectadas y detectó problemas de memoria y sincronización.",
          "Acompañó documentación, estimaciones, desarrollo, pruebas e implementación."
        ],
        pt: [
          "Criou um boilerplate .NET 7 para microserviços que atendiam web/backoffice React Native e apps Android/iOS de descontos.",
          "Experimentou escalado horizontal de aplicações .NET e Node.js interconectadas e detectou problemas de memória e sincronização.",
          "Apoiou documentação, estimativas, desenvolvimento, testes e implementação."
        ]
      },
      tech: ["Envoyer", ".NET 7", "Azure Platform", "Redis", "Azure Service Bus", "Node.js"]
    },
    {
      company: "Sideas",
      role: "Sr Full Stack Developer",
      period: { en: "November 2022 — July 2023", es: "Noviembre 2022 — Julio 2023", pt: "Novembro 2022 — Julho 2023" },
      highlights: {
        en: [
          "Worked on a survey personalization app for a client in the Netherlands with Argentina offices.",
          "Supported requirements understanding, documentation, feature development, and Azure deployments."
        ],
        es: [
          "Trabajó en una app de personalización de encuestas para un cliente de Países Bajos con oficinas en Argentina.",
          "Acompañó requerimientos, documentación, desarrollo de funcionalidades y despliegues en Azure."
        ],
        pt: [
          "Trabalhou em uma app de personalização de pesquisas para um cliente na Holanda com escritórios na Argentina.",
          "Apoiou requisitos, documentação, desenvolvimento de funcionalidades e implantações no Azure."
        ]
      },
      tech: ["Azure", ".NET Core", "Angular", "Angular Material"]
    },
    {
      company: "UNX Digital / Grupo Prominente",
      role: "Software Architect",
      period: { en: "April 2022 — November 2022", es: "Abril 2022 — Noviembre 2022", pt: "Abril 2022 — Novembro 2022" },
      highlights: {
        en: [
          "Defined architecture decisions for communication between applications.",
          "Implemented a .NET Core API Gateway with Ocelot on Google App Engine.",
          "Integrated OIDC tokens from GCP to solve authentication; the architecture was validated by Google Argentina DevOps, and he trained other teams."
        ],
        es: [
          "Definió arquitectura para comunicación entre aplicaciones e implementó un API Gateway .NET Core con Ocelot en Google App Engine.",
          "Integró tokens OIDC desde GCP para resolver autenticación; la arquitectura fue validada por Google Argentina DevOps y capacitó a otros equipos."
        ],
        pt: [
          "Definiu arquitetura para comunicação entre aplicações e implementou um API Gateway .NET Core com Ocelot no Google App Engine.",
          "Integrou tokens OIDC do GCP para resolver autenticação; a arquitetura foi validada pelo Google Argentina DevOps e treinou outras equipes."
        ]
      },
      tech: ["Google Cloud Platform", "Google App Engine", ".NET Core", "Ocelot", "OIDC"]
    },
    {
      company: "UNX Digital / Grupo Prominente",
      role: "Sr Software Developer",
      period: { en: "September 2021 — April 2022", es: "Septiembre 2021 — Abril 2022", pt: "Setembro 2021 — Abril 2022" },
      highlights: {
        en: [
          "Worked on Apex America modernization.",
          "Developed .NET Core 5 APIs and services for cross-application business needs."
        ],
        es: [
          "Trabajó en la modernización de Apex America.",
          "Desarrolló APIs y servicios .NET Core 5 para necesidades de negocio entre aplicaciones."
        ],
        pt: [
          "Trabalhou na modernização da Apex America.",
          "Desenvolveu APIs e serviços .NET Core 5 para necessidades de negócio entre aplicações."
        ]
      },
      tech: ["Google Cloud Platform", ".NET Core 5", "C#", "APIs"]
    },
    {
      company: "UNX Digital / Grupo Prominente",
      role: "Ssr .Net Developer",
      period: { en: "October 2019 — September 2021", es: "Octubre 2019 — Septiembre 2021", pt: "Outubro 2019 — Setembro 2021" },
      highlights: {
        en: [
          "Worked across Java DDD APIs, ERP components, a Python backup assistant, C#/Java financial applications, insurance broker components, and backend integrations with Jira, Jenkins, GitLab, and SonarQube."
        ],
        es: [
          "Trabajó en APIs Java con DDD, componentes ERP, un asistente de backup en Python, aplicaciones financieras C#/Java, componentes para productores de seguros e integraciones con Jira, Jenkins, GitLab y SonarQube."
        ],
        pt: [
          "Trabalhou em APIs Java com DDD, componentes ERP, assistente de backup em Python, aplicações financeiras C#/Java, componentes para corretores de seguros e integrações com Jira, Jenkins, GitLab e SonarQube."
        ]
      },
      tech: ["Java", "Gradle", "Angular", "JUnit", "Python", "C#", "HTML", "CSS", "JavaScript"]
    },
    {
      company: "Codeicus",
      role: "Sr Software Developer",
      period: { en: "December 2020 — September 2021", es: "Diciembre 2020 — Septiembre 2021", pt: "Dezembro 2020 — Setembro 2021" },
      highlights: {
        en: [
          "Built internal credit-area management tools, defined ERP domains, maintained React Native Android/iOS merchandising releases, and reviewed a .NET WCF communication module."
        ],
        es: [
          "Construyó herramientas internas para área crediticia, definió dominios ERP, mantuvo releases de una app React Native Android/iOS de merchandising y revisó un módulo .NET WCF."
        ],
        pt: [
          "Construiu ferramentas internas para área de crédito, definiu domínios ERP, manteve releases de uma app React Native Android/iOS de merchandising e revisou um módulo .NET WCF."
        ]
      },
      tech: ["Java", "Maven", "JSF", "Draw.io", "Whimsical", "React Native", "C#"]
    },
    {
      company: "ECIC Systems",
      role: "Technical Leader",
      period: { en: "December 2018 — October 2019", es: "Diciembre 2018 — Octubre 2019", pt: "Dezembro 2018 — Outubro 2019" },
      highlights: {
        en: [
          "Designed BPM solutions with the development team and estimated incidents with technical resolution details, delegation, and project follow-up."
        ],
        es: [
          "Diseñó soluciones BPM con el equipo y estimó incidentes con detalles técnicos de resolución, delegación y seguimiento de proyectos."
        ],
        pt: [
          "Desenhou soluções BPM com a equipe e estimou incidentes com detalhes técnicos de resolução, delegação e acompanhamento de projetos."
        ]
      },
      tech: ["BPM", "Technical leadership", "Estimation", "Project follow-up"]
    },
    {
      company: "ECIC Systems",
      role: "IT Developer",
      period: { en: "October 2016 — December 2018", es: "Octubre 2016 — Diciembre 2018", pt: "Outubro 2016 — Dezembro 2018" },
      highlights: {
        en: [
          "Developed back-end support for BPM-managed business processes, integrated BPM with REST APIs for e-commerce and messaging, linked SQL databases with Softland and Bejerman ERPs, and supported business consulting."
        ],
        es: [
          "Desarrolló back-end para procesos BPM, integró BPM con APIs REST para e-commerce y mensajería, vinculó bases SQL con ERPs Softland y Bejerman, y acompañó consultoría."
        ],
        pt: [
          "Desenvolveu back-end para processos BPM, integrou BPM com APIs REST para e-commerce e mensagens, conectou bancos SQL com ERPs Softland e Bejerman, e apoiou consultoria."
        ]
      },
      tech: ["BPM", "REST APIs", "SQL", "Softland", "Bejerman"]
    },
    {
      company: "ECIC Systems",
      role: "Technical Support",
      period: { en: "August 2015 — August 2016", es: "Agosto 2015 — Agosto 2016", pt: "Agosto 2015 — Agosto 2016" },
      highlights: {
        en: ["Provided hardware and software support for S.O.S network operators in Rosario."],
        es: ["Brindó soporte de hardware y software para operadores de red S.O.S en Rosario."],
        pt: ["Prestou suporte de hardware e software para operadores de rede S.O.S em Rosario."]
      },
      tech: ["Hardware support", "Software support", "Operations"]
    },
    {
      company: "Luxsys S.R.L / Freelance",
      role: "Web Designer",
      period: { en: "August 2014 — August 2015", es: "Agosto 2014 — Agosto 2015", pt: "Agosto 2014 — Agosto 2015" },
      highlights: {
        en: ["Built and hosted business websites with WordPress and Hostinger."],
        es: ["Construyó y alojó sitios web comerciales con WordPress y Hostinger."],
        pt: ["Construiu e hospedou sites comerciais com WordPress e Hostinger."]
      },
      tech: ["WordPress", "Hostinger", "Web design"]
    }
  ],
  skills: [
    { name: { en: "Programming", es: "Programación", pt: "Programação" }, items: ["C#", "Java", "TypeScript", "Python", "Node"] },
    { name: { en: "Web", es: "Web", pt: "Web" }, items: ["HTML", "CSS", "SASS", "Bootstrap", "MDB"] },
    { name: { en: "Frameworks", es: "Frameworks", pt: "Frameworks" }, items: [".NET", "Spring Boot", "Entity Framework", "Angular"] },
    { name: { en: "Databases", es: "Bases de datos", pt: "Bancos de dados" }, items: ["SQL Server", "PostgreSQL", "MySQL", "Supabase", "MongoDB"] },
    { name: { en: "Platforms", es: "Plataformas", pt: "Plataformas" }, items: ["Azure Platform", "Google Cloud Platform", "Redis", "Azure Service Bus"] },
    { name: { en: "Delivery tools", es: "Herramientas de entrega", pt: "Ferramentas de entrega" }, items: ["Git", "GitLab", "GitHub", "Bamboo", "Jenkins", "Jira", "SonarQube"] },
    { name: { en: "Design and QA", es: "Diseño y QA", pt: "Design e QA" }, items: ["Design Patterns", "JUnit", "Postman", "SoapUI", "Draw.io", "Whimsical", "Excalidraw", "Figma", "Obsidian", "Report Builder"] }
  ],
  projects: [
    {
      name: "Gestión de circuito deportivo",
      context: {
        en: "Verified public platform",
        es: "Plataforma pública verificada",
        pt: "Plataforma pública verificada"
      },
      description: {
        en: "Centralized, fully responsive platform for managing sports circuits, tournaments, players, news, rankings, and related operations.",
        es: "Plataforma centralizada y completamente responsive para gestionar circuitos deportivos, torneos, jugadores, noticias, rankings y operaciones relacionadas.",
        pt: "Plataforma centralizada e totalmente responsiva para gerenciar circuitos esportivos, torneios, jogadores, notícias, rankings e operações relacionadas."
      },
      link: "https://circuitoarredepadel.com/"
    },
    {
      name: "Incoders corporate site and admin platform",
      context: {
        en: "Verified public corporate site",
        es: "Sitio corporativo público verificado",
        pt: "Site corporativo público verificado"
      },
      description: {
        en: "Corporate site with an admin panel for estimates and budgets, automatic invoicing, product builder workflows, CRM operations, and a financial dashboard.",
        es: "Sitio corporativo con panel administrativo para estimaciones y presupuestos, facturación automática, flujos de product builder, operaciones CRM y dashboard financiero.",
        pt: "Site corporativo com painel administrativo para estimativas e orçamentos, faturamento automático, fluxos de product builder, operações de CRM e dashboard financeiro."
      },
      link: "https://www.incoders.com.ar/"
    },
    {
      name: "Olympus",
      context: { en: "Codeicus — July 2020 to September 2020", es: "Codeicus — Julio 2020 a Septiembre 2020", pt: "Codeicus — Julho 2020 a Setembro 2020" },
      description: {
        en: "Internal project-management software developed with DDD, Java, and Angular; integrated with Jira, Jenkins, and GitLab APIs and included a JUnit unit test suite.",
        es: "Software interno de gestión de proyectos desarrollado con DDD, Java y Angular; integrado con APIs de Jira, Jenkins y GitLab, e incluyó tests unitarios JUnit.",
        pt: "Software interno de gestão de projetos desenvolvido com DDD, Java e Angular; integrado com APIs de Jira, Jenkins e GitLab, e incluiu testes unitários JUnit."
      },
      link: ""
    },
    {
      name: "Infocovid",
      context: { en: "Codeicus — March 2020 to April 2020", es: "Codeicus — Marzo 2020 a Abril 2020", pt: "Codeicus — Março 2020 a Abril 2020" },
      description: {
        en: "Hotfix participation on a paisanos.io MVP for finding scarce products in nearby stores and supermarkets during COVID-19.",
        es: "Participación en hotfixes de un MVP de paisanos.io para encontrar productos escasos en comercios y supermercados cercanos durante COVID-19.",
        pt: "Participação em hotfixes de um MVP da paisanos.io para encontrar produtos escassos em lojas e supermercados próximos durante a COVID-19."
      },
      link: "https://infocovid.online/"
    },
    {
      name: "Siegwerk São Paulo implementation",
      context: { en: "June 2018", es: "Junio 2018", pt: "Junho 2018" },
      description: {
        en: "Productive integration between Softland ERP and LuxEvent BPM at the Diadema plant.",
        es: "Integración productiva entre Softland ERP y LuxEvent BPM en la planta de Diadema.",
        pt: "Integração produtiva entre Softland ERP e LuxEvent BPM na planta de Diadema."
      },
      link: ""
    },
    {
      name: "GDS Balancer final project",
      context: { en: "UTN FRBA — March 2018 to July 2018", es: "UTN FRBA — Marzo 2018 a Julio 2018", pt: "UTN FRBA — Março 2018 a Julho 2018" },
      description: {
        en: "Rules engine for GDS for Almundo.com travel agency, covering analysis through design.",
        es: "Motor de reglas para GDS de la agencia de viajes Almundo.com, cubriendo desde análisis hasta diseño.",
        pt: "Motor de regras para GDS da agência de viagens Almundo.com, cobrindo da análise ao design."
      },
      link: ""
    },
    {
      name: "UX/UI course final web project",
      context: { en: "Comunidad IT / Accenture Rosario — May 2016 to July 2016", es: "Comunidad IT / Accenture Rosario — Mayo 2016 a Julio 2016", pt: "Comunidad IT / Accenture Rosario — Maio 2016 a Julho 2016" },
      description: {
        en: "Web system for sports-court rentals created as the course final project.",
        es: "Sistema web para alquiler de canchas deportivas creado como proyecto final del curso.",
        pt: "Sistema web para aluguel de quadras esportivas criado como projeto final do curso."
      },
      link: ""
    },
    {
      name: "UTN Rosario research project",
      context: { en: "March 2012 to December 2012", es: "Marzo 2012 a Diciembre 2012", pt: "Março 2012 a Dezembro 2012" },
      description: {
        en: "Administration resources chair project focused on improving faculty processes.",
        es: "Proyecto de la cátedra Administración de Recursos orientado a mejorar procesos de la facultad.",
        pt: "Projeto da cadeira Administração de Recursos voltado a melhorar processos da faculdade."
      },
      link: ""
    }
  ],
  education: [
    {
      name: {
        en: "Information Systems Engineering",
        es: "Ingeniería en Sistemas de Información",
        pt: "Engenharia em Sistemas de Informação"
      },
      institution: "Universidad Tecnológica Nacional, Facultad Regional Rosario",
      period: {
        en: "March 2008 — listed as ongoing in the CV",
        es: "Marzo 2008 — listado como Actualidad en el CV",
        pt: "Março 2008 — consta como em andamento no CV"
      },
      details: {
        en: "Listed without adding unverified graduation or current-status claims.",
        es: "Se lista sin agregar egreso ni estado actual no verificado.",
        pt: "Listado sem adicionar graduação ou status atual não verificado."
      }
    },
    {
      name: {
        en: "Bachiller y Técnico Electromecánico",
        es: "Bachiller y Técnico Electromecánico",
        pt: "Bachiller y Técnico Electromecánico"
      },
      institution: "E.E.T. N°1 \"Fray Luis Beltrán\"",
      period: {
        en: "March 2004 — December 2006",
        es: "Marzo 2004 — Diciembre 2006",
        pt: "Março 2004 — Dezembro 2006"
      },
      details: {
        en: "Secondary technical education.",
        es: "Educación técnica secundaria.",
        pt: "Educação técnica secundária."
      }
    },
    {
      name: { en: "English training", es: "Formación en inglés", pt: "Formação em inglês" },
      institution: "Open English",
      period: {
        en: "May 2021 — listed as ongoing in the CV",
        es: "Mayo 2021 — listado como Actualidad en el CV",
        pt: "Maio 2021 — consta como em andamento no CV"
      },
      details: {
        en: "Level 2/8 with TOEFL/TOEIC preparation listed in the CV; no fluency claim is added.",
        es: "Nivel 2/8 con preparación TOEFL/TOEIC listada en el CV; no se agrega afirmación de fluidez.",
        pt: "Nível 2/8 com preparação TOEFL/TOEIC listada no CV; nenhuma afirmação de fluência é adicionada."
      }
    },
    {
      name: { en: "English training", es: "Formación en inglés", pt: "Formação em inglês" },
      institution: "Education First",
      period: { en: "July 2016 — July 2017", es: "Julio 2016 — Julio 2017", pt: "Julho 2016 — Julho 2017" },
      details: {
        en: "Level 9/16, basic professional competence according to the CV.",
        es: "Nivel 9/16, competencia profesional básica según el CV.",
        pt: "Nível 9/16, competência profissional básica segundo o CV."
      }
    },
    {
      name: { en: "Angular 11", es: "Angular 11", pt: "Angular 11" },
      institution: "Educación IT",
      period: { en: "March 2021 — April 2021", es: "Marzo 2021 — Abril 2021", pt: "Março 2021 — Abril 2021" },
      details: {
        en: "Course listed in verified training.",
        es: "Curso listado en la formación verificada.",
        pt: "Curso listado na formação verificada."
      }
    },
    {
      name: { en: "UX/UI Design", es: "Diseño UX/UI", pt: "Design UX/UI" },
      institution: "Comunidad IT",
      period: { en: "May 2016 — July 2016", es: "Mayo 2016 — Julio 2016", pt: "Maio 2016 — Julho 2016" },
      details: {
        en: "Course listed in verified training.",
        es: "Curso listado en la formación verificada.",
        pt: "Curso listado na formação verificada."
      }
    },
    {
      name: {
        en: "Reporting Services SSRS and Basic Accounting",
        es: "Reporting Services SSRS y Contabilidad básica",
        pt: "Reporting Services SSRS e Contabilidade básica"
      },
      institution: "Educación IT",
      period: {
        en: "April 2017 — February 2019",
        es: "Abril 2017 — Febrero 2019",
        pt: "Abril 2017 — Fevereiro 2019"
      },
      details: {
        en: "Reporting Services SSRS was completed April-May 2017; Basic Accounting was completed January-February 2019.",
        es: "Reporting Services SSRS fue realizado en abril-mayo 2017; Contabilidad básica en enero-febrero 2019.",
        pt: "Reporting Services SSRS foi concluído em abril-maio 2017; Contabilidade básica em janeiro-fevereiro 2019."
      }
    }
  ]
} as const;

export type PortfolioContent = typeof portfolioContent;
