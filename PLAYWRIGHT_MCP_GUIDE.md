# Playwright MCP & BDD: End-to-End Guide

This guide explains how we used the **Playwright MCP Server** to autonomously plan and implement a **Behavior Driven Development (BDD)** test suite for SauceDemo.

## 1. Introduction: What is Playwright MCP?

The **Model Context Protocol (MCP)** for Playwright acts as the "eyes and hands" of the AI agent.

-   **Eyes (Inspect)**: The agent can "see" the web page structure (snapshots) to identify selectors.
-   **Hands (Interact)**: The agent can click, type, and navigate to explore the application flow.

**Why is this powerful?**
Instead of guessing selectors or asking you to copy-paste HTML, the AI explicitly explores the application to ensure the code it writes is accurate and functional from the start.

---

## 2. Installation & Setup

To use Playwright with an AI agent via MCP, you need to run the MCP server.

### Prerequisites
- Node.js (v18 or higher)
- Playwright browsers installed (`npx playwright install`)

### Running the Server
The Playwright MCP server can be run directly using `npx`:

```bash
npx -y @modelcontextprotocol/server-playwright
```

### Configuring Your AI Client
If you are using an MCP-compatible client (like Claude Desktop or a custom agent), you need to add the server to your configuration:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-playwright"
      ]
    }
  }
}
```

Once configured, the `browser_*` tools (navigate, click, snapshot, etc.) will become available to the AI.

---

## 3. Understanding BDD (Behavior Driven Development)

We implemented a BDD framework using `playwright-bdd`.

### Core Concepts
1.  **Feature File (`.feature`)**: Describes *what* the application should do in plain English (Gherkin syntax).
    *   *Example*: "Given I am on the login page..."
2.  **Step Definitions (`.steps.ts`)**: The glue code that links Gherkin lines to actual code logic.
3.  **Page Object Model (POM)**: The implementation layer. Classes that wrap page selectors and actions (`LoginPage`, `InventoryPage`).

### The Architecture
The AI uses this triangle of separation to create maintainable tests:

```mermaid
graph TD
    A[Feature File] -->|Matches| B[Step Definitions]
    B -->|Calls| C[Page Object Model]
    C -->|Manipulates| D[Browser / App]
```

---

## 4. The Workflow: From Request to Code

Here is the exact step-by-step process we used to build the SauceDemo suite.

```mermaid
sequenceDiagram
    participant User
    participant AI as AI Agent
    participant MCP as Playwright MCP
    participant Browser

    User->>AI: "Create BDD tests"
    
    Note over AI, Browser: PHASE 1: DISCOVERY
    AI->>MCP: browser_navigate
    MCP->>Browser: Goto URL
    AI->>MCP: browser_snapshot
    MCP-->>AI: Returns YAML with selectors
    
    Note over AI, Browser: PHASE 2: EXPLORATION
    AI->>MCP: browser_fill_form
    MCP->>Browser: Perform Login
    
    Note over AI, Browser: PHASE 3: GENERATION
    AI->>User: Write Files (Feature, Steps, POM)
```

### Step 1: Discovery (The "Eyes")

The goal of this phase is to "see" the page structure without needing to download the entire HTML source code.

**How it works:**
1.  **Navigation**: The AI uses `browser_navigate` to open the URL.
2.  **Snapshotting**: The AI calls `browser_snapshot`. This helps the AI by converting the complex DOM into a simplified list of interactive elements (like inputs, buttons, and links).

**Visual Flow:**

```mermaid
graph LR
    URL[https://saucedemo.com] -->|1. browser_navigate| Browser
    Browser -->|2. browser_snapshot| Snapshot[Accessibility Snapshot]
    Snapshot -->|3. AI Analysis| Insight["Identifies: data-test='username'"]
```

**Why this is better:**
The snapshot filters out noise (like `<div>` wrappers for styling) and focuses purely on what a user can interact with, making selector discovery much more accurate.

---

### Step 2: Interaction (The "Hands")

Static analysis isn't enough. To write a "Checkout" test, the AI must actually **do** the checkout to find the hidden fields.

**How it works:**
1.  **Action**: The AI uses `browser_fill_form` inputs and `browser_click` maps to perform the login.
2.  **Reaction**: The browser navigates to the Inventory page.
3.  **Validation**: The AI takes a new snapshot to confirm it has arrived at the correct page.

**Interaction Loop:**

```mermaid
sequenceDiagram
    participant AI
    participant Browser
    
    Note over AI, Browser: Attempting Login
    AI->>Browser: Fill "standard_user", "secret_sauce"
    AI->>Browser: Click "Login" button
    Browser-->>AI: Navigates to /inventory.html
    AI->>Browser: browser_snapshot()
    Browser-->>AI: Returns Inventory Items
```

---

### Step 3: Synthesis (The "Brain")

This is where the "Intelligence" happens. The AI doesn't just copy the first selector it sees. It evaluates the snapshot to find the **most robust** strategy.

**The Decision Process:**
*   **Bad Selector**: `id="user-name"` (Might change)
*   **Okay Selector**: `input[name="user-name"]`
*   **Best Selector**: `data-test="username"` (Designed for testing)

**Mapping Process:**

```mermaid
graph TD
    Raw[Raw Snapshot Element] -->|Filter Strategy| Best[Best Selector]
    Best -->|Map to Class| PO[Page Object Property]
    
    subgraph Logic Example
    E1[Element: input data-test='username'] -->|Select| E2[data-test='username']
    E2 --> E3[this.usernameInput]
    end
```

---

### Step 4: Code Generation (The "Output")

Finally, the AI compiles the knowledge (user flows + robust selectors) into the actual files. It splits the logic into the BDD "Triangle".

**Generation Flow:**

```mermaid
graph LR
    Knowledge[Captured Knowledge] -->|Generate| Files
    
    Files --> F[Feature File]
    F -->|Describes| Flow["Scenario: Login"]
    
    Files --> S[Step Definition]
    S -->|Implements| Logic["await loginPage.login()"]
    
    Files --> P[Page Object]
    P -->|Defines| Selectors["this.usernameInput"]
```

**Result:** The generated code is standard Playwright code. It has no dependency on the MCP server and can be run in any CI/CD environment.

---

## 5. Sample Code Generated via MCP

Here is a more complex example: **The Checkout Flow**. This demonstrates how the AI handles forms, multiple interactions, and assertions.

### A. The Input (Snapshot of Checkout Page)
*From a `browser_snapshot` call on `/checkout-step-one.html`:*
```yaml
- generic:
  - textbox "First Name" [ref=e143]
    - attribute: data-test="firstName"
  - textbox "Last Name" [ref=e145]
    - attribute: data-test="lastName"
  - textbox "Zip/Postal Code" [ref=e147]
    - attribute: data-test="postalCode"
  - button "Continue" [ref=e152]
    - attribute: data-test="continue"
```

### B. The Output (Complex Page Object)
The AI maps these inputs to a reusable class with a helper method `fillInformation`.

**`tests/pages/CheckoutPage.ts`**
```typescript
import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Direct mapping from snapshot attributes
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
  }

  // Complex action method generated by AI
  async fillInformation(firstName: string, lastName: string, zip: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(zip);
    await this.continueButton.click();
  }
}
```

### C. The Logic (Parameterized Step Definitions)
The AI handles the Gherkin parameter passing `{string}` to drive the data.

**`tests/steps/checkout.steps.ts`**
```typescript
import { When } from '../fixtures';

When('I fill in my information with {string}, {string}, {string}', 
  async ({ checkoutPage }, firstName: string, lastName: string, zip: string) => {
    // The step definition delegates the complex data entry to the POM
    await checkoutPage.fillInformation(firstName, lastName, zip);
});
```

### D. The Behavior (Full Feature)
**`tests/features/checkout.feature`**
```gherkin
Scenario: Complete Checkout Flow
    Given I am logged in
    When I add "Sauce Labs Backpack" to the cart
    And I proceed to checkout from the cart
    # Passing complex data through Gherkin
    And I fill in my information with "John", "Doe", "12345"
    And I finish the checkout
    Then I should see the order success message
```

---

## 6. Deep Dive: Architecture in Action

This section shows how a **single user action** (Login) is architected across the three layers.

### Layer 1: The Requirement (Feature File)
*File: `tests/features/login.feature`*
This uses **plain English** so stakeholders can read it.
```gherkin
Scenario: Successful Login
    # This line triggers the code below
    When I login with valid credentials
```

### Layer 2: The Logic (Step Definition)
*File: `tests/steps/login.steps.ts`*
This maps the Gherkin sentence to a function. It uses **Dependency Injection** (`{ loginPage }`) to get access to the Page Object.
```typescript
import { When } from '../fixtures';

// Matches the Gherkin line exactly
When('I login with valid credentials', async ({ loginPage }) => {
  // Delegates the actual work to the Page Object
  await loginPage.login('standard_user', 'secret_sauce');
});
```

### Layer 3: The Implementation (Page Object)
*File: `tests/pages/LoginPage.ts`*
This contains the **Playwright specifics** (selectors, locators). If the UI changes, you update *only* this file.
```typescript
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Selectors found via MCP Snapshot
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
  }

  // The method called by the Step Definition
  async login(username: string, pass: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
  }
}
```

---

## 7. Best Practices & Troubleshooting

### Best Practices for AI Agents
1.  **Use Snapshots, Not HTML**: Always prefer `browser_snapshot` over reading raw HTML. It is faster, less token-intensive, and provides a cleaner view of interactive elements.
2.  **Atomic Interactions**: ask the AI to do one logical thing at a time (e.g., "Add to cart", not "Add to cart and checkout and pay"). This reduces error rates.
3.  **Robust Selectors**: Explicitly instruct the AI to prioritize `data-test`, `id`, or `aria-label` attributes over CSS classes, which often change.

### Common Issues
*   **Server Not Found**: Ensure you ran `npx @modelcontextprotocol/server-playwright` and that your AI client is configured to point to it.
*   **Timeouts**: If a page is slow to load, the AI might try to snapshot before it's ready. Instruct the AI to "Wait for the page to load" or use `wait_for` logic.
*   **Large Snapshots**: Extremely complex pages might return massive snapshots. In these cases, try to use more specific directives like "Snapshot the header only".

---

## 8. Summary

1.  **AI + MCP** explores the site like a human user.
2.  It **discovers** robust selectors (like `data-test`).
3.  It **architects** the solution into BDD layers (Features, Steps, POM).
4.  It **generates** standard, standalone Playwright code that you can own and run.
