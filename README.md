# Real-time Chat Application

## Overview
This project is a real-time chat application created for learning purposes. Users can send and receive messages in real time.

## Technologies Used
The following technologies and libraries are used in this project:

### Framework
- [Next.js](https://nextjs.org/) v13.4.4

### Programming Language
- [TypeScript](https://www.typescriptlang.org/) v5.1.3

### UI & Styling
- [Tailwind CSS](https://tailwindcss.com/) v3.3.2

### State Management
- [Zustand](https://github.com/pmndrs/zustand)

## Directory Structure
Below represents the directory structure of the project:

```
.
├── app         # Stores the main application pages
├── components  # React components
│ ├── chat      # Components and hooks related to chat
│ ├── signin    # Components and hooks related to signing in
│ └── ui        # General-purpose UI components
├── domain      # Domain models (business logic)
├── hooks       # React hooks that are used throughout the application
├── infra       # Handles connections to external APIs
├── lib         # General utilities and libraries
├── repository  # Repositories that abstract communication with the APIs
├── store       # Stores for state management
└── utils       # General helper functions
```

## Backend
Using API below as a backend <br />
[chat-api](https://github.com/ShunsukeNagashima/chat-api)

## Install and Setup

### Install
```
npm install
```

### Copy env
```
cp .env.example .env
```

### Set env for firebase authentication
To handle authentication, we utilize Firebase Authentication, which requires creating a project and an app to retrieve the necessary environment variables. For more details, please refer to the [official website](https://firebase.google.com/docs/web/setup)


### Start at local
```
npm run dev
```
