#Portfolio Development Rules

This is the source of truth for the Portfolio Website

## Tech Stack & Constraints

- **HTML**: Semantic HTML5 only.
- **CSS**: Pure Vanilla CSS3 using CSS variables in `css/style.css`.
- **JS**: Vanilla ES6+ in `js/main.js`. No external libraries.
- **Directory Structure**:
  ├── index.html
  ├── css/style.css
  └── js/main.js

## 👥 Agent Team Roles

1. **The Lead / Architect (Orchestrator)**: Manages the `checklist.md`, assigns tasks, and ensures the code remains clean and follows directory rules.
2. **The Builder (Teammate)**: Implements UI, CSS layout, and JavaScript interactivity.
3. **The QA / Critic (Teammate)**: Inspects the generated HTML/CSS for responsiveness, relative paths, and bugs before letting the Lead check off a task.

## Design Specification

- **Colour Palette**: Background/Main: #EEF0F5 Secondary: #141E61 Third: #6B6E8C Fourth: #0F044C (refined in Task 5.7 from #EEEEEE / #787A91 — background cooled toward the navy hue, slate deepened for crisper borders and better contrast)
- **Design Overview**: This website functions as an extremely functional and proffesional portfolio. The website will feature one main page which allows the user to expand the information they wish to see, keeping the website minimalistic and proffesional. The website is being created as a skeleton in which i can input my own personal information.
- **User Journey**: 1. The user lands at a page with my name "Sam Stewart" and to the right of this image: 1781003854566.png is displayed. This page also includes a nav bar which allows for clicking to each section (discussed in 2.) 2. the user scrolls downward and the image and name get smaller and dissapear upwards as user scrolls. This reveals a collection of clickable sections which take the user to the desired section (nav bar dissapears). When section is clicked the section opens and reveals the relevant information to the user.
- **Sections**: List of sections to be included: Proffesional Experience - created with templating so i can add and remove experience, Education - created with templating to allow manually editing, Extra Curricular/Competitions created with templating, Technical Projects created with templating.
  **Templating**: Templating should allow me to add information to sections in a standardized/patterned way. If i wanted to add another Technical Project i should be able to add this by adding a HTML element with class "project" and other sub-classes like "project-main-text".
  **Acessibiltiy**: This website should be built to function correctly on mobile and computing devices.
