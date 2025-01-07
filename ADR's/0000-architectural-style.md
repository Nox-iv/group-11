---
status: "Accepted"
date: 07/10/2024
decision-makers: [Tom, Cameron, Hein]
---

# Adopt a Microservices Architecture for AML

## Context and Problem Statement

The Advanced Media Library (AML) system must support a wide range of functions (online registration, multi-branch operations, borrowing/returning media, payment processing, procurement, etc.) across a large number of branches all with different operational hours and user demands. There is also a 10% yearly increase in the amount of users, strict accessibility requirements (e.g., WCAG 2 compliance), and the need for 24/7 availability.

With the vast complexity of AML’s capabilities—multi-branch resource sharing, real-time reservation updates, mobile/multi device integration, and seamless scaling across England, a monolithic or purely layered architecture would become very difficult to maintain and scale over time. A microservices approach is a promising solution due to its modularity, scalability, and flexibility.

## Decision Drivers

* **Scalability** – The system must handle yearly growth (10% yearly) and spikes in media usage across multiple branches.
* **Maintainability** – AML has complex, changing requirements such as multi-branch resource sharing, new payment methods, ongoing procurement processes, and frequent feature requests.
* **Continuous Availability** – The system needs 24/7 uptime for online services and must allow for rolling updates with minimal disruption.
* **Accessibility and Compliance** – WCAG 2 and GDPR compliance require well-defined boundaries for services handling user data and interactions.
* **Distributed Team and Branch Operations** – Different AML branches (Sheffield, Manchester, Bristol, etc.) need to operate independantly, while still sharing resources.

## Considered Options

1. **Monolithic Architecture**  
   All functionalities of AML (user registration, media inventory, procurement, payment, notifications, etc.) bundled into a single, large application.

2. **Layered (N-tier) Architecture**  
   Separate concerns into presentation, business logic, and data layers, but still deployed as a single unit.

3. **Microservices Architecture**  
   Each major functionality (e.g., user management, search, borrowing, payments, notifications) is an independent service communicating via APIs.

4. **Serverless/FaaS**  
   Implement the system’s functions as separate serverless components that scale automatically, with event-driven triggers.

## Pros and Cons of the Options

### Microservices Architecture (Chosen)

- **Good, because**  
  - **Modular & Scalable** – Each service can be scaled independently based on usage patterns.  
  - **Independent Deployments** – Lower risk of deploying updates to a single component.  
  - **Isolation & Resilience** – Service failures remain localized rather than affecting the entire system.  
- **Bad, because**  
  - **Complex Infrastructure** – Requires well-structured DevOps, container orchestration, and network management.  
  - **Increased Learning Curve** – Teams must be trained in microservices best practices.  

### Monolithic Architecture

- **Good, because**  
  - **Simpler to Deploy Initially** – Only one application to maintain and deploy.  
  - **Straightforward Debugging** – Logs are aggregated in one place.  
- **Bad, because**  
  - **Difficulty Scaling** – Entire application must be scaled as a unit, leading to inefficiency.  
  - **High Maintenance Over Time** – Large codebase quickly becomes unwieldy as features grow.  
  - **Slower Release Cycles** – Every change requires full regression testing and redeployment.  

### Layered (N-tier) Architecture

- **Good, because**  
  - **Clear Separation of Concerns** – Presentation, business logic, and data layers.  
  - **Mature Approach** – Many developers are familiar with n-tier.  
- **Bad, because**  
  - **Still Deployed as One Unit** – Tends to become monolithic for large systems like AML.  
  - **Limited Independent Scaling** – All layers scale together, even if only one layer is overloaded.  

### Serverless/FaaS

- **Good, because**  
  - **Scales Automatically** – Functions scale on demand.  
  - **Pay-per-Execution Model** – Potential cost savings for intermittent workloads.  
- **Bad, because**  
  - **Complex Integration** – Might require many small functions, raising operational overhead.  
  - **Cold Starts** – Can introduce latency for user-facing services requiring quick responses.  
  - **Vendor Lock-in** – Tied to a particular cloud provider’s implementation.  

## Decision Outcome

**Chosen option**: **Microservices Architecture**, because it best supports the growth and complexity of AML’s services while providing clear service boundaries for:
1. Independent scaling of services (e.g., search vs. payment).
2. Easier maintenance, updates, and continuous delivery.
3. Reduced risk of system-wide failures if one service is down, others can continue running.
4. Greater ability to adhere to new compliance or accessibility requirements in a single service without affecting the entire system.