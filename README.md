Here’s a README.md draft for your Vite + TypeScript CRD app, tailored to your assignment instructions:

---

# Week 13 Assignment: CRD App with Vite and TypeScript

This project is my submission for the Week 13 assignment: **Preparing for React using Vite**. The goal was to migrate my previous CRD (Create, Read, Delete) app to a modern development setup using [Vite](https://vitejs.dev/) and [TypeScript](https://www.typescriptlang.org/).

## Assignment Objectives

- Rebuild the CRD app using Vite and TypeScript
- Practice updating legacy code to new tools and standards
- Split code into multiple files for better structure
- Fix all TypeScript type errors
- Demonstrate understanding through code comments and a walkthrough video

---

## Project Setup & Structure

### 1. Vite + TypeScript

- Created a new Vite project using the **Vanilla + TypeScript** template  
  `npm create vite@latest` → Choose `Vanilla` and then `TypeScript`
- All source code is in TypeScript (`.ts` files)

### 2. Migrating the CRD App

- All previous CRD logic and HTML were integrated into the new Vite project
- Only one script tag (`index.ts`) is connected to the HTML
- No extra JS or CSS link tags were added, as required
- If using external CSS (like Bootstrap), it’s imported via TypeScript

### 3. TypeScript Refactoring

- All variables, functions, and DOM elements are properly typed
- Custom types/interfaces are used for data entities (see `types.ts`)
- All TypeScript errors were fixed (verified via `npm run build`)
- Type assertions (e.g., `as HTMLDivElement`) are used where appropriate

### 4. Modular Code

- Code is split into at least 3 TypeScript files:
  - `index.ts` — app entry point
  - `api.ts` — handles API requests (fetch, create, delete)
  - `dom.ts` — handles rendering and DOM manipulation
  - (Additional files like `types.ts` for type definitions as needed)
- All modules use ES6 `import`/`export`

### 5. Testing

- The app supports creating, reading, and deleting entities
- Works with `npm run dev` (Vite’s dev server)
- No TypeScript errors in the project

---

## Getting Started

1. **Clone the repo:**
   ```bash
   git clone https://github.com/TrulyUnruly/week13-vite.git
   cd week13-vite
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the app:**
   ```bash
   npm run dev
   ```

4. **(Optional) Run JSON Server:**
   - If your app uses a local `db.json`, start [json-server](https://github.com/typicode/json-server):
     ```bash
     npx json-server --watch db.json
     ```

---

## Additional Notes

- `.gitignore` includes `/node_modules` as required.
- `package.json` is committed with all dependencies.
- All code is commented for clarity and learning purposes.
- The grading team can clone, install, and run the app locally.

---

## Video Walkthrough

A short video explaining and demonstrating the project can be found here:  
https://youtu.be/AabtpdpUgug

## Assignment Checklist

- [x] Vite + TypeScript project created
- [x] CRD app code migrated and functional
- [x] All TypeScript type errors fixed
- [x] At least 3 TypeScript files using import/export
- [x] `.gitignore` and `package.json` included
- [x] Video walkthrough recorded and linked

---

## License

This project is for educational purposes only.

---

