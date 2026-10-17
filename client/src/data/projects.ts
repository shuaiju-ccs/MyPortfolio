// -----------------------------------------------------------------------------
// projects.ts — single source of truth for project data.
// Author: Shuai Ju
//
// This file has no JSX and no React imports on purpose: it's just a typed
// array of plain objects. Both the /projects listing page and the
// /projects/:id detail page import from here, so adding a project or fixing
// a typo happens in exactly one place.
//
// The `.ts` extension (not `.tsx`) signals to TypeScript that there's no
// JSX inside. If you ever add a React element to this file, rename it to
// `.tsx` — otherwise the compiler will refuse to parse the angle brackets.
// -----------------------------------------------------------------------------
import projectDashboardImage from '../assets/project-dashboard.svg';
import projectMobileImage from '../assets/project-mobile.svg';
import projectApiImage from '../assets/project-api.svg';

// Shape of one project entry. Grouping the list-card fields (image, role,
// outcome) together with the detail-page fields (description, techStack,
// timeline) into one type means the listing and detail views can't get
// out of sync — both read from the same object.
export type Project = {
  id: string;
  title: string;
  image: string;
  imageAlt: string;
  role: string;
  outcome: string;
  // Detail-only fields:
  description: string[];
  techStack: string[];
  timeline: string;
  liveUrl?: string;
  repoUrl?: string;
};

export const PROJECTS: Project[] = [
  {
    id: 'MatchMyHome',
    title: 'MatchMyHome home-sharing platform',
    image: projectDashboardImage,
    imageAlt: 'Illustration of an analytics dashboard with charts',
    role: 'Software Requirement Engineer',
    outcome:
      'MatchMyHome is a self-contained, cross-platform digital marketplace and matching engine designed to facilitate secure, intergenerational co-living arrangements.',
    description: [
      'MatchMyHome is a self-contained, cross-platform digital marketplace and matching engine designed to facilitate secure, intergenerational co-living arrangements.'
    ],
    techStack: ['React', 'TypeScript', 'Recharts', 'Web Workers', 'Vite', 'Vitest'],
    timeline: 'Jan 2024 – Nov 2024'
  },
  {
    id: 'Inventra',
    title: 'Inventory management system',
    image: projectMobileImage,
    imageAlt: 'Illustration of a phone showing a trail map',
    role: 'Python program developer',
    outcome:
      'A Python-based inventory management system designed for small businesses to efficiently manage products and stock.',
    description: [
      'This project was developed as part of a **Software Fundamentals course**, applying: Python programming, object-oriented design, and data structures to create a functional inventory management system. The system allows users to add, update, and track inventory items, providing a user-friendly interface for small business owners.'
    ],
    techStack: ['React Native', 'TypeScript', 'SQLite', 'MapLibre', 'Expo'],
    timeline: 'Feb 2023 – Jul 2023'
  },
  {
    id: 'BookED',
    title: 'BookED',
    image: projectApiImage,
    imageAlt: 'Illustration of API endpoints and data flow',
    role: 'Software System Designer',
    outcome:
      'Room and Equipment Booking System "BookED"',
    description: [
      'Room and Equipment Booking System "BookED”, ED stands for Education. As the name suggests, it is an educational_Resource_Booking System we are building for Centennial College. With a centralized, web-based, automated platform where students, staff, and faculty can search real-time availability and reserve those shared educational resources — Including but not limited to study rooms, labs, books and portable equipment. It replaces the old-fashioned manual booking system like emails or even in-person sign-up sheets.'
    ],
    techStack: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Kafka', 'OpenTelemetry'],
    timeline: 'Aug 2022 – Dec 2023'
  }
];
