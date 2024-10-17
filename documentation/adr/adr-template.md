---
# These are optional metadata elements. Feel free to remove any of them.
status: "{proposed }"
date: {2024-10-10 when the decision was last updated}
decision-makers: { Hein Htet Zaw}
consulted: {list everyone whose opinions are sought (typically subject-matter experts); and with whom there is a two-way communication}
informed: {list everyone who is kept up-to-date on progress; and with whom there is a one-way communication}
---

# {Advanced Library Management System, representative of solved problem and micro services}

## Context and Problem Statement

How to define the AML system requirements?
How to design and implement the solutions to those requirements? 
How those solutions adhere to accessibility standards?

<!-- This is an optional element. Feel free to remove. -->
## Decision Drivers

* {decision driver 1, e.g., a responsive system, scalibility of users concern, …}
* {decision driver 2, e.g., a centralised system, managing diverse media collection, …}
* {decision driver 3, e.g., an integrated system, multi-media access like phone, email are required}
* {decision driver 4, e.g., a payment system, easy to use payment option} 
* … <!-- numbers of drivers can vary -->

## Considered Options

* Layered Architecture
* Client-Server 
* Micro Services
* … <!-- numbers of options can vary -->

## Decision Outcome

Chosen option: "{Micro Services}", because scalibility can be improved easily and functionalities can be broken down into its own independent states, thus reduce dependencies and allow easier scaling.

<!-- This is an optional element. Feel free to remove. -->
### Consequences

* Good, because of improvement in performance and scalability
* Good, because fault tolerance can be prepared
* Bad, because of increased complexity in system development and more effort needed in maintainence
* … <!-- numbers of consequences can vary -->

<!-- This is an optional element. Feel free to remove. -->
### Confirmation

The implementation of the adr will be confirmed through following actions:
* Design and code reviews to ensure the solution architecture follows best practices
* Performance testing to confirm the requirements of solution architecure is fulfilled
* Monitor to track the system's health, performance and complexity 

<!-- This is an optional element. Feel free to remove. -->
## Pros and Cons of the Options

### {Layered Architecture}

<!-- This is an optional element. Feel free to remove. -->
{example | description | pointer to more information | …}

* Good, because seperation of concerns between services can be acheieved,thus making it easier to manage
* Good, because each layer can be tested independently
* Bad, because having multiple layers can over complicate the architecture
* Bad, because changes may not be flexible enough to meet the requirements in practice
* … <!-- numbers of pros and cons can vary -->

### Client Server Architecture

{example | description | pointer to more information | …}

* Good, because of centralised management of system information
* Neutral, because network performance is crucial in relaying information between multiple users
* Bad, because a single point of failure can take out the communication between server and clients 
* …

<!-- This is an optional element. Feel free to remove. -->
## More Information

{You might want to provide additional evidence/confidence for the decision outcome here and/or document the team agreement on the decision and/or define when/how this decision the decision should be realized and if/when it should be re-visited. Links to other decisions and resources might appear here as well.}
