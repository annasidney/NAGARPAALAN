# NAGARPAALAN 

**Modular Civic Infrastructure Intelligence Platform**

NAGARPAALAN AI is a modern, full-stack platform for monitoring, analyzing, and managing civic infrastructure. Built with a modular architecture, it combines geospatial analytics, real-time data pipelines, and AI-driven insights to empower municipal decision-making.

---

## Overview

NAGARPAALAN (नगरपालन — "City Governance") provides a unified interface for civic bodies to track infrastructure health, route citizen grievances, forecast maintenance needs, and visualize spatial data — all backed by a robust API and extensible plugin architecture.

---

## Architecture

| Layer        | Technology                          | Purpose                                |
|--------------|-------------------------------------|----------------------------------------|
| **Frontend** | React + TypeScript + Vite           | Interactive dashboards & maps          |
| **Backend**  | FastAPI (Python)                    | REST API, business logic, AI services  |
| **Database** | PostgreSQL 16 + PostGIS 3.4         | Relational + geospatial data store     |
| **Cache**    | Redis 7                            | Caching, task queues, pub/sub          |
| **Infra**    | Docker Compose                     | Local development orchestration        |

> See [`docs/architecture.md`](docs/architecture.md) for detailed diagrams and component descriptions.

---

## Tech Stack

| Component       | Version / Details          |
|-----------------|----------------------------|
| Python          | 3.11+                     |
| FastAPI         | 0.110+                    |
| SQLAlchemy      | 2.x (async)               |
| Alembic         | 1.13+                     |
| PostgreSQL      | 16                        |
| PostGIS         | 3.4                       |
| Redis           | 7 (Alpine)                |
| React           | 18+                       |
| TypeScript      | 5.x                       |
| Vite            | 5.x                       |
| Docker Compose  | v2+                       |
| Node.js         | 18+                       |

---

## Prerequisites

Ensure the following are installed on your development machine:

- **Python** 3.11 or higher — [python.org](https://www.python.org/downloads/)
- **Node.js** 18 or higher — [nodejs.org](https://nodejs.org/)
- **Docker** & **Docker Compose** v2+ — [docker.com](https://www.docker.com/get-started)
- **Git** — [git-scm.com](https://git-scm.com/)

---

