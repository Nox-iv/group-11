---
status: "accepted"
date: {2024-11-09}
decision-makers: {Thomas Gordge, Cameron Smith, Hein Zaw}
consulted: {SAAD Module Team}
informed: {SAAD Module team}
---

# Use Microservices Architectural Style to Facilitate Cost-Effective System Scaling.

## Context and Problem Statement

It is clear that the new AML system will require some degree of horizontal scaling to accomodate the millions of existing users and the projected annual growth of 10%. However, the scaling mechanism itself needs futher consideration due to the nature of the system. AML's project proposal consolidates all of their customer-facing and internal business operations into a single system. It's highly likely that these operations will experience distinct levels of user-traffic, and have unique computation requirements. Scaling the entire system to accomodate high-levels of resource usage by a single business operation, e.g. media search, is not a very cost effective approach to scaling. Coming to a cost-effective solution will require partitoning distinct business processes into indvidual services so that they can be scaled independently. This raises the question of how to partition the system into services that can be scaled effectively.

## Decision Drivers

* AML's proposed system covers all of their customer-facing and internal use-cases. Naturally, these use-cases have very different requirements of the system which are best implemented using differing technology stacks. For example, the use-case where an AML member who searches for a media item and then borrows the item is best implemented using a combination of a relational database and a secondary full-text search index. Whereas, the use-case where an AML administrator generates a nation-wide report on media borrowing trends is probably more suited to a column-store database like Google Cloud Big Table. The architectural style needs to support flexibility with regards to the technology stack used for a specific part of the system.
* In additon to scaling elastically, the system must be availabe 24/7. Such a high degree of availability can only be guaranteed by building an extremely fault-tolerant system. For this reason, it is best to avoid centralized services which many other services depend upon. If a highly-coupled centralized service fails, then other services will fail alongside it leading to a system-wide outage. To prevent this occuring, services should be decentralized and granular, using mirror tables to minimse communication between one another. Decentralization comes with significant overhead, so it's important to maintain a balance so that any cost savings from indepedent scaling aren't offset by this overhead.

## Considered Options

* Microservices
* Service-Oriented
* Distributed Monolith

## Decision Outcome

Chosen option: "Microservices" - Given the varied business processes that the system must facilitate and the technological needs that come with this, microservices comes as out as the best option in terms of flexibility with regards to the tech stack for different parts of the system. Additionally, microservices will increase the resiliency of the system in comparison to SOA, which is essential given the high availability requirement of the system.

### Consequences

* Good - Allows easy integration of several technologies into the system, each technology being best suited to a certain set of use-cases.
* Good - Decentralized services will increase the resilience of the system by reducing the probability system-wide failures.
* Good - Enables indepent scaling of services reducing the operational risk that comes with under-provisioing resources, and the cost of over-provisioning resources.
* Good - Because outages are isolated to a single service, recovery times after outages are short.
* Bad- Introduces a high degree of complexity into system infrastructure - data consistency.
* Bad - Potential for the overhead of decentralized services outweighing the cost-savings made by independently scaling services.
* Bad - Increases the complexity for developers - now have to get familiar with several codebases and technology stacks.

### Confirmation

A container diagram (C4 model) has been produced documenting the proposed microservices architecture. This ADR can be confirmed as implemented if the system adheres to the documented design.

## Pros and Cons of the Options

### Service-Orientation

Service-Orientation is similar to microservices, however depends upon centralized shared resources that are more tightly coupled with shared data models and business logic.

* Good - Provides ability to independently scale disintct services without introducing a massive degree of complexity.
* Good - Shared data models & logic makes the system easy to work with, increasing development velocity.
* Bad - High coupling so there are several single points of failure which can cause system-wide outages.
* Bad - Long recovery time after system outage due to the high degree of coupling between services.

### Distributed Monolith

A distributed monolith is made up independently deployed services which have a very high degree of coupling.

* Good - Simple development and release process as there is a single CI/CD pipeline, and the codebase uses share datam models and components.
* Good - Stronger data consistency guarantees because services interact synchronously.
* Bad - Indepedent scaling is difficult because of the high-degree of coupling between services.
* Bad - Lower resiliency compared to other architectures due to the high degree of coupling between services increasing the likliehood of system-wide outages

## More Information

The architectures considered here are very similar in nature due to the fact that they're all distributed. The key difference is the degree of coupling between the services, and the granularity of ther services. Since the microservice architecture has been chosen given the cost-beneift analysis above, it is important that this architecture is actually implemented correctly. This will require implementing each service as a separate project, and using decentralized techniques such as the deployment of mirror tables to ensure the services are truly independent.
