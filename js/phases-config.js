/** Phase metadata — question data loaded from data/phase-XX.json */
export const PHASE_GROUPS = [
  {
    id: "core-java",
    title: "Core Java",
    phases: [
      {
        id: "phase-01",
        file: "phase-01.json",
        title: "Phase 1 — Java Foundations",
        topics:
          "Hello World, Datatypes & Variables, Operators, Control Flow, Methods, Arrays",
      },
      {
        id: "phase-02",
        file: "phase-02.json",
        title: "Phase 2 — OOP Core",
        topics:
          "OOP Fundamentals, Encapsulation, Has-A & Is-A, Polymorphism & Abstraction",
      },
      {
        id: "phase-03",
        file: "phase-03.json",
        title: "Phase 3 — Advanced Java",
        topics:
          "Object/String, Exceptions, File I/O, Generics, Collections, Streams, Regex, Multithreading",
      },
    ],
  },
  {
    id: "dbms",
    title: "DBMS & MySQL",
    phases: [
      {
        id: "phase-04",
        file: "phase-04.json",
        title: "Phase 4 — Database & SQL Basics",
        topics:
          "DB fundamentals, MySQL setup, ER model, DDL/DML/DQL/DCL/TCL, CRUD, WHERE, GROUP BY, aggregates",
      },
      {
        id: "phase-05",
        file: "phase-05.json",
        title: "Phase 5 — Advanced SQL & Design",
        topics:
          "Joins, subqueries, views, indexes, transactions, normalization, procedures, triggers, events",
      },
    ],
  },
  {
    id: "backend",
    title: "Java Backend",
    phases: [
      {
        id: "phase-06",
        file: "phase-06.json",
        title: "Phase 6 — Testing & Hibernate Intro",
        topics: "JUnit, Mockito, Hibernate ORM core, entity mappings",
      },
      {
        id: "phase-07",
        file: "phase-07.json",
        title: "Phase 7 — Hibernate Advanced & Spring Core",
        topics:
          "Hibernate fetching/caching, Spring DI, bean lifecycle, annotation config",
      },
      {
        id: "phase-08",
        file: "phase-08.json",
        title: "Phase 8 — Spring MVC",
        topics:
          "MVC architecture, controllers, model binding, validation, DTOs, pagination, OpenAPI",
      },
      {
        id: "phase-09",
        file: "phase-09.json",
        title: "Phase 9 — Spring Boot, Security & Cloud",
        topics:
          "REST APIs, Spring Security, Cloud (Eureka, Feign, Gateway), RabbitMQ basics",
      },
    ],
  },
  {
    id: "angular",
    title: "Angular & Frontend",
    phases: [
      {
        id: "phase-10",
        file: "phase-10.json",
        title: "Phase 10 — Web Basics & Angular Intro",
        topics: "HTML/CSS/Tailwind/JS/TS basics, Angular architecture, components, data binding",
      },
      {
        id: "phase-11",
        file: "phase-11.json",
        title: "Phase 11 — Directives, Forms & Services",
        topics: "Directives, @Input/@Output, template & reactive forms, DI, pipes",
      },
      {
        id: "phase-12",
        file: "phase-12.json",
        title: "Phase 12 — Routing, HTTP & Auth",
        topics: "Router, modules, HttpClient, RxJS, JWT interceptors, route guards",
      },
    ],
  },
  {
    id: "devops",
    title: "DevOps & Tools",
    phases: [
      {
        id: "phase-13",
        file: "phase-13.json",
        title: "Phase 13 — Docker, Git & Architecture",
        topics:
          "Docker images/containers/volumes/networking, Git workflow, application architecture",
      },
    ],
  },
];

export function getAllPhases() {
  return PHASE_GROUPS.flatMap((g) =>
    g.phases.map((p) => ({ ...p, groupTitle: g.title, groupId: g.id }))
  );
}

export function getPhaseById(id) {
  return getAllPhases().find((p) => p.id === id);
}
