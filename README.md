# People Management App - Simple Angular SPA

A simple Single Page Application to manage people list.

## Tech Stack
- **Frontend**: Angular 12.2.0
- **Language**: TypeScript 4.3.0
- **HTTP Client**: Angular HttpClient
- **Forms**: Angular Forms
- **Routing**: Angular Router
- **API**: JSONPlaceholder (for demo)
- **Build Tool**: Angular CLI 12.2.0

## Features
- List all people
- Edit person
- Delete person
- Add new person

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start app:
```bash
npm start
```

3. Open http://localhost:4200

## Structure
```
src/app/
├── app.module.ts          # Main module with routing
├── app.component.ts       # Root component
├── app.component.html     # Navigation + router outlet
├── person.service.ts      # Service + Person interface
├── list/
│   ├── list.component.ts  # List logic
│   └── list.component.html # List view
└── edit/
    ├── edit.component.ts  # Edit/Add logic
    └── edit.component.html # Edit/Add form
```

## API
Uses JSONPlaceholder: https://jsonplaceholder.typicode.com/users
